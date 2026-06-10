import React from 'react';

export default function SimOuNao({ onNavegar }) {
  
  const responderMaioridade = (e, resposta) => {
    e.preventDefault();
    
    if (resposta === 'sim') {
      // 1. Salva no localStorage que o usuário passou da validação de idade
      localStorage.setItem('maiorDeIdade', 'true');
      
      // 2. Muda a tela do React de verdade para a página inicial!
      onNavegar('inicio');
    } else {
      // Se for menor de idade, joga para a tela de bloqueio (nao.js)
      onNavegar('nao');
    }
  };

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />
      
      <div className="container">
        <div className="container-img">
          <img className="container-img" src="/imagens/logobranca.svg" alt="logomars" />
        </div>
        <div className="container-txtP">
          A MARS SE PREOCUPA <br />
          COM O CONSUMO <br />
          CONSCIENTE <br />

          <h6 className="container-txtS">VOCÊ TEM MAIS DE 18 ANOS?</h6> <br />
          
          <button id="botaosim" onClick={(e) => responderMaioridade(e, 'sim')}>SIM</button>
          <button id="botaosim" onClick={(e) => responderMaioridade(e, 'nao')}>NÃO</button>
        </div>
      </div>

      <footer style={{ top: '120px' }} className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}