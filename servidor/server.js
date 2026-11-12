const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// CONEXÃO COM O CLOUD FIRESTORE
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// FUNÇÃO SEED: Cadastra o catálogo de cervejas automaticamente se estiver vazio
const inicializarCatalogoCervejas = async () => {
  try {
    const produtosSnapshot = await db.collection('produtos').get();
    
    // Se já existirem produtos cadastrados, não faz nada
    if (!produtosSnapshot.empty) {
      console.log('Catálogo de cervejas já existente no Firestore.');
      return;
    }

    console.log('Alimentando o Firestore com o catálogo inicial de cervejas...');
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
    console.error('❌ Erro ao inicializar catálogo:', error.message);
  }
};

// Funções Auxiliares (Refatoração para diminuir a complexidade da rota GET /pedidos)
const buscarClientesEProdutos = async () => {
  const [clientesSnapshot, produtosSnapshot] = await Promise.all([
    db.collection('clientes').get(),
    db.collection('produtos').get()
  ]);

  const clientesLista = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const produtosLista = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return { clientesLista, produtosLista };
};

const buscarPedidosFiltrados = async (email, clientesLista) => {
  let pedidosRef = db.collection('pedidos');
  
  if (email) {
    const clienteEncontrado = clientesLista.find(c => c.email === email);
    if (clienteEncontrado) {
      const snapshot = await pedidosRef.where('clienteId', '==', clienteEncontrado.id).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return []; // E-mail não encontrado
  }
  
  const snapshot = await pedidosRef.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const processarRelatorio = (pedidosLista, clientesLista, produtosLista) => {
  return pedidosLista.map(pedido => {
    const clienteInfo = clientesLista.find(c => c.id === pedido.clienteId) || { nome: 'Não informado', email: '-' };
    
    let nomesCervejas = [];
    let valorTotalPedido = 0;

    if (Array.isArray(pedido.itens)) {
      pedido.itens.forEach(item => {
        const produtoInfo = produtosLista.find(p => p.id === item.produtoId);
        if (produtoInfo) {
          nomesCervejas.push(`${item.quantidade}x ${produtoInfo.nomeProduto}`);
          valorTotalPedido += (Number(produtoInfo.preco) * item.quantidade);
        }
      });
    }

    return {
      id: pedido.id,
      cliente: clienteInfo.nome,
      email: clienteInfo.email,
      vendedor: pedido.vendedor || "Não informado",
      produto: nomesCervejas.join(' | ') || "Nenhum item selecionado",
      preco: valorTotalPedido,
      status: pedido.status || 'Pendente',
      data: pedido.dataPedido,
      itensBrutos: pedido.itens || [] 
    };
  });
};

// CRUD DE PEDIDOS

// ROTA POST: Grava o Pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const { cliente, email, itens, vendedor } = req.body;

    if (!cliente || !email || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'Dados incompletos ou carrinho vazio!' });
    }

    const clienteRef = db.collection('clientes').doc();
    const pedidoRef = db.collection('pedidos').doc();
    const batch = db.batch();

    batch.set(clienteRef, { nome: cliente, email: email });

    batch.set(pedidoRef, {
      clienteId: clienteRef.id,
      vendedor: vendedor || "Venda Direta Site",
      itens: itens, 
      status: "Pendente",
      dataPedido: new Date().toISOString()
    });

    await batch.commit();
    return res.status(201).json({ mensagem: 'Pedido multilista gravado com sucesso!' });
  } catch (error) {
    console.error('Erro no POST pedidos:', error.message);
    return res.status(500).json({ erro: 'Erro interno ao salvar pedido.' });
  }
});

// ROTA GET: Relatório Gerencial (Refatorado para baixa complexidade)
app.get('/api/pedidos', async (req, res) => {
  try {
    const { email } = req.query;

    const { clientesLista, produtosLista } = await buscarClientesEProdutos();
    const pedidosLista = await buscarPedidosFiltrados(email, clientesLista);
    
    if (pedidosLista.length === 0) {
       return res.json([]);
    }

    const relatorioCompleto = processarRelatorio(pedidosLista, clientesLista, produtosLista);
    return res.json(relatorioCompleto);

  } catch (error) {
    console.error("Erro ao gerar relatório filtrado:", error.message);
    return res.status(500).json({ erro: 'Erro interno ao gerar o relatório.' });
  }
});

// ROTA PUT: Atualiza o Pedido
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteNome, clienteEmail, novosItens, status } = req.body;

    const pedidoRef = db.collection('pedidos').doc(id);
    const pedidoDoc = await pedidoRef.get();

    if (!pedidoDoc.exists) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    const pedidoDados = pedidoDoc.data();
    const batch = db.batch();

    if (clienteNome || clienteEmail) {
      const clienteRef = db.collection('clientes').doc(pedidoDados.clienteId);
      const dadosAtualizacaoCliente = {};
      if (clienteNome) dadosAtualizacaoCliente.nome = clienteNome;
      if (clienteEmail) dadosAtualizacaoCliente.email = clienteEmail;

      batch.update(clienteRef, dadosAtualizacaoCliente);
    }

    if (Array.isArray(novosItens)) {
      batch.update(pedidoRef, { itens: novosItens });
    }

    if (status) {
      batch.update(pedidoRef, { status: status });
    }

    await batch.commit();
    return res.json({ mensagem: 'Registro atualizado no Firestore!' });
  } catch (error) {
    console.error('Erro no PUT pedidos:', error.message);
    return res.status(500).json({ erro: 'Erro interno ao atualizar dados.' });
  }
});

// ROTA DELETE: Remove o Pedido
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

    batch.delete(pedidoRef);

    if (clienteId) {
      const clienteRef = db.collection('clientes').doc(clienteId);
      batch.delete(clienteRef);
    }

    await batch.commit();
    return res.json({ mensagem: 'Pedido e dependências removidos!' });
  } catch (error) {
    console.error('Erro no DELETE pedidos:', error.message);
    return res.status(500).json({ erro: 'Erro interno ao remover dados.' });
  }
});

// CRUD DE PRODUTOS

// ROTA POST: Salvar Produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { nomeProduto, preco } = req.body;
    
    if (!nomeProduto || preco == null) {
        return res.status(400).json({ erro: 'Dados do produto inválidos.' });
    }

    const docRef = await db.collection('produtos').add({
      nomeProduto: nomeProduto,
      preco: Number(preco)
    });

    return res.status(201).json({ mensagem: 'Cerveja cadastrada', id: docRef.id });
  } catch (error) {
    console.error("Erro ao salvar produto:", error.message);
    return res.status(500).json({ erro: 'Falha interna ao salvar produto.' });
  }
});

// ROTA GET: Listar Produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const snapshot = await db.collection('produtos').get();
    const catalogo = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json(catalogo);
  } catch (error) {
    console.error("Erro ao listar produtos:", error.message);
    return res.status(500).json({ erro: 'Falha interna ao buscar produtos.' });
  }
});

// ROTA PUT: Atualizar Produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const idProduto = req.params.id;
    const { nomeProduto, preco } = req.body;

    await db.collection('produtos').doc(idProduto).update({
      nomeProduto: nomeProduto,
      preco: Number(preco)
    });

    return res.json({ mensagem: 'Cerveja atualizada!' });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    return res.status(500).json({ erro: 'Falha interna ao atualizar produto.' });
  }
});

// ROTA DELETE: Remover Produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const idProduto = req.params.id;
    await db.collection('produtos').doc(idProduto).delete();
    return res.json({ mensagem: 'Cerveja removida!' });
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    return res.status(500).json({ erro: 'Falha interna ao deletar produto.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  inicializarCatalogoCervejas(); 
});
