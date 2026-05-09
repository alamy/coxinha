import React, { useEffect, useRef } from 'react';
import './Visualizar.css';
import { useAppContext } from '../AppContext';

function Visualizar() {
  const { pedidos } = useAppContext();
  const listaPreparandoRef = useRef(null);
  const listaProntosRef = useRef(null);

  // Filtrar pedidos em preparo (pendente + preparando)
  const pedidosPreparando = pedidos.filter(p => 
    p.status === 'pendente' || p.status === 'preparando'
  );

  // Filtrar pedidos prontos
  const pedidosProntos = pedidos.filter(p => 
    p.status === 'pronto'
  );

  // Função para animar scroll
  const startAutoScroll = (element) => {
    if (!element || element.scrollHeight <= element.clientHeight) return;

    const scrollHeight = element.scrollHeight - element.clientHeight;
    const totalDistance = scrollHeight * 2; // ida e volta
    const totalTime = 6000; // 4 segundos para ida e volta
    const steps = totalTime / 60; // 50ms por passo
    const scrollStep = totalDistance / steps;

    let direction = 'down';
    let currentPosition = 0;

    const interval = setInterval(() => {
      if (direction === 'down') {
        currentPosition += scrollStep;
        element.scrollTop = Math.min(currentPosition, scrollHeight);
        if (currentPosition >= scrollHeight) {
          direction = 'up';
        }
      } else {
        currentPosition -= scrollStep;
        element.scrollTop = Math.max(currentPosition, 0);
        if (currentPosition <= 0) {
          direction = 'down';
          currentPosition = 0;
        }
      }
    }, 50);

    element._autoScrollInterval = interval;
  };

  useEffect(() => {
    // Limpar intervalos anteriores
    if (listaPreparandoRef.current?._autoScrollInterval) {
      clearInterval(listaPreparandoRef.current._autoScrollInterval);
    }
    if (listaProntosRef.current?._autoScrollInterval) {
      clearInterval(listaProntosRef.current._autoScrollInterval);
    }

    // Iniciar novos intervalos se houver pedidos
    if (pedidosPreparando.length > 0) {
      setTimeout(() => startAutoScroll(listaPreparandoRef.current), 2000);
    }
    if (pedidosProntos.length > 0) {
      setTimeout(() => startAutoScroll(listaProntosRef.current), 2000);
    }

    // Cleanup
    return () => {
      if (listaPreparandoRef.current?._autoScrollInterval) {
        clearInterval(listaPreparandoRef.current._autoScrollInterval);
      }
      if (listaProntosRef.current?._autoScrollInterval) {
        clearInterval(listaProntosRef.current._autoScrollInterval);
      }
    };
  }, [pedidosPreparando, pedidosProntos]);

  return (
    <div className="visualizar-container-full">
      <div className="visualizar-grid">
        {/* Coluna Esquerda - Preparando */}
        <div className="coluna-preparando">
          <h1 className="titulo-coluna">Preparando...</h1>
          <div className="lista-pedidos" ref={listaPreparandoRef}>
            {pedidosPreparando.length === 0 ? (
              <p className="mensagem-vazia">Nenhum pedido em preparo</p>
            ) : (
              pedidosPreparando.map((pedido) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-nome">{pedido.cliente}</div>
                  <div className="pedido-detalhes">
                    {pedido.itens.map((item, idx) => (
                      <div key={idx} className="pedido-item-detalhe">
                        <span className="item-quantidade">{item.quantidade}x</span> {item.nome}
                      </div>
                    ))}
                  </div>
                  <div className="pedido-status-badge status-preparando">
                    {pedido.status === 'pendente' ? '⏳ Aguardando' : '👨‍🍳 Fazendo'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Divisória Vertical */}
        <div className="divisoria-vertical"></div>

        {/* Coluna Direita - Prontos */}
        <div className="coluna-prontos">
          <h1 className="titulo-coluna">Ta pronto viu?</h1>
          <div className="lista-pedidos" ref={listaProntosRef}>
            {pedidosProntos.length === 0 ? (
              <p className="mensagem-vazia mensagem-vazia-pronto">Nenhum pedido pronto</p>
            ) : (
              pedidosProntos.map((pedido) => (
                <div key={pedido.id} className="pedido-card pedido-pronto">
                  <div className="pedido-nome pedido-nome-pronto">{pedido.cliente}</div>
                  <div className="pedido-detalhes">
                    {pedido.itens.map((item, idx) => (
                      <div key={idx} className="pedido-item-detalhe">
                        <span className="item-quantidade">{item.quantidade}x</span> {item.nome}
                      </div>
                    ))}
                  </div>
                  <div className="pedido-status-badge status-pronto">
                    ✅ Pronto!
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Visualizar;
