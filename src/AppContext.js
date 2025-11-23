import React, { createContext, useState, useContext, useEffect } from 'react';
import pedidosDataInicial from './data/pedidos.json';
import cardapioDataInicial from './data/cardapio.json';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Carregar do localStorage ou usar dados iniciais
  const [pedidos, setPedidos] = useState(() => {
    const savedPedidos = localStorage.getItem('pedidos');
    return savedPedidos ? JSON.parse(savedPedidos) : pedidosDataInicial.pedidos;
  });

  const [cardapio, setCardapio] = useState(() => {
    const savedCardapio = localStorage.getItem('cardapio');
    return savedCardapio ? JSON.parse(savedCardapio) : cardapioDataInicial.cardapio;
  });

  // Sincronização em tempo real entre páginas/componentes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'pedidos' && e.newValue) {
        setPedidos(JSON.parse(e.newValue));
      }
      if (e.key === 'cardapio' && e.newValue) {
        setCardapio(JSON.parse(e.newValue));
      }
    };

    // Listener para mudanças no localStorage (funciona entre abas)
    window.addEventListener('storage', handleStorageChange);

    // Listener customizado para mudanças na mesma página
    const handleLocalUpdate = (e) => {
      if (e.detail.key === 'pedidos') {
        setPedidos(e.detail.value);
      }
      if (e.detail.key === 'cardapio') {
        setCardapio(e.detail.value);
      }
    };

    window.addEventListener('localStorageUpdate', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleLocalUpdate);
    };
  }, []);

  // Função para atualizar localStorage e disparar evento customizado
  const dispatchStorageUpdate = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispara evento customizado para atualização na mesma página
    window.dispatchEvent(new CustomEvent('localStorageUpdate', {
      detail: { key, value }
    }));
  };

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    if (pedidos.length > 0) {
      dispatchStorageUpdate('pedidos', pedidos);
    }
  }, [pedidos]);

  useEffect(() => {
    if (cardapio.length > 0) {
      dispatchStorageUpdate('cardapio', cardapio);
    }
  }, [cardapio]);

  // Funções para gerenciar pedidos
  const adicionarPedido = (dadosPedido) => {
    const novoPedido = {
      id: pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
      cliente: dadosPedido.cliente,
      itens: dadosPedido.itens,
      total: dadosPedido.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0),
      status: 'pendente',
      data: new Date().toISOString(),
      observacoes: dadosPedido.observacoes || '',
      pago: false
    };
    setPedidos([...pedidos, novoPedido]);
  };

  const atualizarPedido = (id, dadosAtualizados) => {
    setPedidos(pedidos.map(p => 
      p.id === id ? {
        ...p,
        ...dadosAtualizados,
        data: new Date().toISOString()
      } : p
    ));
  };

  const deletarPedido = (id) => {
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  const mudarStatusPedido = (id, novoStatus) => {
    setPedidos(pedidos.map(p => 
      p.id === id ? { ...p, status: novoStatus } : p
    ));
  };

  const marcarComoPago = (id, statusPago) => {
    setPedidos(pedidos.map(p => 
      p.id === id ? { ...p, pago: statusPago } : p
    ));
  };

  // Funções para gerenciar cardápio
  const adicionarItemCardapio = (novoItem) => {
    setCardapio([...cardapio, novoItem]);
  };

  const atualizarItemCardapio = (id, itemAtualizado) => {
    setCardapio(cardapio.map(item => item.id === id ? itemAtualizado : item));
  };

  const deletarItemCardapio = (id) => {
    setCardapio(cardapio.filter(item => item.id !== id));
  };

  const atualizarEstoque = (id, novoEstoque) => {
    setCardapio(cardapio.map(item => 
      item.id === id ? { ...item, estoque: novoEstoque } : item
    ));
  };

  const value = {
    pedidos,
    cardapio,
    adicionarPedido,
    atualizarPedido,
    deletarPedido,
    mudarStatusPedido,
    marcarComoPago,
    adicionarItemCardapio,
    atualizarItemCardapio,
    deletarItemCardapio,
    atualizarEstoque,
    setPedidos,
    setCardapio
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
