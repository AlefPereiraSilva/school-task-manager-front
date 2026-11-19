# 💻 Front-end — Gerenciador de Tarefas e Planejador Acadêmico

Interface web desenvolvida em **React** e **Vite** para organização visual da vida acadêmica, oferecendo painel de tarefas com métricas, calendário mensal interativo e controle de avaliações com lançamento/edição rápida de notas e cálculo automático de média.

---

## 🌐 Acesso Online e Gestão do Projeto

* **Aplicação Web (Vercel):** https://school-task-manager-front.vercel.app
* **Documentação Interativa da API (Swagger UI):** https://school-task-manager-api.onrender.com/swagger-ui/index.html
* **Especificação OpenAPI 3 (JSON):** https://school-task-manager-api.onrender.com/v3/api-docs
* **Repositório do Back-end (Spring Boot):** https://github.com/Gerenciador-de-Tarefas-Escolares/school-task-manager-api
* **Repositório do Banco de Dados (PostgreSQL + Docker):** https://github.com/Gerenciador-de-Tarefas-Escolares/Gerenciador-tarefa-banco
* **Planejamento Ágil (Kanban — GitHub Projects):** https://github.com/users/AlefPereiraSilva/projects/1/views/1

> **Nota para avaliação:** O back-end está hospedado em plano gratuito (Render) e entra em modo de suspensão após 15 minutos sem uso. Caso a primeira requisição demore cerca de 30 a 50 segundos, aguarde o carregamento inicial do servidor.

---

## 🏗️ Arquitetura da Aplicação

O sistema adota uma arquitetura desacoplada em três camadas (Cliente-Servidor-Banco), separadas em repositórios independentes e conteinerizados via Docker:

1. **Camada de Apresentação (Front-end — React + Vite):**
   * Aplicação *Single Page Application* (SPA) hospedada no **Vercel**.
   * Comunica-se com o servidor via **Axios**, enviando o token JWT no cabeçalho `Authorization: Bearer <token>` em todas as rotas autenticadas e tratando expiração de sessão de forma centralizada (`interceptadorErro.js`).
2. **Camada de Negócio e Segurança (Back-end — Spring Boot 3):**
   * API RESTful *Stateless* hospedada no **Render**, protegida por **Spring Security** com filtro JWT (`JwtAuthenticationFilter`), validando credenciais tradicionais (**BCrypt**) e tokens **Google OAuth2**.
3. **Camada de Persistência (Banco de Dados — PostgreSQL 16):**
   * Modelagem relacional normalizada (`cadastro`, `materia`, `tarefa`, `avaliacao` e view `calendario`), inicializada via `docker-compose.yml` no repositório de banco de dados.

---

## ✨ Detalhamento das Funcionalidades Implementadas

* **Autenticação e Gestão de Conta:** Cadastro de estudante, login tradicional com e-mail/senha, login social com **Google OAuth2**, recuperação/redefinição de senha via token temporário e exclusão definitiva de conta.
* **Painel e CRUD Completo de Tarefas (`/painel`):** Criação, listagem, edição, conclusão e exclusão de tarefas escolares com prioridade (`BAIXA`, `MEDIA`, `ALTA`), status (`PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`) e prazo de entrega, acompanhados por barra de progresso e cartões de métricas.
* **Matérias Dinâmicas:** Sugestões rápidas de disciplinas escolares e criação automática de novas matérias sob demanda durante o cadastro de tarefas ou avaliações.
* **Calendário Acadêmico (`/calendario`):** Visualização mensal unificada exibindo prazos de tarefas e datas de provas/avaliações diferenciados por cor da matéria.
* **Controle de Avaliações e Notas (`/avaliacoes`):** CRUD completo de provas, testes, exames e trabalhos com lançamento/edição inline de notas e cálculo automático da média geral do estudante.

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
Crie um arquivo `.env` na raiz do repositório baseado no `.env.example`:
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

---

## 💡 Aspectos Relevantes e Decisões de Design

* **Reescrita de Rotas SPA em Produção (`vercel.json`):** Configuração de *rewrite* para `/index.html`, permitindo recarregar diretamente rotas protegidas (`/painel`, `/calendario`, `/avaliacoes`) sem erro 404.
* **Interceptação Centralizada de Autenticação (`interceptadorErro.js`):** Tratamento global de respostas HTTP `401`/`403` para redirecionar automaticamente o usuário ao login quando o token JWT expirar.
* **Qualidade de Software:** Cobertura de **91,33%** com **Vitest** e **React Testing Library**, superando a meta mínima de 70% e cobrindo fluxos críticos de autenticação, CRUD e cálculos de média.
