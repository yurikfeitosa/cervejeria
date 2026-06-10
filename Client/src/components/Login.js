import React, { useState } from 'react';

export default function Login({ onLogin, onIrParaRegistrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos para acessar sua conta!');
      return;
    }

    onLogin(email, senha);
  };

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />

      <div id="wrapper-form">
        <div id="form">
          <form onSubmit={handleSubmit}>
            
            <img 
              src="/imagens/logo.svg" 
              alt="Logo Mars" 
              style={{ height: '60px', margin: '0 auto 10px auto', display: 'block' }} 
            />
            
            {/* 🌟 ALTERADO: Título voltado para o Cliente */}
            <h2 className="titulo" style={{ fontSize: '1.5em', letterSpacing: 'normal' }}>
              Área do Cliente
            </h2>

            <label htmlFor="email">E-mail</label>
            <div className="input">
              <i className="fa-solid fa-envelope"></i>
              <input 
                id="email" 
                type="email" 
                placeholder="Ex: seuemail@gmail.com" // 🌟 Placeholder atualizado
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <label htmlFor="senha">Senha</label>
            <div className="input">
              <i className="fa-solid fa-lock"></i>
              <input 
                id="senha" 
                type="password" 
                placeholder="Digite sua senha" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
              />
            </div>

            <div id="btn">
              <button type="submit">Entrar</button>
            </div>

            {/* 🌟 Mensagem do rodapé do formulário adaptada */}
            <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }}>
              Ainda não tem uma conta?{' '}
              <span 
                onClick={onIrParaRegistrar} 
                style={{ color: '#ff9f1c', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                Cadastre-se aqui
              </span>
            </p>
            
          </form>
        </div>
      </div>

      <footer className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}