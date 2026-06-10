import React from 'react';

export default function ExcluirPedidos({ idPedido, onExcluir }) {
  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este pedido do Firestore? 🗑️')) {
      onExcluir(idPedido);
    }
  };

  return (
    <button onClick={handleExcluir} className="btn-excluir" style={{ margin: 0, padding: '6px 12px', fontSize: '12px' }}>
      Excluir
    </button>
  );
}