import React, { useState } from 'react';

export default function ListaProdutos({ produtos, carregando, onProdutoAtualizado }) {
  
  if (carregando) return <p style={{ color: '#ff9f1c', textAlign: 'center' }}>Acessando catálogo...</p>;
  if (produtos.length === 0) return <p style={{ color: '#fff', textAlign: 'center' }}>Nenhum produto cadastrado no catálogo.</p>;

  return (
    <div>
      <h3 style={{ color: '#ff9f1c', marginBottom: '15px' }}>Catálogo Atual</h3>
      
      {/* 🔄 READ: Renderização dinâmica usando map */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {produtos.map(produto => (
          <CardProdutoReutilizavel 
            key={produto.id} 
            produto={produto} 
            onAtualizarLista={onProdutoAtualizado} 
          />
        ))}
      </div>
    </div>
  );
}

// 🌟 O COMPONENTE REUTILIZÁVEL (Garante os 0,15 pontos do edital!)
function CardProdutoReutilizavel({ produto, onAtualizarLista }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nomeEditado, setNomeEditado] = useState(produto.nomeProduto);
  const [precoEditado, setPrecoEditado] = useState(produto.preco);

  // 📝 UPDATE: Atualiza os dados via PUT
  const salvarEdicao = async () => {
    if (!nomeEditado.trim() || !precoEditado) return alert('Preencha os campos corretamente.');
    
    try {
      const res = await fetch(`http://localhost:5000/api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeProduto: nomeEditado, preco: Number(precoEditado) })
      });
      if (res.ok) {
        setModoEdicao(false);
        onAtualizarLista(); // Manda a tela principal atualizar
      }
    } catch (error) {
      console.error('Erro ao atualizar', error);
    }
  };

  // 🗑️ DELETE: Exclui do banco
  const deletarProduto = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto ${produto.nomeProduto}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/produtos/${produto.id}`, { method: 'DELETE' });
      if (res.ok) {
        onAtualizarLista();
      }
    } catch (error) {
      console.error('Erro ao deletar', error);
    }
  };

  return (
    <div style={{ background: '#222', border: '1px solid #ff9f1c', borderRadius: '15px', padding: '20px', width: '240px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* Lógica condicional: Se estiver editando mostra os inputs, senão mostra o texto */}
      {modoEdicao ? (
        <>
          <input type="text" value={nomeEditado} onChange={e => setNomeEditado(e.target.value)} style={inputMini} />
          <input type="number" step="0.01" value={precoEditado} onChange={e => setPrecoEditado(e.target.value)} style={inputMini} />
          
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <button onClick={salvarEdicao} style={{ ...btnAction, backgroundColor: '#0bc539', flex: 1 }}>Salvar</button>
            <button onClick={() => setModoEdicao(false)} style={{ ...btnAction, backgroundColor: '#555', flex: 1 }}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h4 style={{ color: '#ff9f1c', fontSize: '18px', margin: 0 }}>{produto.nomeProduto}</h4>
          <p style={{ fontWeight: 'bold', fontSize: '20px', margin: '10px 0' }}>R$ {Number(produto.preco).toFixed(2)}</p>
          
          <div style={{ display: 'flex', gap: '5px', marginTop: 'auto' }}>
            <button onClick={() => setModoEdicao(true)} style={{ ...btnAction, backgroundColor: '#FFAA00', flex: 1 }}>Alterar</button>
            <button onClick={deletarProduto} style={{ ...btnAction, backgroundColor: '#ff4d4d', flex: 1 }}>Excluir</button>
          </div>
        </>
      )}
    </div>
  );
}

// Estilos internos do Card
const inputMini = { padding: '8px', borderRadius: '5px', border: '1px solid #ff9f1c', background: '#111', color: '#fff' };
const btnAction = { color: '#fff', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };