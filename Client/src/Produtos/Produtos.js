import React, { useState, useEffect } from 'react';
import CadastroProduto from './CadastroProduto';
import ListaProdutos from './ListaProdutos';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 🔄 READ: Busca todos os produtos na API
  const listarProdutos = async () => {
    setCarregando(true);
    try {
      const res = await fetch('http://localhost:5000/api/produtos');
      if (res.ok) {
        const dados = await res.json();
        setProdutos(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Chama a listagem assim que a tela abre
  useEffect(() => {
    listarProdutos();
  }, []);

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />
      
      <div className="relatorio-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="yellow-txt-tt" style={{ fontSize: '32px', marginBottom: '20px' }}>
          Gestão de Catálogo (Produtos)
        </h2>
        
        {/* ➕ Subcomponente de CREATE: Passamos a função para recarregar a lista ao salvar */}
        <CadastroProduto onProdutoCadastrado={listarProdutos} />
        
        <hr style={{ borderColor: '#444', margin: '30px 0' }} />

        {/* 📋 Subcomponente de READ, UPDATE e DELETE */}
        <ListaProdutos 
          produtos={produtos} 
          carregando={carregando} 
          onProdutoAtualizado={listarProdutos} 
        />
      </div>
      
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico @</footer>
    </>
  );
}