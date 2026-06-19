import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 

export default function AdquiraASua() {
  const [username, setUsername] = useState('');
  const [listacervejas, setListaCervejas] = useState([]); // Catálogo vindo do Firestore
  
  // Estados para controlar o item selecionado no momento antes de adicionar ao carrinho
  const [produtoId, setProdutoId] = useState('');
  const [quantidadeItem, setQuantidadeItem] = useState(0);
  
  // Estado do carrinho (Array de itens adicionados)
  const [carrinho, setCarrinho] = useState([]);

  // CARGA DINÂMICA: Busca o catálogo de cervejas
  useEffect(() => {
    const carregarCatalogo = async () => {
      try {
        const resposta = await fetch('http://localhost:5000/api/produtos');
        if (resposta.ok) {
          const dados = await resposta.json();
          setListaCervejas(dados);
          if (dados.length > 0) setProdutoId(dados[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
      }
    };
    carregarCatalogo();
  }, []);

  // Adiciona a cerveja selecionada ao carrinho local
  const adicionarAoCarrinho = () => {
    if (!produtoId) return;

    // VALIDAÇÃO: Garante que não adicione com quantidade 0
    if (Number(quantidadeItem) <= 0) {
      alert('Por favor, insira uma quantidade maior que 0 para adicionar ao carrinho!');
      return;
    }

    const produtoOriginal = listacervejas.find(item => item.id === produtoId);
    
    // Verifica se a cerveja já está no carrinho para apenas somar a quantidade
    const itemExistente = carrinho.find(item => item.produtoId === produtoId);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.produtoId === produtoId 
          ? { ...item, quantidade: item.quantidade + Number(quantidadeItem) }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produtoId: produtoId,
        nomeProduto: produtoOriginal.nomeProduto,
        preco: produtoOriginal.preco,
        quantidade: Number(quantidadeItem)
      }]);
    }
    
    // Reseta a quantidade de volta para 0 após adicionar
    setQuantidadeItem(0);
  };

  // Remove um item do carrinho antes de enviar
  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.produtoId !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação local: O nome do cliente ainda é necessário
    if (!username.trim()) {
      alert('Por favor, insira o seu nome para identificarmos a entrega!');
      return;
    }

    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio! Adicione pelo menos uma cerveja.');
      return;
    }

    // CAPTURA AUTOMÁTICA: Pega o e-mail do usuário/cliente autenticado na sessão ativa do Firebase
    const emailUsuarioLogado = auth.currentUser ? auth.currentUser.email : "cliente.anonimo@mars.com";

    const dadosFormulario = {
      cliente: username,
      email: emailUsuarioLogado, 
      vendedor: "Venda Direta Site",
      itens: carrinho.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }))
    };

    try {
      const resposta = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFormulario)
      });

      if (resposta.ok) {
        alert('Pedido realizado com sucesso! Acompanhe no seu painel. 🍺');
        setUsername('');
        setCarrinho([]); // Limpa o carrinho local
        setQuantidadeItem(0);
      } else {
        alert('Ocorreu um erro ao tentar salvar o pedido.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />

      <div id="wrapper-form" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <div id="form">
          <form onSubmit={handleSubmit}>
            <h2 className="titulo">Adquira a sua</h2>
            
            <label htmlFor="username">Nome</label>
            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Insira seu nome" 
              />
            </div>
            
            <label>Escolha a Cerveja e Quantidade</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
              
              {/* Seletor de Cerveja */}
              <div className="input" style={{ flex: 2, marginBottom: 0 }}>
                <i className="fa-solid fa-wine-glass"></i>
                <select 
                  id="cerveja" 
                  value={produtoId} 
                  onChange={(e) => setProdutoId(e.target.value)} 
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#000', padding: '10px' }}
                >
                  {listacervejas.map((item) => (
                    <option key={item.id} value={item.id} style={{ color: '#000' }}>
                      {item.nomeProduto} — R$ {Number(item.preco).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seletor de Quantidade Limpo (Permite começar em 0 e aceita digitação direta) */}
              <input 
                type="number" 
                min="0" // 🌟 Permite o valor mínimo como 0
                value={quantidadeItem} 
                onChange={(e) => setQuantidadeItem(Math.max(0, parseInt(e.target.value) || 0))} // 🌟 Protege para não ficar negativo
                style={{ 
                  width: '65px', 
                  height: '40px', 
                  textAlign: 'center', 
                  borderRadius: '20px', 
                  border: '1px solid #000', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  background: '#fff',
                  color: '#000',
                  outline: 'none'
                }}
              />

              {/* Botão de Adicionar ao Carrinho */}
              <button 
                type="button" 
                onClick={adicionarAoCarrinho} 
                style={{ height: '40px', padding: '0 15px', backgroundColor: '#FFAA00', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            {/* Renderização do carrinho temporário local */}
            {carrinho.length > 0 && (
              <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '20px', color: '#000' }}>
                <h4 style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>🛒 Cervejas Adicionadas:</h4>
                {carrinho.map(item => (
                  <div key={item.produtoId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                    <span>{item.whitespace || item.quantidade}x {item.nomeProduto}</span>
                    <span style={{ fontWeight: 'bold' }}>
                      R$ {(item.preco * item.quantidade).toFixed(2)}{' '}
                      <strong onClick={() => removerDoCarrinho(item.produtoId)} style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}>✕</strong>
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div id="btn">
              <button type="submit">Enviar Pedido Completo</button>
            </div>
          </form>
        </div>
      </div>

      <img className="cerveja-ad" src="/imagens/3 MARS BEER.png" alt="cervejasmars" />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico @</footer>
    </>
  );
}