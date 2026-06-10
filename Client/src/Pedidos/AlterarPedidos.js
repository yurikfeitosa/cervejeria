import React, { useState } from 'react';

export default function AlterarPedidos({ pedido, produtosCatalogo, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(pedido.cliente);
  const [email, setEmail] = useState(pedido.email);
  const [itens, setItens] = useState(pedido.itensBrutos ? [...pedido.itensBrutos] : []);
  const [produtoSelecionado, setProdutoSelecionado] = useState(produtosCatalogo[0]?.id || '');
  const [quantidade, setQuantidade] = useState(1);

  const adicionarItem = () => {
    if (!produtoSelecionado) return;
    const existente = itens.find(it => it.produtoId === produtoSelecionado);
    if (existente) {
      setItens(itens.map(it => it.produtoId === produtoSelecionado ? { ...it, quantidade: it.quantidade + Number(quantidade) } : it));
    } else {
      setItens([...itens, { produtoId: produtoSelecionado, quantidade: Number(quantidade) }]);
    }
    setQuantidade(1);
  };

  const removerItem = (prodId) => {
    setItens(itens.filter(it => it.produtoId !== prodId));
  };

  return (
    <tr>
      <td>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
      </td>
      <td>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      </td>
      <td style={{ minWidth: '280px' }}>
        <div style={{ background: '#222', padding: '8px', borderRadius: '5px', marginBottom: '8px', color: '#fff' }}>
          {itens.map(it => {
            const prod = produtosCatalogo.find(p => p.id === it.produtoId);
            return (
              <div key={it.produtoId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                <span>{it.quantidade}x {prod ? prod.nomeProduto : 'Cerveja'}</span>
                <strong onClick={() => removerItem(it.produtoId)} style={{ color: '#ff4d4d', cursor: 'pointer' }}>✕</strong>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <select value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.target.value)} style={inputStyle}>
            {produtosCatalogo.map(p => <option key={p.id} value={p.id}>{p.nomeProduto}</option>)}
          </select>
          <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))} style={{ ...inputStyle, width: '40px' }} />
          <button type="button" onClick={adicionarItem} style={btnMini}>+ Add</button>
        </div>
      </td>
      <td style={{ fontWeight: 'bold', color: '#ff9f1c' }}>R$ {Number(pedido.preco).toFixed(2)}</td>
      <td style={{ textAlign: 'center' }}>
        <span style={{ backgroundColor: '#FFAA00', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>EDITANDO</span>
      </td>
      <td style={{ textAlign: 'center' }}>
        <button onClick={() => onSalvar(pedido.id, nome, email, itens)} className="btn-concluir" style={{ backgroundColor: '#0bc539' }}>Salvar</button>
        <button onClick={onCancelar} className="btn-excluir" style={{ backgroundColor: '#555' }}>Cancelar</button>
      </td>
    </tr>
  );
}

const inputStyle = { padding: '5px', borderRadius: '5px', border: '1px solid #ff9f1c', background: '#222', color: '#fff' };
const btnMini = { padding: '4px 8px', backgroundColor: '#ff9f1c', border: 'none', borderRadius: '5px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };