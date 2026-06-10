import React from 'react';

export default function Inicio() {
  return (
    <>
      {/* Imagem de partículas no fundo */}
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />

      {/* Elemento Sol (Mantido com a sua animação original) */}
      <img className="sol" width="10%" src="/imagens/sol.png" alt="sol" />

      {/* Seção Principal da Home */}
      <section className="inicio">
        <img className="inicio-img" src="/imagens/logobranca.svg" alt="logomars" />
        <p className="inicio-txt">
          A CADA
          GOLE <br />
          UMA SENSAÇÃO <br />
          ÚNICA <br />
        </p> 
        <img className="cervejas" src="/imagens/3 MARS BEER.png" alt="cervejasmars" />
      </section> 

      <hr />

      {/* Rodapé */}
      <footer className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}