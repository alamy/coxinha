import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import Visualizar from './pages/Visualizar';
import Pedidos from './pages/Pedidos';
import Cardapio from './pages/Cardapio';
import Caixa from './pages/Caixa';
import Perfil from './pages/Perfil';

function NavBar() {
  const location = useLocation();
  const { perfil } = useAppContext();
  // Não mostrar o navbar na rota /visualizar
  if (location.pathname === '/visualizar') {
    return null;
  }
  return (
    <nav className="navbar">
      <div className="navbar-title" style={{ color: '#fff' }}>
        {perfil?.nomeSistema || 'Comadre Coxinha'}
      </div>
      <ul>
        <li>
          <Link to="/cardapio">Cardápio</Link>
        </li>
        <li>
          <Link to="/visualizar">Visualizar</Link>
        </li>
        <li>
          <Link to="/pedidos">Pedidos</Link>
        </li>
        <li>
          <Link to="/perfil">Perfil</Link>
        </li>
        <li>
          <Link to="/caixa">Caixa</Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <NavBar />

          <Routes>
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/visualizar" element={<Visualizar />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/caixa" element={<Caixa />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/" element={<Cardapio />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
