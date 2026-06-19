import React, { useState } from 'react';

export default function Registrar({ onRegistrar, onIrParaLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegistrar(email, senha || senha, confirmarSenha);
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
            
            {/* ALTERADO: Título para criação de conta do cliente */}
            <h2 className="titulo" style={{ fontSize: '1.5em', letterSpacing: 'normal' }}>
              Criar Conta
            </h2>

            {/* Label alterado de Corporativo para pessoal */}
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

            <label htmlFor="senha">Senha de Acesso</label>
            <div className="input">
              <i className="fa-solid fa-lock"></i>
              <input 
                id="senha" 
                type="password" 
                placeholder="Mínimo 6 caracteres" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
              />
            </div>

            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <div className="input">
              <i className="fa-solid fa-circle-check"></i>
              <input 
                id="confirmarSenha" 
                type="password" 
                placeholder="Repita a senha anterior" 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)} 
              />
            </div>

            {/* ALTERADO: Texto do Botão Principal */}
            <div id="btn">
              <button type="submit">Cadastrar Conta</button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }}>
              Já possui uma conta?{' '}
              <span 
                onClick={onIrParaLogin} 
                style={{ color: '#ff9f1c', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                Voltar para o Login
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