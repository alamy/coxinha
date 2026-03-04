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

  // Perfil do sistema (nome e cor) - persistido no localStorage
  const [perfil, setPerfil] = useState(() => {
    const saved = localStorage.getItem('perfil');
    return saved
      ? JSON.parse(saved)
      : {
          nomeSistema: 'Comadre Coxinha',
          cor: '#0d6efd',              // brand default: blue
          background: '#f4f8ff',       // light blue background
          texto: '#0b2540',            // dark bluish text for contrast
          corMenuPedidos: '#0b5ed7',   // darker blue for pedidos menu
          corCabecalho: '#0b5ed7',     // header default
          corTabelas: '#e9f5ff'        // light table header background
        };
  });

  // Aplicar cor escolhida como variável CSS global e persistir
  useEffect(() => {
    if (perfil) {
      if (perfil.cor) {
        document.documentElement.style.setProperty('--brand-color', perfil.cor);
      }
      if (perfil.background) {
        document.documentElement.style.setProperty('--background-color', perfil.background);
      }
      if (perfil.texto) {
        document.documentElement.style.setProperty('--text-color', perfil.texto);
      }
      if (perfil.corMenuPedidos) {
        document.documentElement.style.setProperty('--pedidos-header-color', perfil.corMenuPedidos);
      }
      // corTabelaCardapio removed from perfil (no longer configurable per-cardápio)
      if (perfil.corCabecalho) {
        document.documentElement.style.setProperty('--header-color', perfil.corCabecalho);
      }
      if (perfil.corTabelas) {
        document.documentElement.style.setProperty('--table-color', perfil.corTabelas);
      }
    }
    // persistir no localStorage e disparar evento para outras abas
    dispatchStorageUpdate('perfil', perfil);
  }, [perfil]);

  // Funções para gerenciar pedidos
  const adicionarPedido = (dadosPedido) => {
    // Validar estoque antes de criar o pedido
    if (!Array.isArray(dadosPedido.itens) || dadosPedido.itens.length === 0) {
      return { success: false, message: 'Pedido sem itens.' };
    }

    // Verifica disponibilidade
    for (const pedidoItem of dadosPedido.itens) {
      const encontrado = pedidoItem.id
        ? cardapio.find(c => c.id === pedidoItem.id)
        : cardapio.find(c => c.nome === pedidoItem.nome);
      if (!encontrado) {
        return { success: false, message: `Item não encontrado: ${pedidoItem.nome || pedidoItem.id}` };
      }
      const atualEstoque = parseInt(encontrado.estoque || 0, 10);
      const quantidadePedido = parseInt(pedidoItem.quantidade || pedidoItem.quantidade === 0 ? pedidoItem.quantidade : 0, 10) || 0;
      if (quantidadePedido > atualEstoque) {
        return { success: false, message: `Estoque insuficiente para ${encontrado.nome}. Disponível: ${atualEstoque}, requisitado: ${quantidadePedido}` };
      }
    }

    // Se chegou aqui, estoque é suficiente — aplicar dedução
    dadosPedido.itens.forEach((pedidoItem) => {
      const encontrado = pedidoItem.id
        ? cardapio.find(c => c.id === pedidoItem.id)
        : cardapio.find(c => c.nome === pedidoItem.nome);
      if (encontrado) {
        const atualEstoque = parseInt(encontrado.estoque || 0, 10);
        const quantidadePedido = parseInt(pedidoItem.quantidade || 0, 10);
        const novoEstoque = Math.max(0, atualEstoque - quantidadePedido);
        atualizarEstoque(encontrado.id, novoEstoque);
      }
    });

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
    return { success: true, pedido: novoPedido };
  };

  // Restaura o estoque dos itens de um pedido (uso em cancelamento/deleção)
  const restaurarEstoqueDoPedido = (pedido) => {
    if (!pedido || !Array.isArray(pedido.itens)) return;
    pedido.itens.forEach((pedidoItem) => {
      const encontrado = pedidoItem.id
        ? cardapio.find(c => c.id === pedidoItem.id)
        : cardapio.find(c => c.nome === pedidoItem.nome);
      if (encontrado) {
        const atual = parseInt(encontrado.estoque || 0, 10);
        const quantidade = parseInt(pedidoItem.quantidade || 0, 10);
        const novo = atual + quantidade;
        atualizarEstoque(encontrado.id, novo);
      }
    });
  };

  const atualizarPedido = (id, dadosAtualizados) => {
    const pedidoAntigo = pedidos.find(p => p.id === id);
    if (!pedidoAntigo) return { success: false, message: 'Pedido não encontrado.' };

    const novosItens = Array.isArray(dadosAtualizados.itens) ? dadosAtualizados.itens : pedidoAntigo.itens;

    // Montar mapa de quantidades antigas e novas por item id (ou nome como fallback)
    const mapaAntigo = new Map();
    pedidoAntigo.itens.forEach(it => {
      const key = it.id != null ? `id:${it.id}` : `nome:${it.nome}`;
      mapaAntigo.set(key, parseInt(it.quantidade || 0, 10));
    });

    const mapaNovo = new Map();
    novosItens.forEach(it => {
      const key = it.id != null ? `id:${it.id}` : `nome:${it.nome}`;
      mapaNovo.set(key, parseInt(it.quantidade || 0, 10));
    });

    // Verificar se há estoque suficiente para os aumentos de quantidade
    for (const [key, novaQtd] of mapaNovo.entries()) {
      const antigoQtd = mapaAntigo.get(key) || 0;
      const delta = novaQtd - antigoQtd; // >0 significa precisa reduzir estoque adicional
      if (delta > 0) {
        // localizar item no cardapio
        const [, val] = key.split(':');
        const encontrado = key.startsWith('id:') ? cardapio.find(c => c.id === parseInt(val, 10)) : cardapio.find(c => c.nome === val);
        if (!encontrado) return { success: false, message: `Item do pedido não encontrado: ${val}` };
        const atualEstoque = parseInt(encontrado.estoque || 0, 10);
        if (delta > atualEstoque) {
          return { success: false, message: `Estoque insuficiente para ${encontrado.nome}. Disponível: ${atualEstoque}, requisitado adicional: ${delta}` };
        }
      }
    }

    // Aplicar ajustes de estoque conforme diferença
    for (const [key, novaQtd] of mapaNovo.entries()) {
      const antigoQtd = mapaAntigo.get(key) || 0;
      const delta = novaQtd - antigoQtd; // positivo => reduzir estoque; negativo => restaurar estoque
      const [, val] = key.split(':');
      const encontrado = key.startsWith('id:') ? cardapio.find(c => c.id === parseInt(val, 10)) : cardapio.find(c => c.nome === val);
      if (!encontrado) continue;
      const atual = parseInt(encontrado.estoque || 0, 10);
      const novoEstoque = Math.max(0, atual - delta);
      atualizarEstoque(encontrado.id, novoEstoque);
    }

    // Atualizar o pedido
    const pedidosAtualizados = pedidos.map(p => p.id === id ? { ...p, ...dadosAtualizados, itens: novosItens, data: new Date().toISOString() } : p);
    setPedidos(pedidosAtualizados);
    return { success: true };
  };

  const deletarPedido = (id) => {
    const pedidoParaDeletar = pedidos.find(p => p.id === id);
    if (pedidoParaDeletar) {
      // Se o pedido ainda não estiver cancelado, restauramos o estoque
      if (pedidoParaDeletar.status !== 'cancelado') {
        restaurarEstoqueDoPedido(pedidoParaDeletar);
      }
    }
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  const mudarStatusPedido = (id, novoStatus) => {
    setPedidos(pedidos.map(p => {
      if (p.id === id) {
        // Se estiver mudando para 'cancelado' e ainda não estava cancelado, restaurar estoque
        if (novoStatus === 'cancelado' && p.status !== 'cancelado') {
          restaurarEstoqueDoPedido(p);
        }
        return { ...p, status: novoStatus };
      }
      return p;
    }));
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
    perfil,
    setPerfil,
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
