import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [perfilSalvo, setPerfilSalvo] = useState(null);

  const [mostrarCard, setMostrarCard] = useState(false);

  const emailUsuario = auth.currentUser
    ? auth.currentUser.email
    : "cliente@mars.com";

  const chaveLocalStorage = `perfil_mars_${emailUsuario}`;

  useEffect(() => {
    const dadosLocais = localStorage.getItem(chaveLocalStorage);

    if (dadosLocais) {
      const perfilParseado = JSON.parse(dadosLocais);

      setPerfilSalvo(perfilParseado);

      setNome(perfilParseado.nome);
      setTelefone(perfilParseado.telefone);
      setCpf(perfilParseado.cpf);
      setEndereco(perfilParseado.endereco);
    }
  }, [emailUsuario, chaveLocalStorage]);

  const salvarPerfil = (e) => {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim() || !cpf.trim() || !endereco.trim()) {
      alert('Por favor, preencha todos os campos do seu perfil!');
      return;
    }

    const estruturaPerfil = {
      nome,
      telefone,
      cpf,
      endereco,
      atualizadoEm: new Date().toLocaleString('pt-BR')
    };

    localStorage.setItem(chaveLocalStorage, JSON.stringify(estruturaPerfil));
    setPerfilSalvo(estruturaPerfil);

    setMostrarCard(true);
    setTimeout(() => {
      setMostrarCard(false);
    }, 2000);
  };

  const apagarPerfil = () => {
    if (!window.confirm('Deseja limpar seus dados cadastrais do navegador?')) {
      return;
    }

    localStorage.removeItem(chaveLocalStorage);
    setPerfilSalvo(null);
    setNome('');
    setTelefone('');
    setCpf('');
    setEndereco('');
    setMostrarCard(false);

    alert('Dados removidos com sucesso! 🗑️');
  };

  return (
    <>
      <img className="particulas" src="/imagens/particulas.png" alt="particulas" />

      <div id="wrapper-form" style={{ maxWidth: '550px', margin: '40px auto' }}>
        <div id="form">
          <form onSubmit={salvarPerfil}>
            <h2 className="titulo" style={{ fontSize: '1.6em' }}>Meu Perfil</h2>
            <p style={{ textAlign: 'center', color: '#ff9f1c', fontSize: '13px', marginBottom: '20px', fontFamily: 'monospace' }}>
              Conta Ativa: {emailUsuario}
            </p>

            <label htmlFor="nome">Nome Completo</label>
            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" />
            </div>

            <label htmlFor="telefone">Telefone / WhatsApp</label>
            <div className="input">
              <i className="fa-solid fa-phone"></i>
              <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(61) 99999-9999" />
            </div>

            <label htmlFor="cpf">CPF</label>
            <div className="input">
              <i className="fa-solid fa-id-card"></i>
              <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
            </div>

            <label htmlFor="endereco">Endereço de Entrega</label>
            <div className="input" style={{ height: 'auto', padding: '5px 10px' }}>
              <i className="fa-solid fa-location-dot" style={{ marginTop: '12px' }}></i>
              <textarea id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, Número, Bairro, Cidade e CEP" style={{ width: '100%', height: '70px', background: 'transparent', border: 'none', color: '#000', outline: 'none', padding: '8px', resize: 'none', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" style={{ flex: 2, height: '45px', backgroundColor: '#FFAA00', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                {perfilSalvo ? 'Atualizar Dados' : 'Salvar Cadastro'}
              </button>
              {perfilSalvo && (
                <button type="button" onClick={apagarPerfil} style={{ flex: 1, height: '45px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                  Limpar
                </button>
              )}
            </div>
          </form>

          {/* MUDANÇA AQUI: Estes blocos agora estão DENTRO, logo após os botões! */}
          <div style={{ width: '100%', marginTop: '30px' }}>
            
            {/* 1. Aviso temporário */}
            {mostrarCard && (
              <div style={{ background: '#0bc539', border: '1px solid #09a12e', borderRadius: '15px', padding: '15px', marginBottom: '15px', color: '#fff', textAlign: 'center', fontWeight: 'bold', animation: 'slideIn 0.4s ease' }}>
                ✅ Dados salvos com sucesso no navegador!
              </div>
            )}

            {/* 2. Exibição Permanente */}
            {perfilSalvo && (
              <div style={{ background: 'rgba(34, 34, 34, 0.95)', border: '1px solid #ff9f1c', borderRadius: '15px', padding: '20px', color: '#fff', width: '100%', boxSizing: 'border-box' }}>
                <h4 style={{ color: '#ff9f1c', borderBottom: '1px solid #444', paddingBottom: '8px', marginBottom: '12px', textAlign: 'left' }}>
                  ℹ️ Dados Homologados:
                </h4>
                
                <p style={{ fontSize: '14px', marginBottom: '5px', textAlign: 'left' }}><strong>Nome:</strong> {perfilSalvo.nome}</p>
                <p style={{ fontSize: '14px', marginBottom: '5px', textAlign: 'left' }}><strong>WhatsApp:</strong> {perfilSalvo.telefone}</p>
                <p style={{ fontSize: '14px', marginBottom: '5px', textAlign: 'left' }}><strong>CPF:</strong> {perfilSalvo.cpf}</p>
                <p style={{ fontSize: '14px', marginBottom: '8px', textAlign: 'left', wordBreak: 'break-word' }}><strong>Endereço:</strong> {perfilSalvo.endereco}</p>
                
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#aaa', marginTop: '15px', fontFamily: 'monospace' }}>
                  Sincronizado em: {perfilSalvo.atualizadoEm}
                </div>
              </div>
            )}
          </div>
          {/* Fim da mudança */}

        </div>
      </div>

      <footer className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </>
  );
}