import React from 'react';

export default function Menu({ usuarioLogado, onLogout, onNavegar, telaAtiva }) {
  
  const tratarClique = (e, destino) => {
    e.preventDefault(); // Impede o link de recarregar a página
    onNavegar(destino); // Chama a navegação do App.js
  };

  return (
    <>
      <header className="cabecalho">
        <img className="cabecalho-img" src="/imagens/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <a 
            className={`cabecalho-txt-it ${telaAtiva === 'inicio' ? 'ativo' : ''}`} 
            href="#inicio" 
            onClick={(e) => tratarClique(e, 'inicio')}
          >
            INÍCIO |
          </a>
          <a 
            className={`cabecalho-txt-it ${telaAtiva === 'sobre' ? 'ativo' : ''}`} 
            href="#sobre" 
            onClick={(e) => tratarClique(e, 'sobre')}
          >
            SOBRE A MARS |
          </a>
          <a 
            className={`cabecalho-txt-it ${telaAtiva === 'contatos' ? 'ativo' : ''}`} 
            href="#contatos" 
            onClick={(e) => tratarClique(e, 'contatos')}
          >
            CONTATOS |
          </a>
          <a 
            className={`cabecalho-txt-it ${telaAtiva === 'adquiraasua' ? 'ativo' : ''}`} 
            href="#adquiraasua" 
            onClick={(e) => tratarClique(e, 'adquiraasua')}
          >
            ADQUIRA A SUA |
          </a>

          {!usuarioLogado ? (
            <a className="cabecalho-txt-it" href="#login" onClick={(e) => tratarClique(e, 'login')}>
              LOGIN
            </a>
          ) : (
            <>
              {/* 🌟 NOVAS ABAS ADICIONADAS: Seguindo o padrão de estilo idêntico aos outros botões */}
              <a 
                className={`cabecalho-txt-it ${telaAtiva === 'produtos' ? 'ativo' : ''}`} 
                href="#produtos" 
                onClick={(e) => tratarClique(e, 'produtos')} 
              >
                PRODUTOS |
              </a>
              
              <a 
                className={`cabecalho-txt-it ${telaAtiva === 'pedidos' ? 'ativo' : ''}`} 
                href="#pedidos" 
                onClick={(e) => tratarClique(e, 'pedidos')} 
              >
                PEDIDOS |
              </a>

              <a 
                className={`cabecalho-txt-it ${telaAtiva === 'perfil' ? 'ativo' : ''}`} 
                href="#perfil" 
                onClick={(e) => tratarClique(e, 'perfil')} 
              >
                PERFIL |
              </a>

              <a className="cabecalho-txt-it" href="#logout" onClick={onLogout} style={{ color: '#ff0000' }}>
                LOGOUT
              </a>
            </>
          )}
        </nav>
      </header>
      <hr className="hr" />
    </>
  );
}