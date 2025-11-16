import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Visualizar from './pages/Visualizar';
import Pedidos from './pages/Pedidos';
import Cardapio from './pages/Cardapio';

function NavBar() {
  const location = useLocation();
  
  // Não mostrar o navbar na rota /visualizar
  if (location.pathname === '/visualizar') {
    return null;
  }

  return (
    <nav className="navbar">
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
            <Route path="/" element={<Cardapio />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
