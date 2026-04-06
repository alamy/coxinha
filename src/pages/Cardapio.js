import React, { useState, useRef } from 'react';
import { useAppContext } from '../AppContext';
import './Cardapio.css';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

function Cardapio() {
  const { perfil, cardapio, adicionarItemCardapio, atualizarItemCardapio, deletarItemCardapio } = useAppContext();
  // Use global cardapio from context so changes persist across app and to localStorage
  const itens = cardapio || [];
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoria: 'coxinha',
    disponivel: true,
    estoque: 0
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editando) {
      // Editar item existente via contexto
      const itemAtualizado = {
        ...editando,
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque)
      };
      atualizarItemCardapio(editando.id, itemAtualizado);
      setEditando(null);
    } else {
      // Adicionar novo item via contexto
      const novoId = itens.length > 0 ? Math.max(...itens.map(i => i.id)) + 1 : 1;
      const novoItem = {
        id: novoId,
        nome: formData.nome,
        categoria: formData.categoria,
        preco: parseFloat(formData.preco),
        disponivel: formData.disponivel,
        estoque: parseInt(formData.estoque)
      };
      adicionarItemCardapio(novoItem);
    }
    
    // Resetar formulário
    setFormData({ nome: '', preco: '', categoria: 'coxinha', disponivel: true, estoque: 0 });
    setMostrarForm(false);
  };

  const handleEditar = (item) => {
    setEditando(item);
    setFormData({
      nome: item.nome,
      preco: item.preco.toString(),
      categoria: item.categoria,
      disponivel: item.disponivel,
      estoque: item.estoque.toString()
    });
    setMostrarForm(true);
    // Scroll the form into view when editing (small timeout to allow render)
    setTimeout(() => {
      if (formRef && formRef.current && formRef.current.scrollIntoView) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      deletarItemCardapio(id);
    }
  };

  const handleCancelar = () => {
    setFormData({ nome: '', preco: '', categoria: 'coxinha', disponivel: true, estoque: 0 });
    setEditando(null);
    setMostrarForm(false);
  };

  const getEstoqueStatus = (estoque) => {
    if (estoque === 0) return 'sem-estoque';
    if (estoque < 5) return 'estoque-baixo';
    return 'estoque-ok';
  };

  // Filtrar itens baseado em busca e categoria
  const itensFiltrados = itens.filter(item => {
    const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filtroCategoria === 'todos' || item.categoria === filtroCategoria;
    return matchSearch && matchCategoria;
  });

  return (
    <div className="cardapio-container">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="cardapio-header">
          <h1>🍗 Cardápio {perfil?.nomeSistema || 'Comadre Coxinha'}</h1>
          <p>Gerencie os itens do cardápio</p>
        </div>

        {/* Barra de Filtros */}
        <div className="cardapio-filtros">
          <div className="cardapio-busca-container">
            <input
              type="text"
              placeholder="🔍 Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cardapio-busca"
            />
          </div>

          <div className="cardapio-filtros-categoria">
            <button
              className={`btn-filtro ${filtroCategoria === 'todos' ? 'ativo' : ''}`}
              onClick={() => setFiltroCategoria('todos')}
            >
              📋 Todos
            </button>
            <button
              className={`btn-filtro ${filtroCategoria === 'coxinha' ? 'ativo' : ''}`}
              onClick={() => setFiltroCategoria('coxinha')}
            >
              🍗 Coxinhas
            </button>
            <button
              className={`btn-filtro ${filtroCategoria === 'bebida' ? 'ativo' : ''}`}
              onClick={() => setFiltroCategoria('bebida')}
            >
              🥤 Bebidas
            </button>
          </div>
        </div>

        {/* Botão Adicionar */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-adicionar-item">
            {mostrarForm ? '✕ Fechar Formulário' : '+ Adicionar Novo Item'}
          </button>
        </div>

        {/* Formulário */}
        {mostrarForm && (
          <div className="cardapio-form-container" ref={formRef}>
            <h2>{editando ? '✏️ Editar Item' : '➕ Novo Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="cardapio-form-group">
                <label className="cardapio-form-label">Nome da Coxinha</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="cardapio-form-input"
                  placeholder="Ex: Frango com queijo"
                />
              </div>

              <div className="cardapio-form-group">
                <label className="cardapio-form-label">Preço (R$)</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="cardapio-form-input"
                  placeholder="Ex: 6.00"
                />
              </div>

              <div className="cardapio-form-group">
                <label className="cardapio-form-label">Categoria</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  className="cardapio-form-input"
                >
                  <option value="coxinha">🍗 Coxinhas</option>
                  <option value="bebida">🥤 Bebidas</option>
                </select>
              </div>

              <div className="cardapio-form-group">
                <label className="cardapio-form-label">Estoque (quantidade)</label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="cardapio-form-input"
                  placeholder="Ex: 10"
                />
                {formData.estoque < 5 && formData.estoque >= 0 && (
                  <div className="alerta-estoque">
                    {formData.estoque === 0 || formData.estoque === '0' 
                      ? '⚠️ SEM ESTOQUE - Item não poderá ser selecionado em pedidos!'
                      : '⚠️ ESTOQUE BAIXO - Fazer mais coxinhas!'
                    }
                  </div>
                )}
              </div>

              <div className="cardapio-checkbox-container">
                <input
                  type="checkbox"
                  name="disponivel"
                  checked={formData.disponivel}
                  onChange={handleInputChange}
                  className="cardapio-checkbox"
                  id="disponivel"
                />
                <label htmlFor="disponivel" className="cardapio-checkbox-label">
                  ✓ Item disponível para venda
                </label>
              </div>

              <div className="cardapio-form-actions">
                <button type="submit" className="btn-salvar">
                  {editando ? '💾 Salvar Alterações' : '✓ Adicionar ao Cardápio'}
                </button>
                <button type="button" onClick={handleCancelar} className="btn-cancelar-form">
                  ✕ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabela */}
        <div className="cardapio-table-container">
          <table className="cardapio-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome do Item</th>
                <th style={{ textAlign: 'center' }}>Categoria</th>
                <th style={{ textAlign: 'center' }}>Preço</th>
                <th style={{ textAlign: 'center' }}>Estoque</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <div className="cardapio-item-numero">{index + 1}</div>
                  </td>
                  <td>
                    <div className="cardapio-item-nome">{item.nome}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="cardapio-categoria-badge">
                      
                      {item.categoria === 'coxinha' ? '🍗 Coxinha' : '🥤 Bebida'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="cardapio-preco-badge">
                      <span className="cardapio-preco-valor">R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className={`cardapio-estoque-badge ${getEstoqueStatus(item.estoque)}`}>
                      <span className="estoque-numero">{item.estoque}</span>
                      {item.estoque === 0 && <span className="estoque-label"> - SEM ESTOQUE</span>}
                      {item.estoque > 0 && item.estoque < 5 && <span className="estoque-label"> - BAIXO</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`cardapio-status-badge ${item.disponivel ? 'status-disponivel' : 'status-indisponivel'}`}>
                      {item.disponivel ? '● Disponível' : '● Indisponível'}
                    </span>
                  </td>
                  <td>
                    <div className="cardapio-acoes">
                      <button
                        onClick={() => handleEditar(item)}
                        className="btn-acao-cardapio btn-editar-cardapio"
                        title="Editar item"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => handleDeletar(item.id)}
                        className="btn-acao-cardapio btn-deletar-cardapio"
                        title="Deletar item"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {itensFiltrados.length === 0 && (
            <div className="cardapio-vazio">
              <p>📝 {searchTerm || filtroCategoria !== 'todos' ? 'Nenhum produto encontrado com este filtro.' : 'Nenhum item no cardápio. Adicione o primeiro!'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cardapio;
