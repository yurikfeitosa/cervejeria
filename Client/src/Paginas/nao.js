import React from 'react';

export default function Nao({ onNavegar }) {
  
  const voltar = (e) => {
    e.preventDefault();
    // Volta o estado para a tela de pergunta inicial
    onNavegar('simounao');
  };

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />
      
      <div className="container">
        <div className="container-img">
          <img className="container-img" src="/imagens/logobranca.svg" alt="logomars" />
        </div>
        
        <div className="container-txtP">
          INFELIZMENTE <br />
          VOCÊ NÃO PODE <br />
          ACESSAR A ESSE <br />
          SITE <br />

          <button id="botaosim" onClick={voltar}>VOLTAR</button>
        </div>
        
        <img className="caratriste" src="/imagens/cara triste.svg" alt="caratriste" />
      </div>

      <footer style={{ top: '120px' }} className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}