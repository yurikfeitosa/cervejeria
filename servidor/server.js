const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// 💾 CONEXÃO COM O CLOUD FIRESTORE
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🍺 FUNÇÃO SEED: Cadastra o catálogo de cervejas automaticamente se estiver vazio
const inicializarCatalogoCervejas = async () => {
  try {
    const produtosSnapshot = await db.collection('produtos').get();
    
    // Se já existirem produtos cadastrados, não faz nada
    if (!produtosSnapshot.empty) {
      console.log('📦 Catálogo de cervejas já existente no Firestore.');
      return;
    }

    console.log('🌱 Alimentando o Firestore com o catálogo inicial de cervejas...');
    const batch = db.batch();

    const cervejasNoProjeto = [
      { nomeProduto: "PILSEN", preco: 22.90, estilo: "Pilsen" },
      { nomeProduto: "TRIPEL", preco: 28.90, estilo: "Tripel" },
      { nomeProduto: "WEIZENBIER", preco: 24.90, estilo: "Weizenbier" }
    ];

    cervejasNoProjeto.forEach((cerveja) => {
      const docRef = db.collection('produtos').doc(); // ID Automático
      batch.set(docRef, cerveja);
    });

    await batch.commit();
    console.log('✅ Catálogo de cervejas salvo com sucesso no Firestore!');
  } catch (error) {
    console.error('❌ Erro ao inicializar catálogo:', error);
  }
};

// =========================================================================
// ROTA GET: Buscar a lista de produtos (cervejas) para o Select do Front-end
// =========================================================================
app.get('/api/produtos', async (req, res) => {
  try {
    const produtosSnapshot = await db.collection('produtos').get();
    const produtos = produtosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar catálogo de produtos.' });
  }
});

// =========================================================================
// ROTA POST ATUALIZADA: Grava o Pedido associando o Vendedor responsável
// =========================================================================
app.post('/api/pedidos', async (req, res) => {
  try {
    const { cliente, email, itens, vendedor } = req.body; // 🌟 Recebe 'itens' em vez de um único produtoId

    if (!cliente || !email || !itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'Dados incompletos ou carrinho vazio!' });
    }

    const clienteRef = db.collection('clientes').doc();
    const pedidoRef = db.collection('pedidos').doc();
    const batch = db.batch();

    // Salva o cliente
    batch.set(clienteRef, { nome: cliente, email: email });

    // 🌟 Estrutura o documento do pedido contendo a lista completa de compras
    batch.set(pedidoRef, {
      clienteId: clienteRef.id,
      vendedor: vendedor || "Venda Direta Site",
      itens: itens, // Guarda o Array [{ produtoId, quantidade }, ...]
      status: "Pendente",
      dataPedido: new Date().toISOString()
    });

    await batch.commit();
    return res.status(201).json({ mensagem: 'Pedido multilista gravado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro interno ao salvar pedido.' });
  }
});

// =========================================================================
// ROTA GET: Relatório Gerencial (Mantém o mesmo JOIN inteligente anterior)
// =========================================================================
app.get('/api/pedidos', async (req, res) => {
  try {
    const { email } = req.query; // 🌟 Captura o e-mail enviado pelo front-end

    // Busca as coleções básicas de clientes e produtos para o JOIN
    const [clientesSnapshot, produtosSnapshot] = await Promise.all([
      db.collection('clientes').get(),
      db.collection('produtos').get()
    ]);

    const clientesLista = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const produtosLista = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 🌟 DEFINIÇÃO DA BUSCA DE PEDIDOS COM FILTRO DINÂMICO
    let pedidosRef = db.collection('pedidos');
    let pedidosSnapshot;

    if (email) {
      // 1. Acha o documento do cliente que possui esse e-mail
      const clienteEncontrado = clientesLista.find(c => c.email === email);
      
      if (clienteEncontrado) {
        // 2. Filtra no Firestore trazendo APENAS os pedidos criados por este clienteId
        pedidosSnapshot = await pedidosRef.where('clienteId', '==', clienteEncontrado.id).get();
      } else {
        // Se o e-mail não existe no cadastro de clientes, retorna uma lista vazia direto
        return res.json([]);
      }
    } else {
      // Se não passar e-mail (caso queira uma visão geral master), traz tudo
      pedidosSnapshot = await pedidosRef.get();
    }

    const pedidosLista = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const relatorioCompleto = [];

    // Executa o JOIN normal (porém agora apenas com a lista filtrada)
    pedidosLista.forEach(pedido => {
      const clienteInfo = clientesLista.find(c => c.id === pedido.clienteId) || { nome: 'Não informado', email: '-' };
      
      let nomesCervejas = [];
      let valorTotalPedido = 0;

      if (pedido.itens && Array.isArray(pedido.itens)) {
        pedido.itens.forEach(item => {
          const produtoInfo = produtosLista.find(p => p.id === item.produtoId);
          if (produtoInfo) {
            nomesCervejas.push(`${item.quantidade}x ${produtoInfo.nomeProduto}`);
            valorTotalPedido += (Number(produtoInfo.preco) * item.quantidade);
          }
        });
      }

      relatorioCompleto.push({
        id: pedido.id,
        cliente: clienteInfo.nome,
        email: clienteInfo.email,
        vendedor: pedido.vendedor || "Não informado",
        produto: nomesCervejas.join(' | ') || "Nenhum item selecionado",
        preco: valorTotalPedido,
        status: pedido.status || 'Pendente',
        data: pedido.dataPedido,
        itensBrutos: pedido.itens || [] 
      });
    });

    return res.json(relatorioCompleto);
  } catch (error) {
    console.error("Erro ao gerar relatório filtrado:", error);
    return res.status(500).json({ erro: 'Erro ao gerar o relatório.' });
  }
});


// =========================================================================
// ROTA PUT: Atualiza os dados do cliente (Edição) ou o Status do Pedido
// =========================================================================
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteNome, clienteEmail, novosItens, status } = req.body; // 🌟 Recebe 'novosItens' do front-end

    const pedidoRef = db.collection('pedidos').doc(id);
    const pedidoDoc = await pedidoRef.get();

    if (!pedidoDoc.exists) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    const pedidoDados = pedidoDoc.data();
    const batch = db.batch();

    // 1. Atualização dos campos de texto do cliente
    if (clienteNome || clienteEmail) {
      const clienteRef = db.collection('clientes').doc(pedidoDados.clienteId);
      const dadosAtualizacaoCliente = {};
      if (clienteNome) dadosAtualizacaoCliente.nome = clienteNome;
      if (clienteEmail) dadosAtualizacaoCliente.email = clienteEmail;

      batch.update(clienteRef, dadosAtualizacaoCliente);
    }

    // 2. 🌟 Atualização da cerveja selecionada e quantidade dentro do Pedido
    if (novosItens && Array.isArray(novosItens)) {
      batch.update(pedidoRef, { itens: novosItens });
    }

    // 3. Atualização de status
    if (status) {
      batch.update(pedidoRef, { status: status });
    }

    await batch.commit();
    return res.json({ mensagem: 'Registro totalmente atualizado no Firestore!' });
  } catch (error) {
    console.error('Erro no PUT pedidos:', error);
    return res.status(500).json({ erro: 'Erro interno ao atualizar dados.' });
  }
});

// =========================================================================
// ROTA DELETE: Remove o Pedido e limpa o Cliente vinculado no Firestore
// =========================================================================
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pedidoRef = db.collection('pedidos').doc(id);
    const pedidoDoc = await pedidoRef.get();

    if (!pedidoDoc.exists) {
      return res.status(404).json({ erro: 'Pedido não localizado.' });
    }

    const { clienteId } = pedidoDoc.data();
    const batch = db.batch();

    // Deleta o documento do pedido
    batch.delete(pedidoRef);

    // Remove também o cliente correspondente para não deixar dados órfãos
    if (clienteId) {
      const clienteRef = db.collection('clientes').doc(clienteId);
      batch.delete(clienteRef);
    }

    await batch.commit();
    return res.json({ mensagem: 'Pedido e dependências removidos em lote!' });
  } catch (error) {
    console.error('Erro no DELETE pedidos:', error);
    return res.status(500).json({ erro: 'Erro interno ao remover dados.' });
  }
});

// =======================================================
// 🍺 CRUD DE PRODUTOS (CATÁLOGO DE CERVEJAS) NO FIRESTORE
// =======================================================

// 1. CREATE: Recebe a cerveja do React e salva na coleção 'produtos'
app.post('/api/produtos', async (req, res) => {
  try {
    const { nomeProduto, preco } = req.body;
    
    // Comando do Firestore para adicionar um novo documento
    const docRef = await db.collection('produtos').add({
      nomeProduto: nomeProduto,
      preco: Number(preco)
    });

    return res.status(201).json({ mensagem: 'Cerveja cadastrada com sucesso', id: docRef.id });
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    return res.status(500).json({ erro: 'Falha ao salvar produto no Firestore.' });
  }
});

// 2. READ: Busca todas as cervejas do Firestore e manda pro React
app.get('/api/produtos', async (req, res) => {
  try {
    // Comando do Firestore para ler a coleção inteira
    const snapshot = await db.collection('produtos').get();
    
    // Monta a lista com os IDs
    const catalogo = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json(catalogo);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return res.status(500).json({ erro: 'Falha ao buscar produtos.' });
  }
});

// 3. UPDATE: Recebe os dados alterados do React e atualiza no Firestore
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const idProduto = req.params.id;
    const { nomeProduto, preco } = req.body;

    // Comando do Firestore para atualizar um documento específico pelo ID
    await db.collection('produtos').doc(idProduto).update({
      nomeProduto: nomeProduto,
      preco: Number(preco)
    });

    return res.json({ mensagem: 'Cerveja atualizada com sucesso!' });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ erro: 'Falha ao atualizar produto.' });
  }
});

// 4. DELETE: Exclui a cerveja do Firestore
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const idProduto = req.params.id;

    // Comando do Firestore para deletar o documento pelo ID
    await db.collection('produtos').doc(idProduto).delete();

    return res.json({ mensagem: 'Cerveja removida com sucesso!' });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ erro: 'Falha ao deletar produto.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  inicializarCatalogoCervejas(); // 🔥 Roda a semente assim que o servidor liga
});