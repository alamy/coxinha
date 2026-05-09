import React, { useMemo } from 'react';

function MetasEstatisticas({ stats, caixaData }) {
  // Calcular horário de pico baseado nos pedidos reais
  const horarioPico = useMemo(() => {
    if (!stats.pedidosHoje || stats.pedidosHoje.length === 0) {
      return 'Nenhum pedido hoje';
    }

    // Agrupar pedidos por hora
    const pedidosPorHora = {};
    stats.pedidosHoje.forEach(pedido => {
      if (pedido.data) {
        const hora = new Date(pedido.data).getHours();
        pedidosPorHora[hora] = (pedidosPorHora[hora] || 0) + 1;
      }
    });

    // Encontrar a hora com mais pedidos
    let horaPico = null;
    let maxPedidos = 0;
    Object.entries(pedidosPorHora).forEach(([hora, quantidade]) => {
      if (quantidade > maxPedidos) {
        maxPedidos = quantidade;
        horaPico = parseInt(hora);
      }
    });

    if (horaPico !== null) {
      return `${horaPico.toString().padStart(2, '0')}:00 - ${horaPico + 1}:00`;
    }
    return 'Nenhum pedido hoje';
  }, [stats.pedidosHoje]);

  // Calcular cliente que mais comprou hoje
  const clienteMaisComprou = useMemo(() => {
    if (!stats.pedidosHoje || stats.pedidosHoje.length === 0) {
      return { nome: 'Nenhum cliente', total: 0 };
    }

    // Agrupar gastos por cliente
    const gastosPorCliente = {};
    stats.pedidosHoje.forEach(pedido => {
      if (pedido.pago && pedido.cliente) {
        if (!gastosPorCliente[pedido.cliente]) {
          gastosPorCliente[pedido.cliente] = 0;
        }
        gastosPorCliente[pedido.cliente] += pedido.total;
      }
    });

    // Encontrar cliente com maior gasto
    let clienteTop = null;
    let maiorGasto = 0;
    Object.entries(gastosPorCliente).forEach(([cliente, total]) => {
      if (total > maiorGasto) {
        maiorGasto = total;
        clienteTop = cliente;
      }
    });

    return {
      nome: clienteTop || 'Nenhum cliente',
      total: maiorGasto
    };
  }, [stats.pedidosHoje]);

  // Meta diária fixa de R$ 300
  const META_DIARIA = 300;
  const progressoMeta = (stats.totalPago / META_DIARIA) * 100;
  const metaBatida = stats.totalPago >= META_DIARIA;

  return (
    <div className="secao-metas">
      <h2>🎯 Metas e Estatísticas</h2>
      <div className="metas-grid">
        <div className="meta-card">
          <div className="meta-icon">📅</div>
          <div className="meta-info">
            <div className="meta-label">Meta Diária</div>
            <div className="meta-valor">R$ {META_DIARIA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="meta-progresso">
              <div className="meta-barra">
                <div
                  className="meta-barra-preenchida"
                  style={{
                    width: `${Math.min(progressoMeta, 100)}%`,
                    backgroundColor: metaBatida ? '#4caf50' : '#ff9800'
                  }}
                ></div>
              </div>
              <span className="meta-percentual" style={{ color: metaBatida ? '#4caf50' : '#ff9800' }}>
                {progressoMeta.toFixed(1)}% {metaBatida && '🎉 META BATIDA!'}
              </span>
            </div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">🎫</div>
          <div className="meta-info">
            <div className="meta-label">Ticket Médio</div>
            <div className="meta-valor">
              R$ {stats.pedidosHoje.length > 0
                ? (stats.totalPago / stats.pedidosHoje.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                : '0,00'}
            </div>
            <div className="meta-detalhe">Valor médio por pedido</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">⏰</div>
          <div className="meta-info">
            <div className="meta-label">Horário de Pico</div>
            <div className="meta-valor-texto">{horarioPico}</div>
            <div className="meta-detalhe">Maior movimento</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">👑</div>
          <div className="meta-info">
            <div className="meta-label">Cliente VIP do Dia</div>
            <div className="meta-valor-texto">{clienteMaisComprou.nome}</div>
            <div className="meta-detalhe">
              R$ {clienteMaisComprou.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} gastos hoje
            </div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">🏆</div>
          <div className="meta-info">
            <div className="meta-label">Campeão de Vendas</div>
            <div className="meta-valor-texto">
              {stats.topItens.length > 0 ? stats.topItens[0].nome : 'Nenhum produto vendido'}
            </div>
            <div className="meta-detalhe">Produto mais popular</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetasEstatisticas;
