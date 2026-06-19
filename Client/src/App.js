import React, { useState, useEffect } from 'react';
import './App.css';
import Pedidos from './Pedidos/Pedidos';
import Produtos from './Produtos/Produtos';
import Perfil from './Clientes/Perfil'; 

// Importando suas páginas institucionais
import Inicio from './Paginas/inicio';
import Sobre from './Paginas/sobre';
import Contatos from './Paginas/contatos';
import AdquiraASua from './Paginas/adquiraasua';
import SimOuNao from './Paginas/simounao';
import Nao from './Paginas/nao';

// Importando os componentes de Login, Registro e Menu
import Login from './components/Login';
import Registrar from './components/Registrar'; // Garanta que criará este arquivo
import Menu from './components/Menu';

// Importando as funções nativas de autenticação do Firebase
import { auth } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function App() {
  // Estados para controlar a tela atual e a sessão de login
  const [telaAtual, setTelaAtual] = useState('simounao'); // Começa na validação de idade
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // CONTROLE DE SESSÃO REAL: Verifica se o token de login já existe ao atualizar a página (F5)
  useEffect(() => {
    const monitorarSessao = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(true);
      } else {
        setUsuarioLogado(false);
      }
      setCarregandoSessao(false); // Libera o app após checar as credenciais
    });
    return () => monitorarSessao();
  }, []);

  // FUNÇÃO: Efetuar Login Real no Firebase
  const efetuarrLogin = async (email, senate) => {
    if (!email.trim() || !senate.trim()) {
      alert('Por favor, preencha todos os campos do login!');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senate);
      setTelaAtual('inicio'); // Direciona para o Início após autenticar
      alert('Login realizado com sucesso no Firebase! Bem-vindo.');
    } catch (error) {
      console.error("Erro no login:", error.code);
      alert('E-mail ou senha incorretos no banco Firebase!');
    }
  };

  // FUNÇÃO: Cadastrar Novo Usuário Administrativo no Firebase Auth
  const cadastrarNovoUsuario = async (email, senate, confirmarSenha) => {
    if (!email.trim() || !senate.trim() || !confirmarSenha.trim()) {
      alert("Por favor, preencha todos os campos do cadastro!");
      return;
    }

    if (senate !== confirmarSenha) {
      alert("As senhas não coincidem! Verifique e tente novamente.");
      return;
    }

    if (senate.length < 6) {
      alert("Segurança FRACA: A senha deve conter pelo menos 6 caracteres!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senate);
      setTelaAtual('inicio'); // Loga e redireciona automaticamente para a Home
      alert("Usário criado com sucesso! Bem-vindo à equipe Mars. 🍺");
    } catch (error) {
      console.error("Erro ao registrar:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        alert("Este e-mail já está cadastrado no sistema Mars!");
      } else if (error.code === 'auth/invalid-email') {
        alert("O formato do e-mail inserido é inválido.");
      } else {
        alert("Erro ao efetuar o cadastro no Firebase.");
      }
    }
  };

  // FUNÇÃO: Efetuar Logout Real
  const efetuarLogout = async () => {
    try {
      await signOut(auth);
      setTelaAtual('login');
      alert('Sessão administrativa encerrada.');
    } catch (error) {
      alert('Erro ao fechar sessão.');
    }
  };

  // FUNÇÃO AUXILIAR: Proteção de Telas e Bloqueios (Critério Crítico da Apresentação)
  const navegarPara = (destino) => {
    const telasRestritas = ['adquiraasua', 'clientes', 'produtos', 'pedidos'];
    
    // Se tentar ir para uma tela restrita e não houver usuário autenticado no Firebase
    if (telasRestritas.includes(destino) && !auth.currentUser) {
      alert('Acesso negado! Esta tela exige privilégios de administrador autenticado.');
      setTelaAtual('login');
      return;
    }
    
    setTelaAtual(destino);
  };

  // Renderização condicional das telas baseada no estado 'telaAtual'
  const renderizarTela = () => {
    switch (telaAtual) {
      case 'simounao':
        return <SimOuNao onNavegar={navegarPara} />;
      case 'nao':
        return <Nao onNavegar={navegarPara} />;
      case 'login':
        return <Login onLogin={efetuarrLogin} onIrParaRegistrar={() => setTelaAtual('registrar')} />;
      case 'registrar':
        return <Registrar onRegistrar={cadastrarNovoUsuario} onIrParaLogin={() => setTelaAtual('login')} />;
      case 'inicio':
        return <Inicio onNavegar={navegarPara} />;
      case 'sobre':
        return <Sobre onNavegar={navegarPara} />;
      case 'contatos':
        return <Contatos onNavegar={navegarPara} />;
      case 'adquiraasua':
        return <AdquiraASua onNavegar={navegarPara} />;
      case 'pedidos':
        return <Pedidos onNavegar={navegarPara} />;
      case 'produtos':
        return <Produtos onNavegar={navegarPara} />;
      case 'perfil':
        return <Perfil usuario={usuarioLogado} onNavegar={navegarPara} />;
      default:
        return <Inicio onNavegar={navegarPara} />;
    }
  };

  // Previne "piscadas" de tela injetando uma mensagem limpa enquanto o Firebase lê os tokens
  if (carregandoSessao) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0F0F0F', color: '#ff9f1c', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
         Autenticando com a base Mars...
      </div>
    );
  }

  return (
    <>
      {telaAtual !== 'simounao' && telaAtual !== 'nao' && (
        <>
          <Menu 
            usuarioLogado={usuarioLogado} 
            onLogout={efetuarLogout} 
            onNavegar={navegarPara} 
            telaAtiva={telaAtual}
          />
          <hr className="hr" />
        </>
      )}

      <main>
        {renderizarTela()}
      </main>
    </>
  );
}