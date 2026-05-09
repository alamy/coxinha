import React from 'react';

function MetasEstatisticas({ stats, caixaData }) {
  return (
    <div className="secao-metas">
      <h2>🎯 Metas e Estatísticas</h2>
      <div className="metas-grid">
        <div className="meta-card">
          <div className="meta-icon">📅</div>
          <div className="meta-info">
            <div className="meta-label">Meta Diária</div>
            <div className="meta-valor">R$ {caixaData.metas.diaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="meta-progresso">
              <div className="meta-barra">
                <div
                  className="meta-barra-preenchida"
                  style={{
                    width: `${Math.min((stats.totalPago / caixaData.metas.diaria) * 100, 100)}%`
                  }}
                ></div>
              </div>
              <span className="meta-percentual">
                {((stats.totalPago / caixaData.metas.diaria) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">🎫</div>
          <div className="meta-info">
            <div className="meta-label">Ticket Médio</div>
            <div className="meta-valor">R$ {caixaData.estatisticas.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="meta-detalhe">Valor médio por pedido</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">⏰</div>
          <div className="meta-info">
            <div className="meta-label">Horário de Pico</div>
            <div className="meta-valor-texto">{caixaData.estatisticas.horarioPico}</div>
            <div className="meta-detalhe">Maior movimento</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon"></div>
          <div className="meta-info">
            <div className="meta-label">Crescimento</div>
            <div className="meta-valor-numero">+{caixaData.estatisticas.taxaCrescimento}%</div>
            <div className="meta-detalhe">Comparado ao mês anterior</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">🏆</div>
          <div className="meta-info">
            <div className="meta-label">Campeão de Vendas</div>
            <div className="meta-valor-texto">{caixaData.estatisticas.produtoMaisVendido}</div>
            <div className="meta-detalhe">Produto mais popular</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetasEstatisticas;
