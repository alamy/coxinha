import React, { useState } from 'react';
import './Cardapio.css';
import cardapioData from '../data/cardapio.json';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

function Cardapio() {
  const [itens, setItens] = useState(cardapioData.cardapio);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    disponivel: true
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
      // Editar item existente
      setItens(itens.map(item => 
        item.id === editando.id 
          ? { ...item, ...formData, preco: parseFloat(formData.preco), estoque: parseInt(formData.estoque) }
          : item
      ));
      setEditando(null);
    } else {
      // Adicionar novo item
      const novoItem = {
        id: Math.max(...itens.map(i => i.id), 0) + 1,
        nome: formData.nome,
        categoria: 'coxinha',
        preco: parseFloat(formData.preco),
        disponivel: formData.disponivel,
        estoque: parseInt(formData.estoque)
      };
      setItens([...itens, novoItem]);
    }
    
    // Resetar formulário
    setFormData({ nome: '', preco: '', disponivel: true, estoque: 0 });
    setMostrarForm(false);
  };

  const handleEditar = (item) => {
    setEditando(item);
    setFormData({
      nome: item.nome,
      preco: item.preco.toString(),
      disponivel: item.disponivel,
      estoque: item.estoque.toString()
    });
    setMostrarForm(true);
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      setItens(itens.filter(item => item.id !== id));
    }
  };

  const handleCancelar = () => {
    setFormData({ nome: '', preco: '', disponivel: true, estoque: 0 });
    setEditando(null);
    setMostrarForm(false);
  };

  const getEstoqueStatus = (estoque) => {
    if (estoque === 0) return 'sem-estoque';
    if (estoque < 5) return 'estoque-baixo';
    return 'estoque-ok';
  };

  return (
    <div className="cardapio-container">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="cardapio-header">
          <h1>🍗 Cardápio Comadre Coxinha</h1>
          <p>Gerencie os itens do cardápio</p>
        </div>

        {/* Botão Adicionar */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-adicionar-item">
            {mostrarForm ? '✕ Fechar Formulário' : '+ Adicionar Novo Item'}
          </button>
        </div>

        {/* Formulário */}
        {mostrarForm && (
          <div className="cardapio-form-container">
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
                <th style={{ textAlign: 'center' }}>Preço</th>
                <th style={{ textAlign: 'center' }}>Estoque</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <div className="cardapio-item-numero">{index + 1}</div>
                  </td>
                  <td>
                    <div className="cardapio-item-nome">{item.nome}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="cardapio-preco-badge">
                      <span className="cardapio-preco-valor">R$ {item.preco.toFixed(2)}</span>
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

          {itens.length === 0 && (
            <div className="cardapio-vazio">
              <p>📝 Nenhum item no cardápio. Adicione o primeiro!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cardapio;
