import React from 'react';

export default function Contatos() {
  // Função temporária para simular a navegação até integrarmos com o App.js
  const navegar = (e, destino) => {
    e.preventDefault();
    alert(`Navegando para: ${destino}. Logo mais configuraremos o sistema de rotas no App.js!`);
  };

  return (
    <>
      {/* Imagem de partículas no fundo */}
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />
      <hr />
      <br /><br /><br /><br />

      {/* Mapa do Google (Iframe adaptado para React) */}
      <iframe 
        className="mapa" 
        src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d61415.35107865831!2d-48.10150281774389!3d-15.832431940589649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e2!4m0!4m5!1s0x935a3321354999e9%3A0x881fa531a22a3f88!2sSt.%20B%20Norte%20Centro%20Universit%C3%A1rio%20Proje%C3%A7%C3%A3o%20-%20Taguatinga%20-%20Taguatinga%2C%20Bras%C3%ADlia%20-%20DF%2C%2070297-400!3m2!1d-15.8193551!2d-48.0652797!5e0!3m2!1spt-BR!2sbr!4v1667759768794!5m2!1spt-BR!2sbr" 
        width="600" 
        height="450" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa Localização Cervejaria"
      ></iframe>

      {/* Ícones das Redes Sociais */}
      <div className="icones">
        <a href="https://www.instagram.com/_marsdesigner/" target="_blank" rel="noreferrer">
          <img className="instagram" src="/imagens/INSTA.svg" alt="instagram" />
        </a>
        <a href="https://whatsa.me/5561983731359" target="_blank" rel="noreferrer">
          <img className="whatsapp" src="/imagens/WHATSAPP.svg" alt="whatsapp" />
        </a>
      </div>

      {/* Links de Texto */}
      <section className="text-cont">
         <a className="instawpp" href="https://www.instagram.com/seuinstagram/" target="_blank" rel="noreferrer"><br /><br /></a> 
         <a className="instawpp" href="https://whatsa.me/5561seucelular" target="_blank" rel="noreferrer"></a> 
      </section>

      <hr />

      {/* Rodapé */}
      <footer className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}