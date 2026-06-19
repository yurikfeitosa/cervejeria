import React, { useState } from 'react';

export default function CadastroProduto({ onProdutoCadastrado }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  // 💾 CREATE: Envia o novo produto para o servidor
  const cadastrarProduto = async (e) => {
    e.preventDefault();

    // Validação obrigatória pelo edital
    if (!nome.trim() || !preco) {
      alert('Por favor, preencha o nome e o preço do produto!');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:5000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeProduto: nome, preco: Number(preco) })
      });

      if (resposta.ok) {
        alert('Rótulo cadastrado com sucesso! 🍺');
        setNome(''); // Limpa o input
        setPreco(''); // Limpa o input
        onProdutoCadastrado(); // Aciona o READ do componente Pai
      } else {
        alert('Erro ao salvar o produto no servidor.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com a API.');
    }
  };

  return (
    <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #ff9f1c' }}>
      <h3 style={{ color: '#ff9f1c', marginBottom: '15px' }}>Adicionar Novo Rótulo</h3>
      
      <form onSubmit={cadastrarProduto} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '200px' }}>
          <input 
            type="text" 
            placeholder="Ex: Mars Pilsen" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            style={inputStyle} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <input 
            type="number" 
            step="0.01" 
            min="0"
            placeholder="Preço (R$)" 
            value={preco} 
            onChange={e => setPreco(e.target.value)} 
            style={inputStyle} 
          />
        </div>
        <button type="submit" style={btnStyle}>Cadastrar Rótulo</button>
      </form>
    </div>
  );
}

// Estilos isolados do componente
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ff9f1c', background: '#222', color: '#fff', outline: 'none' };
const btnStyle = { backgroundColor: '#0bc539', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };