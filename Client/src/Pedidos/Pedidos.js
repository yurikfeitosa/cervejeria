import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import AlterarPedidos from '../Pedidos/AlterarPedidos';
import ExcluirPedidos from '../Pedidos/ExcluirPedidos';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [produtosCatalogo, setProdutosCatalogo] = useState([]); 
  const [carregando, setCarregando] = useState(true);
  const [idPedidoEmEdicao, setIdPedidoEmEdicao] = useState(null);

  useEffect(() => {
    listarPedidos();
  }, []);

  // 📝 READ: Busca os dados unificados da API
  const listarPedidos = async () => {
  setCarregando(true);
  try {
    // 🌟 CAPTURA O EMAIL DO CLIENTE LOGADO
    const emailUsuarioLogado = auth.currentUser ? auth.currentUser.email : "";

    // 🌟 PASSA O EMAIL NA URL COMO QUERY PARAMETER (?email=...)
    const resPedidos = await fetch(`http://localhost:5000/api/pedidos?email=${emailUsuarioLogado}`);
    const resProdutos = await fetch('http://localhost:5000/api/produtos');
    
    if (resPedidos.ok && resProdutos.ok) {
      setPedidos(await resPedidos.json());
      setProdutosCatalogo(await resProdutos.json());
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  } finally {
    setCarregando(false);
  }
};

  // 💾 UPDATE: Envia as alterações do subcomponente AlterarPedidos para a API
  const executarAlteracao = async (id, clienteNome, clienteEmail, novosItens) => {
    try {
      const resposta = await fetch(`http://localhost:5000/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteNome, clienteEmail, novosItens })
      });
      if (resposta.ok) {
        alert('Firestore atualizado!');
        setIdPedidoEmEdicao(null);
        listarPedidos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🗑️ DELETE: Acionado pelo subcomponente ExcluirPedidos
  const executarExclusao = async (id) => {
    try {
      const resposta = await fetch(`http://localhost:5000/api/pedidos/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        listarPedidos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const alternarStatus = async (id, statusAtual) => {
    const status = statusAtual === 'Pendente' ? 'Finalizado' : 'Pendente';
    await fetch(`http://localhost:5000/api/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    listarPedidos();
  };

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />
      <div className="relatorio-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 className="yellow-txt-tt" style={{ fontSize: '32px' }}>Painel de Pedidos Mars</h2>
            <p className="yellow-txt" style={{ fontSize: '14px' }}>Monitoramento dinâmico de dados no Firestore.</p>
          </div>
          <button onClick={listarPedidos} className="btn-concluir">🗘 Atualizar Lista</button>
        </div>

        {carregando ? (
          <p className="yellow-txt" style={{ textAlign: 'center' }}>Acessando base de dados...</p>
        ) : (
          <div className="tabela-wrapper">
            <table className="tabela-mars">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>E-mail</th>
                  <th>Cervejas Selecionadas e Qtd.</th>
                  <th>Valor Total</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => {
                  if (idPedidoEmEdicao === pedido.id) {
                    return (
                      <AlterarPedidos 
                        key={pedido.id} 
                        pedido={pedido} 
                        produtosCatalogo={produtosCatalogo} 
                        onSalvar={executarAlteracao} 
                        onCancelar={() => setIdPedidoEmEdicao(null)} 
                      />
                    );
                  }

                  return (
                    <tr key={pedido.id}>
                      <td style={{ fontWeight: '600' }}>{pedido.cliente}</td>
                      <td>{pedido.email}</td>
                      <td>{pedido.produto}</td>
                      <td style={{ fontWeight: 'bold', color: '#ff9f1c' }}>R$ {Number(pedido.preco).toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span onClick={() => alternarStatus(pedido.id, pedido.status)} style={{ backgroundColor: pedido.status === 'Pendente' ? '#FFAA00' : '#0bc539', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {pedido.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => setIdPedidoEmEdicao(pedido.id)} className="btn-concluir" style={{ margin: 0, padding: '6px 12px' }}>Alterar</button>
                          <button onClick={() => alert('Confirmado!')} className="btn-concluir" style={{ margin: 0, padding: '6px 12px', backgroundColor: '#0bc539' }}>Confirmar</button>
                          <ExcluirPedidos idPedido={pedido.id} onExcluir={executarExclusao} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}