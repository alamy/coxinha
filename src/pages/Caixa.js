import React, { useMemo, useRef } from 'react';
import './Caixa.css';
import { useAppContext } from '../AppContext';
import caixaData from '../data/caixa.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Caixa() {
  const { pedidos } = useAppContext();
  const relatorioRef = useRef(null);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const hoje = new Date().toISOString().split('T')[0];
    
    // Filtrar pedidos de hoje
    const pedidosHoje = pedidos.filter(p => {
      if (!p.data) return false;
      const dataPedido = new Date(p.data).toISOString().split('T')[0];
      return dataPedido === hoje;
    });

    // Se não houver pedidos hoje, mostrar dados zerados
    const pedidosPagos = pedidosHoje.filter(p => p.pago);
    const pedidosPendentes = pedidosHoje.filter(p => !p.pago);

    const totalPago = pedidosPagos.reduce((acc, p) => acc + p.total, 0);
    const totalPendente = pedidosPendentes.reduce((acc, p) => acc + p.total, 0);
    const totalGeral = totalPago + totalPendente;

    // Estatísticas por status
    const porStatus = {
      pendente: pedidosHoje.filter(p => p.status === 'pendente').length,
      preparando: pedidosHoje.filter(p => p.status === 'preparando').length,
      pronto: pedidosHoje.filter(p => p.status === 'pronto').length,
      entregue: pedidosHoje.filter(p => p.status === 'entregue').length,
    };

    // Itens mais vendidos
    const itensMaisVendidos = {};
    pedidosHoje.forEach(pedido => {
      pedido.itens.forEach(item => {
        if (!itensMaisVendidos[item.nome]) {
          itensMaisVendidos[item.nome] = {
            nome: item.nome,
            quantidade: 0,
            total: 0
          };
        }
        itensMaisVendidos[item.nome].quantidade += item.quantidade;
        itensMaisVendidos[item.nome].total += item.preco * item.quantidade;
      });
    });

    const topItens = Object.values(itensMaisVendidos)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    // Se não houver dados reais, usar mockados apenas para exibição
    const usandoDadosMock = pedidosHoje.length === 0;
    
    // Valores padrão quando não há dados
    const dadosPadrao = {
      totalRecebido: 0,
      totalPendente: 0,
      pedidosPagos: 0,
      pedidosPendentes: 0,
      totalPedidos: 0,
      pedidosPorStatus: { pendente: 0, preparando: 0, pronto: 0, entregue: 0 },
      itensMaisVendidos: []
    };
    
    return {
      pedidosHoje,
      pedidosPagos,
      pedidosPendentes,
      totalPago: usandoDadosMock ? dadosPadrao.totalRecebido : totalPago,
      totalPendente: usandoDadosMock ? dadosPadrao.totalPendente : totalPendente,
      totalGeral: usandoDadosMock ? dadosPadrao.totalRecebido + dadosPadrao.totalPendente : totalGeral,
      porStatus: usandoDadosMock ? dadosPadrao.pedidosPorStatus : porStatus,
      topItens: usandoDadosMock ? dadosPadrao.itensMaisVendidos : topItens,
      usandoDadosMock
    };
  }, [pedidos]);

  // Função para exportar relatório em PDF
  const exportarRelatorio = async () => {
    try {
      const elemento = relatorioRef.current;
      
      // Captura a tela
      const canvas = await html2canvas(elemento, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      // Cria o PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width em mm
      const pageHeight = 297; // A4 height em mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Adiciona a primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Adiciona páginas extras se necessário
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Gera o nome do arquivo com data
      const dataHoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const nomeArquivo = `Relatorio_Caixa_${dataHoje}.pdf`;

      // Salva o PDF
      pdf.save(nomeArquivo);
      
      alert(`✅ Relatório exportado com sucesso!\nArquivo: ${nomeArquivo}`);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('❌ Erro ao exportar relatório. Tente novamente.');
    }
  };

  // Função para exportar dados em JSON
  const exportarDadosJSON = () => {
    const dataHoje = new Date().toISOString().split('T')[0];
    const nomeArquivo = `Dados_Caixa_${dataHoje}.json`;
    
    const dadosExportar = {
      data: new Date().toISOString(),
      totalRecebido: stats.totalPago,
      totalPendente: stats.totalPendente,
      totalGeral: stats.totalGeral,
      pedidosPagos: stats.pedidosPagos.length,
      pedidosPendentes: stats.pedidosPendentes.length,
      totalPedidos: stats.pedidosHoje.length,
      pedidosPorStatus: stats.porStatus,
      itensMaisVendidos: stats.topItens,
      pedidos: stats.pedidosHoje
    };

    const blob = new Blob([JSON.stringify(dadosExportar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ Dados exportados com sucesso!\nArquivo: ${nomeArquivo}`);
  };

  return (
    <div className="caixa-container">
      <div className="caixa-content" ref={relatorioRef}>
        {/* Header */}
        <div className="caixa-header">
          <h1>💰 Caixa do Dia</h1>
          <p>Resumo financeiro e estatísticas de vendas</p>
          <p className="data-hoje">{new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          
          {/* Botões de Exportação */}
          <div className="botoes-exportacao">
            <button onClick={exportarRelatorio} className="btn-exportar btn-pdf">
              📄 Exportar PDF
            </button>
            <button onClick={exportarDadosJSON} className="btn-exportar btn-json">
              📊 Exportar Dados (JSON)
            </button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="resumo-cards">
          <div className="card-resumo card-pago">
            <div className="card-icon">💰</div>
            <div className="card-info">
              <div className="card-label">Total Recebido</div>
              <div className="card-valor">R$ {stats.totalPago.toFixed(2)}</div>
              <div className="card-detalhe">
                {stats.usandoDadosMock 
                  ? `0 pedidos`
                  : `${stats.pedidosPagos.length} pedidos pagos`}
              </div>
            </div>
          </div>

          <div className="card-resumo card-pendente">
            <div className="card-icon">⏳</div>
            <div className="card-info">
              <div className="card-label">Pendente</div>
              <div className="card-valor">R$ {stats.totalPendente.toFixed(2)}</div>
              <div className="card-detalhe">
                {stats.usandoDadosMock 
                  ? `0 pedidos`
                  : `${stats.pedidosPendentes.length} pedidos a receber`}
              </div>
            </div>
          </div>

          <div className="card-resumo card-total">
            <div className="card-icon">📊</div>
            <div className="card-info">
              <div className="card-label">Faturamento Total</div>
              <div className="card-valor">R$ {stats.totalGeral.toFixed(2)}</div>
              <div className="card-detalhe">
                {stats.usandoDadosMock 
                  ? `0 pedidos`
                  : `${stats.pedidosHoje.length} pedidos hoje`}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Status */}
        <div className="secao-status">
          <h2>📋 Status dos Pedidos</h2>
          <div className="status-grid">
            <div className="status-card status-pendente-card">
              <div className="status-numero">{stats.porStatus.pendente}</div>
              <div className="status-label">⏳ Pendente</div>
            </div>
            <div className="status-card status-preparando-card">
              <div className="status-numero">{stats.porStatus.preparando}</div>
              <div className="status-label">👨‍🍳 Preparando</div>
            </div>
            <div className="status-card status-pronto-card">
              <div className="status-numero">{stats.porStatus.pronto}</div>
              <div className="status-label">✅ Pronto</div>
            </div>
            <div className="status-card status-entregue-card">
              <div className="status-numero">{stats.porStatus.entregue}</div>
              <div className="status-label">📦 Entregue</div>
            </div>
          </div>
        </div>

        {/* Top Produtos */}
        <div className="secao-top-produtos">
          <h2>🏆 Mais Vendidos do Dia</h2>
          {stats.topItens.length > 0 ? (
            <div className="top-produtos-lista">
              {stats.topItens.map((item, index) => (
                <div key={item.nome} className="top-produto-item">
                  <div className="produto-posicao">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `${index + 1}º`}
                  </div>
                  <div className="produto-info">
                    <div className="produto-nome">{item.nome}</div>
                    <div className="produto-stats">
                      <span className="produto-qtd">{item.quantidade} unidades</span>
                      <span className="produto-total">R$ {item.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="produto-barra">
                    <div 
                      className="produto-barra-preenchida"
                      style={{ 
                        width: `${(item.quantidade / stats.topItens[0].quantidade) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sem-dados">
              <p>📊 Nenhuma venda registrada hoje</p>
            </div>
          )}
        </div>

        {/* Lista de Pedidos Pagos */}
        <div className="secao-pedidos-pagos">
          <h2>💵 Pedidos Pagos Hoje</h2>
          {stats.pedidosPagos.length > 0 ? (
            <div className="pedidos-pagos-lista">
              {stats.pedidosPagos.map((pedido) => (
                <div key={pedido.id} className="pedido-pago-card">
                  <div className="pedido-pago-header">
                    <div className="pedido-cliente">
                      <span className="cliente-icon">👤</span>
                      {pedido.cliente}
                    </div>
                    <div className="pedido-valor-destaque">
                      R$ {pedido.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="pedido-pago-itens">
                    {pedido.itens.map((item, idx) => (
                      <span key={idx} className="item-badge">
                        {item.quantidade}x {item.nome}
                      </span>
                    ))}
                  </div>
                  <div className="pedido-pago-footer">
                    <span className={`pedido-status status-${pedido.status}`}>
                      {pedido.status === 'pendente' && '⏳ Pendente'}
                      {pedido.status === 'preparando' && '👨‍🍳 Preparando'}
                      {pedido.status === 'pronto' && '✅ Pronto'}
                      {pedido.status === 'entregue' && '📦 Entregue'}
                    </span>
                    <span className="pedido-hora">
                      {new Date(pedido.data).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sem-dados">
              <p>💰 Nenhum pedido pago ainda hoje</p>
            </div>
          )}
        </div>

        {/* Lista de Pedidos Pendentes */}
        {stats.pedidosPendentes.length > 0 && (
          <div className="secao-pedidos-pendentes">
            <h2>⏳ Pedidos Pendentes de Pagamento</h2>
            <div className="pedidos-pendentes-lista">
              {stats.pedidosPendentes.map((pedido) => (
                <div key={pedido.id} className="pedido-pendente-card">
                  <div className="pedido-pendente-header">
                    <div className="pedido-cliente">
                      <span className="cliente-icon">👤</span>
                      {pedido.cliente}
                    </div>
                    <div className="pedido-valor-pendente">
                      R$ {pedido.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="pedido-pendente-itens">
                    {pedido.itens.map((item, idx) => (
                      <span key={idx} className="item-badge-pendente">
                        {item.quantidade}x {item.nome}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metas e Estatísticas Gerais */}
        <div className="secao-metas">
          <h2>🎯 Metas e Estatísticas</h2>
          <div className="metas-grid">
            <div className="meta-card">
              <div className="meta-icon">📅</div>
              <div className="meta-info">
                <div className="meta-label">Meta Diária</div>
                <div className="meta-valor">R$ {caixaData.metas.diaria.toFixed(2)}</div>
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
                <div className="meta-valor">R$ {caixaData.estatisticas.ticketMedio.toFixed(2)}</div>
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

        {/* Indicador de dados mockados */}
        {stats.usandoDadosMock && (
          <div className="aviso-mock">
            <p>ℹ️ Nenhum pedido registrado hoje. Crie pedidos para ver os dados em tempo real!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Caixa;
