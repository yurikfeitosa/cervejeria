import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import * as firebaseAuth from 'firebase/auth';

// 1. MOCK DO FIREBASE
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('./firebase', () => ({
  auth: { currentUser: null },
}));

// 2. MOCK DOS COMPONENTES FILHOS (O segredo da Qualidade de Software!)
// Aqui isolamos o App.js. Criamos botões falsos com textos exatos 
// para disparar as rotas sem depender da interface gráfica real.
jest.mock('./Paginas/simounao', () => ({ onNavegar }) => (
  <button onClick={() => onNavegar('inicio')}>Botao_Sim_Mock</button>
));

jest.mock('./components/Menu', () => ({ onNavegar }) => (
  <div>
    <button onClick={() => onNavegar('pedidos')}>Botao_Pedidos_Mock</button>
    <button onClick={() => onNavegar('login')}>Botao_Login_Mock</button>
  </div>
));

jest.mock('./components/Login', () => ({ onLogin }) => (
  <button onClick={() => onLogin('', '')}>Botao_Entrar_Mock</button>
));

// Mockamos o Inicio apenas para evitar que ele renderize conteúdo desnecessário no teste
jest.mock('./Paginas/inicio', () => () => <div>Tela Inicial</div>);


describe('Testes de Autenticação e Proteção de Rotas no App.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn(); 
    });
    
    window.alert = jest.fn();
  });

  // TESTE 1: PROTEÇÃO DE ROTAS
  test('Deve impedir a navegação para rotas restritas se não estiver logado', () => {
    render(<App />);
    
    // 1. Clicamos no botão falso para sair da tela inicial
    fireEvent.click(screen.getByText('Botao_Sim_Mock'));

    // 2. O Menu aparece. Clicamos no botão falso que tenta abrir os Pedidos
    fireEvent.click(screen.getByText('Botao_Pedidos_Mock'));

    // 3. A trava de segurança do App.js DEVE funcionar e emitir o alerta
    expect(window.alert).toHaveBeenCalledWith(
      'Acesso negado! Esta tela exige privilégios de administrador autenticado.'
    );
  });

  // TESTE 2: VALIDAÇÃO DE ENTRADA
  test('Deve validar e bloquear submissão se email ou senha estiverem vazios', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Botao_Sim_Mock'));

    // Vai para a tela de Login clicando no Menu falso
    fireEvent.click(screen.getByText('Botao_Login_Mock'));

    // Executa a função de login enviando campos vazios através do Login falso
    fireEvent.click(screen.getByText('Botao_Entrar_Mock'));

    expect(window.alert).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos do login!'
    );
    
    expect(firebaseAuth.signInWithEmailAndPassword).not.toHaveBeenCalled();
  });
});