import React, { useState } from 'react';
import './Pedidos.css';
import { useAppContext } from '../AppContext';
import { FaPencilAlt, FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';

function Pedidos() {
  const { pedidos, cardapio, adicionarPedido, atualizarPedido, deletarPedido, mudarStatusPedido } = useAppContext();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    observacoes: ''
  });
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const adicionarItem = (itemCardapio) => {
    const itemExistente = itensSelecionados.find(i => i.id === itemCardapio.id);
    
    if (itemExistente) {
      setItensSelecionados(itensSelecionados.map(i =>
        i.id === itemCardapio.id
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      ));
    } else {
      setItensSelecionados([...itensSelecionados, {
        id: itemCardapio.id,
        nome: itemCardapio.nome,
        preco: itemCardapio.preco,
        quantidade: 1
      }]);
    }
  };

  const removerItem = (itemId) => {
    const item = itensSelecionados.find(i => i.id === itemId);
    if (item.quantidade > 1) {
      setItensSelecionados(itensSelecionados.map(i =>
        i.id === itemId
          ? { ...i, quantidade: i.quantidade - 1 }
          : i
      ));
    } else {
      setItensSelecionados(itensSelecionados.filter(i => i.id !== itemId));
    }
  };

  const calcularTotal = () => {
    return itensSelecionados.reduce((total, item) => 
      total + (item.preco * item.quantidade), 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (itensSelecionados.length === 0) {
      alert('Adicione pelo menos um item ao pedido!');
      return;
    }

    if (editando) {
      atualizarPedido(editando.id, {
        cliente: formData.cliente,
        itens: itensSelecionados,
        total: calcularTotal(),
        observacoes: formData.observacoes
      });
      setEditando(null);
    } else {
      adicionarPedido({
        cliente: formData.cliente,
        itens: itensSelecionados,
        observacoes: formData.observacoes
      });
    }

    setFormData({ cliente: '', observacoes: '' });
    setItensSelecionados([]);
    setMostrarForm(false);
  };

  const handleEditar = (pedido) => {
    setEditando(pedido);
    setFormData({
      cliente: pedido.cliente,
      observacoes: pedido.observacoes
    });
    setItensSelecionados(pedido.itens);
    setMostrarForm(true);
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este pedido?')) {
      deletarPedido(id);
    }
  };

  const handleCancelar = () => {
    setFormData({ cliente: '', observacoes: '' });
    setItensSelecionados([]);
    setEditando(null);
    setMostrarForm(false);
  };

  const mudarStatus = (pedidoId, novoStatus) => {
    mudarStatusPedido(pedidoId, novoStatus);
  };

  return (
    <div className="pedidos-container">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="pedidos-header">
          <h1>📝 Gerenciar Pedidos</h1>
          <p>Crie e acompanhe os pedidos do restaurante</p>
        </div>

        {/* Botão Adicionar */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-novo-pedido">
            {mostrarForm ? '✕ Fechar Formulário' : '+ Novo Pedido'}
          </button>
        </div>

        {/* Formulário */}
        {mostrarForm && (
          <div className="pedidos-form-container">
            <h2>{editando ? '✏️ Editar Pedido' : '➕ Novo Pedido'}</h2>
            <form onSubmit={handleSubmit}>
              {/* Nome do Cliente */}
              <div className="form-group">
                <label className="form-label">Nome do Cliente</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Ex: João Silva"
                />
              </div>

              {/* Seleção de Itens */}
              <div className="form-group">
                <label className="form-label">Selecione as Coxinhas</label>
                <div className="itens-grid">
                  {cardapio.filter(item => item.disponivel).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => item.estoque > 0 && adicionarItem(item)}
                      className={`item-card ${item.estoque === 0 ? 'item-sem-estoque' : item.estoque < 5 ? 'item-estoque-baixo' : ''}`}
                      style={{ 
                        cursor: item.estoque === 0 ? 'not-allowed' : 'pointer',
                        opacity: item.estoque === 0 ? 0.5 : 1
                      }}
                    >
                      <div className="item-card-nome">{item.nome}</div>
                      <div className="item-card-preco">R$ {item.preco.toFixed(2)}</div>
                      <div className={`item-estoque-info ${item.estoque === 0 ? 'sem-estoque-text' : item.estoque < 5 ? 'baixo-estoque-text' : 'ok-estoque-text'}`}>
                        {item.estoque === 0 ? '❌ SEM ESTOQUE' : 
                         item.estoque < 5 ? `⚠️ Restam ${item.estoque}` : 
                         `✓ Estoque: ${item.estoque}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itens Selecionados */}
              {itensSelecionados.length > 0 && (
                <div className="itens-selecionados">
                  <h3>🛒 Itens do Pedido:</h3>
                  {itensSelecionados.map((item) => (
                    <div key={item.id} className="item-selecionado">
                      <div className="item-selecionado-info">
                        <span className="item-selecionado-nome">{item.nome}</span>
                        <span className="item-selecionado-preco">R$ {item.preco.toFixed(2)}</span>
                      </div>
                      <div className="item-controles">
                        <button
                          type="button"
                          onClick={() => removerItem(item.id)}
                          className="btn-quantidade btn-menos"
                        >
                          <FaMinus />
                        </button>
                        <span className="quantidade-display">{item.quantidade}</span>
                        <button
                          type="button"
                          onClick={() => adicionarItem(item)}
                          className="btn-quantidade btn-mais"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pedido-total">
                    <span className="pedido-total-label">Total do Pedido:</span>
                    <span className="pedido-total-valor">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Observações */}
              <div className="form-group">
                <label className="form-label">Observações (opcional)</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Ex: Sem cebola, bem quente, embalagem separada..."
                />
              </div>

              {/* Botões */}
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editando ? '💾 Salvar Alterações' : '✓ Criar Pedido'}
                </button>
                <button type="button" onClick={handleCancelar} className="btn-cancelar">
                  ✕ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabela de Pedidos */}
        <div className="pedidos-table-container">
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, index) => (
                <tr key={pedido.id}>
                  <td>
                    <div className="pedido-numero">{index + 1}</div>
                  </td>
                  <td>
                    <div className="pedido-cliente">{pedido.cliente}</div>
                    {pedido.observacoes && (
                      <div className="pedido-observacao">"{pedido.observacoes}"</div>
                    )}
                  </td>
                  <td>
                    <div className="pedido-itens-lista">
                      {pedido.itens.map((item, idx) => (
                        <div key={idx} className="pedido-item">
                          <span className="pedido-item-quantidade">{item.quantidade}x</span> {item.nome}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="pedido-total-badge">
                      <span className="pedido-total-valor-table">R$ {pedido.total.toFixed(2)}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <select
                      value={pedido.status}
                      onChange={(e) => mudarStatus(pedido.id, e.target.value)}
                      className={`status-select status-${pedido.status}`}
                    >
                      <option value="pendente">⏳ Pendente</option>
                      <option value="preparando">👨‍🍳 Preparando</option>
                      <option value="pronto">✅ Pronto</option>
                      <option value="entregue">📦 Entregue</option>
                    </select>
                  </td>
                  <td>
                    <div className="acoes-container">
                      <button
                        onClick={() => handleEditar(pedido)}
                        className="btn-acao btn-editar"
                        title="Editar pedido"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => handleDeletar(pedido.id)}
                        className="btn-acao btn-deletar"
                        title="Deletar pedido"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pedidos.length === 0 && (
            <div className="pedidos-vazio">
              <p>📝 Nenhum pedido registrado. Crie o primeiro!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pedidos;
