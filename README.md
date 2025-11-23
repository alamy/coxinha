# 🍗 Comadre Coxinha - Sistema de Gestão de Pedidos

> **⚠️ PROJETO DE ESTUDO**  
> Este é um projeto desenvolvido exclusivamente para fins educacionais e de aprendizado de tecnologias web modernas. O objetivo é explorar conceitos de desenvolvimento front-end, gerenciamento de estado, persistência de dados no cliente e boas práticas de React.

---

## 📋 Sobre o Projeto

Sistema completo de gestão de pedidos para restaurante, desenvolvido como projeto de estudo para explorar funcionalidades modernas do React e gerenciamento de estado sem backend. Simula um ambiente real de operação de restaurante com gestão de cardápio, pedidos, pagamentos e faturamento diário.

O projeto **Comadre Coxinha** é uma aplicação Single Page Application (SPA) que permite:
- Gerenciar cardápio com controle de estoque
- Criar e acompanhar pedidos em tempo real
- Visualizar status de preparação (estilo painel de cozinha)
- Controlar pagamentos e faturamento diário
- Exportar relatórios em PDF e JSON

---

## 🎯 Objetivo Educacional

Este projeto foi criado para **estudo e prática** das seguintes tecnologias e conceitos:

### Conceitos Explorados:
- ✅ **React Hooks**: useState, useEffect, useMemo, useRef, useContext
- ✅ **Context API**: Gerenciamento de estado global sem Redux
- ✅ **React Router**: Navegação SPA com rotas dinâmicas
- ✅ **localStorage**: Persistência de dados no cliente
- ✅ **Custom Events**: Sincronização em tempo real entre componentes
- ✅ **CRUD Operations**: Create, Read, Update, Delete completo
- ✅ **Componentização**: Separação de responsabilidades e reutilização
- ✅ **CSS Modular**: Estilização isolada por componente
- ✅ **Export Functionality**: Geração de PDF com html2canvas e jsPDF

---

## 🛠️ Stack Técnica

### Core
- **React 19.2.0** - Biblioteca principal para construção da UI
- **React Router DOM 7.9.6** - Gerenciamento de rotas
- **React Icons 5.5.0** - Biblioteca de ícones

### Gerenciamento de Estado
- **Context API** - Estado global compartilhado
- **localStorage** - Persistência de dados no navegador
- **Custom Events** - Sincronização entre abas/componentes

### Exportação de Dados
- **html2canvas 1.4.1** - Captura de tela para PDF
- **jsPDF 3.0.3** - Geração de arquivos PDF

### Estrutura de Dados
- **JSON** - Armazenamento local de cardápio, pedidos e configurações

---

## 📁 Arquitetura do Projeto

```
coxinha/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Cardapio.js     # Gestão de cardápio e estoque
│   │   ├── Pedidos.js      # Criação e gestão de pedidos
│   │   ├── Visualizar.js   # Painel de cozinha (kanban)
│   │   └── Caixa.js        # Relatório de faturamento
│   ├── data/               # Dados persistidos
│   │   ├── cardapio.json   # Itens do menu
│   │   ├── pedidos.json    # Pedidos registrados
│   │   └── caixa.json      # Configurações e metas
│   ├── AppContext.js       # Context API - Estado global
│   ├── App.js              # Componente raiz e rotas
│   └── App.css             # Estilos globais
└── package.json
```

---

## ⚙️ Funcionalidades Implementadas

### 1. **Cardápio** (`/cardapio`)
- CRUD completo de itens do menu
- Controle de estoque com alertas visuais
- Gestão de preços e disponibilidade
- Alertas quando estoque < 5 unidades

### 2. **Pedidos** (`/pedidos`)
- Criação de pedidos com múltiplos itens
- Edição e exclusão de pedidos
- Gestão de status (Pendente → Preparando → Pronto → Entregue)
- Controle de pagamento (checkbox pago/não pago)
- Validação de estoque em tempo real
- Cálculo automático de totais

### 3. **Visualizar** (`/visualizar`)
- Painel estilo cozinha (kanban de 2 colunas)
- Visualização de pedidos em preparação e prontos
- Atualização automática em tempo real
- Sem navbar para uso em display fixo

### 4. **Caixa** (`/caixa`)
- Dashboard de faturamento do dia
- Cards de totais: Recebido, Pendente, Total
- Status dos pedidos por categoria
- Top 5 produtos mais vendidos
- Metas diárias com barra de progresso
- Exportação de relatório em PDF
- Exportação de dados em JSON
- Lista detalhada de pedidos pagos e pendentes

---

## 🔄 Fluxo de Dados

### Gerenciamento de Estado (Context API)
```javascript
AppContext
├── pedidos[]           // Array de pedidos
├── cardapio[]          // Array de itens do menu
└── Funções:
    ├── adicionarPedido()
    ├── atualizarPedido()
    ├── deletarPedido()
    ├── mudarStatusPedido()
    ├── marcarComoPago()
    ├── adicionarItemCardapio()
    ├── atualizarItemCardapio()
    ├── deletarItemCardapio()
    └── atualizarEstoque()
```

### Persistência
- Todos os dados são salvos automaticamente no **localStorage**
- Sincronização em tempo real via **Custom Events**
- Suporte para múltiplas abas abertas simultaneamente

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/alamy/coxinha.git

# Entre no diretório
cd coxinha

# Instale as dependências
npm install

# Execute o projeto
npm start
```

A aplicação estará disponível em `http://localhost:3000`

---

## 📦 Scripts Disponíveis

### `npm start`
Executa a aplicação em modo de desenvolvimento.  
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

### `npm test`
Executa os testes em modo interativo.

### `npm run build`
Cria a build de produção na pasta `build/`.  
A aplicação é otimizada e minificada para melhor performance.

---

## 🎨 Padrões e Boas Práticas

### Implementadas neste projeto:
- ✅ Componentização e reutilização de código
- ✅ Separação de responsabilidades (SoC)
- ✅ CSS modular por componente
- ✅ Hooks personalizados (useAppContext)
- ✅ Memoização com useMemo para performance
- ✅ Event-driven architecture para sincronização
- ✅ Validações de formulário
- ✅ Feedback visual para ações do usuário
- ✅ Nomenclatura semântica de variáveis e funções

---

## 📚 Aprendizados e Conceitos

### React Avançado
- **Context API** para estado global sem bibliotecas externas
- **Custom Hooks** para lógica reutilizável
- **useRef** para manipulação de DOM (captura de tela)
- **useMemo** para otimização de renderizações

### Padrões de Design
- **Observer Pattern** via Custom Events
- **Repository Pattern** com localStorage
- **CRUD Operations** completo

### Sincronização de Dados
- Eventos nativos do navegador (`storage`, `CustomEvent`)
- Sincronização entre múltiplas abas
- Persistência automática de estado

---

## ⚠️ Limitações (por ser projeto de estudo)

- **Sem backend**: Dados armazenados apenas no localStorage
- **Sem autenticação**: Não há controle de acesso
- **Sem banco de dados**: Dados perdidos ao limpar cache do navegador
- **Sem API REST**: Comunicação apenas client-side
- **Single-user**: Não suporta múltiplos usuários simultâneos em diferentes dispositivos

---

## 🎓 Sobre Projetos de Estudo

Este projeto foi desenvolvido com propósito **100% educacional**. Os objetivos principais são:

1. **Aprender na prática** conceitos de React e gerenciamento de estado
2. **Explorar arquitetura front-end** sem dependência de backend
3. **Implementar funcionalidades reais** de um sistema de gestão
4. **Praticar boas práticas** de desenvolvimento web
5. **Documentar o processo** de aprendizado

### Por que sem backend?
A escolha de não utilizar backend foi intencional para focar exclusivamente em:
- Gerenciamento de estado no front-end
- Context API e React Hooks
- Persistência client-side
- Sincronização de dados

---

## 📄 Licença

Este projeto é livre para uso educacional e de estudo.

---

## 👨‍💻 Desenvolvido por

**alamy**  
Projeto de estudo - React & Context API

---

## 🔗 Recursos Adicionais

- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Context API Guide](https://react.dev/learn/passing-data-deeply-with-context)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**⭐ Se este projeto ajudou em seus estudos, considere dar uma estrela no repositório!**

