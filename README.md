# 💻 Front-end — Gerenciador de Tarefas e Planejador Acadêmico

Interface web desenvolvida em **React** e **Vite** para organização visual da vida acadêmica, oferecendo painel de tarefas com métricas, calendário mensal interativo e controle de avaliações com lançamento/edição rápida de notas e cálculo automático de média.

---

## 🛠️ Tecnologias e Bibliotecas

* **React** & **Vite**
* **React Router DOM** (Navegação SPA e proteção de rotas autenticadas)
* **Axios** (Cliente HTTP com injeção automática de Bearer Token e interceptador global de erros)
* **@react-oauth/google** (Integração de autenticação com Google)
* **Vitest**, **React Testing Library** & **jsdom** (Testes unitários, integração e cobertura `v8`)
* **Docker**

---

## 📂 Estrutura de Pastas (`src/`)

* `componentes/` — Componentes reutilizáveis:
  * `MenuLateral/` — Navegação entre **Minhas Tarefas**, **Calendário**, **Avaliações e Notas**, exclusão de conta e logout.
  * `Cabecalho/`, `BarraProgresso/`, `CartaoResumo/` — Indicadores visuais do dashboard.
  * `FormularioTarefa/` — Cadastro de tarefas com seleção de matérias do usuário, sugestões rápidas vindas de `materias.js` ou criação dinâmica.
  * `ListaTarefas/`, `ItemTarefa/`, `FiltrosTarefas/` — Listagem, conclusão, edição, exclusão e filtragem de tarefas.
  * `ProximasEntregas/`, `PendentesPorMateria/` — Painéis de acompanhamento rápido.
  * `ModalExcluirConta/` e `RotaProtegida/` — Segurança e controle de acesso.
* `paginas/` — Telas principais da aplicação:
  * `Login/`, `Cadastro/`, `RecuperarSenha/` — Fluxos públicos de autenticação.
  * `Painel/` (`/painel`) — Dashboard principal de tarefas e progresso.
  * `Calendario/` (`/calendario`) — Grade mensal unificada com tarefas e avaliações identificadas por cor da matéria.
  * `Avaliacoes/` (`/avaliacoes`) — Cadastro de provas/trabalhos, sugestões rápidas de matérias (`materias.js`), lançamento/edição inline de notas e cálculo automático de média geral.
* `servicos/` — Configuração da instância Axios (`api.js`) e tratamento centralizado de erros (`interceptadorErro.js`).
* `utilitarios/` & `dados/` — Formatação de datas (`datas.js`) e catálogo de sugestões de matérias (`materias.js`).

---

## ⚙️ Como Executar

### 1. Configuração de Ambiente
Crie um arquivo `.env` na raiz da pasta `frontend/` baseado no `.env.example`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_google
```

### 2. Execução Local (Node / Vite)
```bash
npm install
npm run dev
```
Acesse no navegador em **`http://localhost:5173`** (certifique-se de que o back-end esteja rodando na porta `8080`).

### 3. Execução via Docker
```bash
docker build -t gerenciador-tarefas-frontend .
docker run -p 5173:80 gerenciador-tarefas-frontend
```

---

## 🧪 Testes Automatizados e Cobertura (Vitest)

Para rodar todas as suítes de testes unitários e de integração:

```bash
npm test
```

Para gerar o relatório completo de cobertura de código:

```bash
npx vitest run --coverage
```

* **Suítes aprovadas:** **14 arquivos de teste (37 testes passando)**
* **Cobertura Global (Statements / Lines):** **91,33%**
