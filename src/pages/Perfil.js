
  import React, { useEffect, useState, useMemo } from 'react';
  import { useAppContext } from '../AppContext';
  import './Perfil.css';

  export default function Perfil() {
    const { perfil, setPerfil } = useAppContext();
    const colors = useMemo(() => ['#d2691e', '#e63946', '#2a9d8f', '#264653'], []);
    const backgrounds = useMemo(() => ['#fef3e2', '#fffbe6', '#f0f4f8', '#fff'], []);
    const textColors = useMemo(() => ['#222', '#333', '#fff', '#a0522d'], []);
    const pedidosMenuColors = useMemo(() => ['#a0522d', '#e67e22', '#34495e', '#16a085'], []);
    // tabelaCardapioColors removed: table color is global `corTabelas` now
    const headerColors = useMemo(() => ['#264653', '#2a9d8f', '#e63946', '#34495e'], []);
    const tableColors = useMemo(() => ['#34495e', '#2c3e50', '#16a085', '#a0522d'], []);

    const [nome, setNome] = useState(perfil?.nomeSistema || '');
    const [cor, setCor] = useState(perfil?.cor || colors[0]);
    const [background, setBackground] = useState(perfil?.background || backgrounds[0]);
    const [texto, setTexto] = useState(perfil?.texto || textColors[0]);
    const [corMenuPedidos, setCorMenuPedidos] = useState(perfil?.corMenuPedidos || pedidosMenuColors[0]);
    const [corCabecalho, setCorCabecalho] = useState(perfil?.corCabecalho || headerColors[0]);
    const [corTabelas, setCorTabelas] = useState(perfil?.corTabelas || tableColors[0]);

    useEffect(() => {
      setNome(perfil?.nomeSistema || '');
      setCor(perfil?.cor || colors[0]);
      setBackground(perfil?.background || backgrounds[0]);
      setTexto(perfil?.texto || textColors[0]);
      setCorMenuPedidos(perfil?.corMenuPedidos || pedidosMenuColors[0]);
      setCorCabecalho(perfil?.corCabecalho || headerColors[0]);
      setCorTabelas(perfil?.corTabelas || tableColors[0]);
    }, [perfil, colors, backgrounds, textColors, pedidosMenuColors, headerColors, tableColors]);

    function handleSalvar(e) {
      e.preventDefault();
      // corTabelaCardapio no longer faz parte do perfil
      setPerfil({ nomeSistema: nome, cor, background, texto, corMenuPedidos, corCabecalho, corTabelas });
    }

    function handleCancelar(e) {
      e.preventDefault();
      setNome(perfil?.nomeSistema || '');
      setCor(perfil?.cor || colors[0]);
      setBackground(perfil?.background || backgrounds[0]);
      setTexto(perfil?.texto || textColors[0]);
      setCorMenuPedidos(perfil?.corMenuPedidos || pedidosMenuColors[0]);
      setCorCabecalho(perfil?.corCabecalho || headerColors[0]);
      setCorTabelas(perfil?.corTabelas || tableColors[0]);
    }

    return (
      <div className="perfil-container">
        <div className="perfil-preview" style={{ borderColor: 'var(--brand-color)', background: background }}>
          <h2 style={{ color: cor }}>{nome || 'Comadre Coxinha'}</h2>
          <div className="preview-box" style={{ background: cor, color: texto, border: `2px solid ${texto}` }} />
        </div>

        <form className="perfil-form" onSubmit={handleSalvar}>
          <label>
            <p>Nome do sistema</p>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do estabelecimento"
            />
          </label>

          <div className="colors">
            <div className="colors-label">Cor principal</div>
            <div className="colors-list">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch ${c === cor ? 'selected' : ''}`}
                  onClick={() => setCor(c)}
                  style={{ background: c }}
                  aria-label={`Selecionar cor ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="colors">
            <div className="colors-label">Cor de fundo</div>
            <div className="colors-list">
              {backgrounds.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  className={`swatch ${bg === background ? 'selected' : ''}`}
                  onClick={() => setBackground(bg)}
                  style={{ background: bg, border: bg === '#fff' ? '1px solid #ccc' : 'none' }}
                  aria-label={`Selecionar fundo ${bg}`}
                />
              ))}
            </div>
          </div>

          <div className="colors">
            <div className="colors-label">Cor do texto</div>
            <div className="colors-list">
              {textColors.map((tc) => (
                <button
                  key={tc}
                  type="button"
                  className={`swatch ${tc === texto ? 'selected' : ''}`}
                  onClick={() => setTexto(tc)}
                  style={{ background: tc, color: tc === '#fff' ? '#222' : '#fff', border: tc === '#fff' ? '1px solid #ccc' : 'none' }}
                  aria-label={`Selecionar texto ${tc}`}
                >A</button>
              ))}
            </div>
          </div>

          <div className="colors">
            <div className="colors-label">Cor do menu Pedidos</div>
            <div className="colors-list">
              {pedidosMenuColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch ${c === corMenuPedidos ? 'selected' : ''}`}
                  onClick={() => setCorMenuPedidos(c)}
                  style={{ background: c }}
                  aria-label={`Selecionar cor menu pedidos ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Cor da tabela do Cardápio removida - agora é controlada por 'Cor das Tabelas' global */}

          <div className="colors">
            <div className="colors-label">Cor do Cabeçalho</div>
            <div className="colors-list">
              {headerColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch ${c === corCabecalho ? 'selected' : ''}`}
                  onClick={() => setCorCabecalho(c)}
                  style={{ background: c }}
                  aria-label={`Selecionar cor cabeçalho ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="colors">
            <div className="colors-label">Cor das Tabelas</div>
            <div className="colors-list">
              {tableColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch ${c === corTabelas ? 'selected' : ''}`}
                  onClick={() => setCorTabelas(c)}
                  style={{ background: c }}
                  aria-label={`Selecionar cor tabelas ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="btn save">Salvar</button>
            <button type="button" className="btn cancel" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }
