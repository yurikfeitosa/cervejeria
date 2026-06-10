import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Importa a autenticação para isolar o perfil por e-mail

export default function Perfil() {
  // 🌟 ESTADOS REATIVOS: Uso de useState para o formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [perfilSalvo, setPerfilSalvo] = useState(null);

  const emailUsuario = auth.currentUser ? auth.currentUser.email : "cliente@mars.com";
  const chaveLocalStorage = `perfil_mars_${emailUsuario}`;

  // 🌟 PERSISTÊNCIA DOS DADOS: Carrega o perfil do localStorage ao iniciar
  useEffect(() => {
    const dadosLocais = localStorage.getItem(chaveLocalStorage);
    if (dadosLocais) {
      const perfilParseado = JSON.parse(dadosLocais);
      setPerfilSalvo(perfilParseado);
      
      // Alimenta os inputs com o que já estava guardado
      setNome(perfilParseado.nome);
      setTelefone(perfilParseado.telefone);
      setCpf(perfilParseado.cpf);
      setEndereco(perfilParseado.endereco);
    }
  }, [emailUsuario, chaveLocalStorage]);

  // 💾 OPERAÇÃO DO CRUD: CREATE / UPDATE (Salvar no localStorage)
  const salvarPerfil = (e) => {
    e.preventDefault();

    // Validações básicas de preenchimento
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
    
    alert('Informações de perfil atualizadas! 💾🍺');
  };

  // 🗑️ OPERAÇÃO DO CRUD: DELETE (Remover do localStorage)
  const apagarPerfil = () => {
    if (!window.confirm('Deseja limpar seus dados cadastrais do navegador?')) return;

    localStorage.removeItem(chaveLocalStorage);
    setPerfilSalvo(null);
    setNome('');
    setTelefone('');
    setCpf('');
    setEndereco('');

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
              <textarea 
                id="endereco" 
                value={endereco} 
                onChange={(e) => setEndereco(e.target.value)} 
                placeholder="Rua, Número, Bairro, Cidade e CEP"
                style={{ width: '100%', height: '70px', background: 'transparent', border: 'none', color: '#000', outline: 'none', padding: '8px', resize: 'none', fontFamily: 'inherit' }}
              />
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
        </div>

        {/* 🌟 READ: Bloco visual que exibe o que está salvo no navegador */}
        {perfilSalvo && (
          <div style={{ background: 'rgba(34, 34, 34, 0.95)', border: '1px solid #ff9f1c', borderRadius: '15px', padding: '20px', marginTop: '25px', color: '#fff' }}>
            <h4 style={{ color: '#ff9f1c', borderBottom: '1px solid #444', paddingBottom: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ℹ️ Dados Salvos no Navegador:
            </h4>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>Nome:</strong> {perfilSalvo.nome}</p>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>WhatsApp:</strong> {perfilSalvo.telefone}</p>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>CPF:</strong> {perfilSalvo.cpf}</p>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Endereço:</strong> {perfilSalvo.endereco}</p>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
              Atualizado em: {perfilSalvo.atualizadoEm}
            </div>
          </div>
        )}
      </div>

      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico @</footer>
    </>
  );
}