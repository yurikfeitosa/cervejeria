import React from 'react';

export default function Sobre() {
  return (
    <>
      {/* Imagem de partículas no fundo */}
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />

      {/* 💛 Seção Pilsen (Yellow) */}
      <section className="yellow">
        <img className="sol-so" src="/imagens/sol.png" alt="sol" />
        <p className="yellow-txt-tt">PILSEN (SOL DA TARDE)</p>
        <p className="yellow-txt">
          O estilo de cerveja artesanal Pilsen ou Pilsner <br />
          surgiu na República Tcheca. Como características marcantes, <br />
          A bebida apresenta aroma e sabor acentuados pelo lúpulo, <br />
          Além da cor dourada. Seu teor alcoólico varia entre 4,6% e 5% em média. <br />
          As mais famosas são a cerveja de origem Pilsner Urquell <br />
          (primeira Pilsen produzida) e a German Pilsner.
        </p>
        <img className="yellow-img" src="/imagens/MARS BEER SOL DA TARDE.png" alt="soldatarde" /> 
      </section>

      {/* 💚 Seção Tripel (Green) */}
      <section className="green"> 
        <p className="green-txt-tt">TRIPEL (FLOREST)</p>
        <p className="green-txt">
          Criada na Bélgica, no Mosteiro Trapista de <br />
          Westmalle, a cerveja Tripel apresenta cor clara, sabor <br />
          Amargo cítrico e aroma frutado. Esse estilo de cerveja artesanal <br />
          É bem carbonatado, o que lhe confere uma espuma bastante cremosa. <br />
          Trata-se de uma cerveja forte, com malte acentuado e teor alcoólico <br />
          Em torno de 7,5% e 8,5%.
        </p>
        <img className="green-img" src="/imagens/2 GREEN.png" alt="florest" /> 
        {/* 🌟 A onda voltou com a classe corrigida */}
        <img className="onda-fundo" src="/imagens/fundo verde.png" alt="fundo verde" />
      </section>

      {/* 💙 Seção Weizenbier (Blue) */}
      <section className="blue">
        <p className="blue-txt-tt">WEIZENBIER (BLUE DARK)</p>
        <p className="blue-txt">
          O estilo de cerveja Weizenbier, Weissbier ou Weiss <br />
          Surgiu na região Sul da Alemanha, mais especificamente na Baviera. <br />
          O estilo apresenta 50% de malte de trigo (no mínimo). Sua cor é <br />
          Clara e opaca, com sabor e aroma frutados, lembrando banana e cravo. <br /> 
          A bebida é refrescante, com teor alcóolico moderado (em torno de 5% a 6%).
        </p>
        <img className="blue-img" src="/imagens/2 DARKBLUE.png" alt="blue DARK" /> 
        {/* 🌟 A onda voltou com a classe corrigida */}
        <img className="onda-fundo" src="/imagens/fundo azul.png" alt="fundo azul" />
      </section>

      <hr />

      {/* Rodapé */}
      <footer className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}