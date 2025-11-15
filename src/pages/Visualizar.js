import React from 'react';
import './Visualizar.css';
import { useAppContext } from '../AppContext';

function Visualizar() {
  const { pedidos } = useAppContext();

  // Filtrar pedidos em preparo (pendente + preparando)
  const pedidosPreparando = pedidos.filter(p => 
    p.status === 'pendente' || p.status === 'preparando'
  );

  // Filtrar pedidos prontos
  const pedidosProntos = pedidos.filter(p => 
    p.status === 'pronto'
  );

  return (
    <div className="visualizar-container-full">
      <div className="visualizar-grid">
        {/* Coluna Esquerda - Preparando */}
        <div className="coluna-preparando">
          <h1 className="titulo-coluna">Preparando...</h1>
          <div className="lista-pedidos">
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
          <div className="lista-pedidos">
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
