# Blog Professores — Frontend

Aplicação web desenvolvida em React para o projeto **Blog Professores**, permitindo a visualização, criação, edição e exclusão de publicações, com autenticação de usuários e integração com uma API REST.

O projeto foi desenvolvido como parte da pós-graduação em desenvolvimento Full Stack, utilizando uma arquitetura separada entre **frontend, backend e banco de dados**, com execução local e também através de Docker.

> 📱 **Fase 4:** o app mobile em React Native está na pasta [`blog-professores-mobile`](./blog-professores-mobile). A documentação dele (setup, arquitetura, guia de uso e as mudanças na API) está no [README do mobile](./blog-professores-mobile/README.md).

---

## 📌 Objetivo do Projeto

O objetivo do projeto é disponibilizar uma plataforma web para publicação e gerenciamento de conteúdos produzidos por professores.

A aplicação permite:

* Visualizar publicações;
* Consultar uma publicação individualmente;
* Realizar autenticação de usuários;
* Criar publicações;
* Editar publicações;
* Excluir publicações;
* Proteger funcionalidades administrativas através de autenticação;
* Consumir dados de uma API REST;
* Executar o ambiente completo através de Docker Compose.

---

## 🚀 Tecnologias Utilizadas

### Frontend

* **React 19**
* **React DOM**
* **React Router DOM**
* **Styled Components**
* **Vite**
* **JavaScript (ES Modules)**
* **ESLint**

### Backend

O frontend se comunica com uma API desenvolvida em:

* **Node.js**
* **Express**
* **Mongoose**
* **MongoDB**
* **JWT**
* **bcrypt**
* **Joi**

### Infraestrutura

* **Docker**
* **Docker Compose**
* **GitHub Actions**

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura separada em três componentes principais:

```text
┌──────────────────────┐
│      Frontend        │
│   React + Vite       │
│      :5173            │
└──────────┬───────────┘
           │
           │ HTTP / REST
           ▼
┌──────────────────────┐
│       Backend        │
│ Node.js + Express    │
│       :3000          │
└──────────┬───────────┘
           │
           │ Mongoose
           ▼
┌──────────────────────┐
│       MongoDB        │
│       :27017         │
└──────────────────────┘
```

O frontend é responsável pela interface e interação com o usuário.

O backend disponibiliza os endpoints da API REST, controla autenticação, validações e operações de CRUD.

O MongoDB é responsável pelo armazenamento dos dados.

---

# 📁 Estrutura do Projeto

```text
blog-professores-front/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── Cabecalho.jsx
│   │   ├── CampoBusca.jsx
│   │   ├── CardPost.jsx
│   │   └── RotaPrivada.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   └── useAuth.js
│   │
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── CriarPost.jsx
│   │   ├── EditarPost.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Post.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── styles/
│   │   └── GlobalStyle.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🧩 Principais Componentes

## Páginas

### `Home.jsx`

Página inicial da aplicação.

Responsável por consultar a API e apresentar a lista de publicações disponíveis.

### `Post.jsx`

Exibe os detalhes de uma publicação individual.

### `Login.jsx`

Tela responsável pela autenticação do usuário.

Após o login, o token JWT retornado pela API é armazenado para utilização nas requisições protegidas.

### `Admin.jsx`

Área administrativa para gerenciamento das publicações.

Permite acessar as funcionalidades de criação, edição e exclusão de posts.

### `CriarPost.jsx`

Formulário utilizado para criação de novas publicações.

### `EditarPost.jsx`

Formulário utilizado para alteração de publicações existentes.

---

# 🔐 Autenticação

A autenticação é realizada através de **JWT (JSON Web Token)**.

O fluxo funciona da seguinte maneira:

```text
Usuário
   │
   ▼
Tela de Login
   │
   │ email + senha
   ▼
API /login
   │
   ▼
Token JWT
   │
   ▼
AuthProvider
   │
   ▼
localStorage
```

O token é utilizado nas requisições que exigem autenticação.

Exemplo:

```http
Authorization: Bearer TOKEN
```

O frontend possui um contexto de autenticação responsável por controlar:

* Token;
* Usuário autenticado;
* Estado de autenticação;
* Login;
* Logout.

Os arquivos relacionados à autenticação estão em:

```text
src/context/
```

---

# 🔒 Rotas Privadas

A aplicação possui o componente:

```text
src/components/RotaPrivada.jsx
```

Ele controla o acesso às páginas que necessitam de autenticação.

Usuários não autenticados não devem acessar as funcionalidades administrativas protegidas.

---

# 🌐 Integração com a API

A comunicação com o backend está centralizada em:

```text
src/services/api.js
```

O frontend utiliza `fetch()` para realizar as requisições HTTP.

Principais operações:

| Operação       | Método | Endpoint     |
| -------------- | ------ | ------------ |
| Listar posts   | GET    | `/posts`     |
| Buscar post    | GET    | `/posts/:id` |
| Criar post     | POST   | `/posts`     |
| Atualizar post | PUT    | `/posts/:id` |
| Excluir post   | DELETE | `/posts/:id` |
| Login          | POST   | `/login`     |

As operações protegidas enviam o token JWT através do header:

```http
Authorization: Bearer TOKEN
```

---

# ⚙️ Configuração da API

Atualmente, o frontend utiliza a API local através do endereço:

```text
http://localhost:3000
```

Essa configuração está centralizada em:

```text
src/services/api.js
```

Exemplo:

```javascript
const API_URL = "http://localhost:3000";
```

Caso o endereço do backend seja alterado, ele deve ser atualizado nesse arquivo.

---

# 💻 Execução Local

## Pré-requisitos

Para executar o frontend localmente, é necessário possuir:

* Node.js 22 ou superior;
* npm;
* Backend do projeto em execução.

Para executar o projeto completo, também é necessário:

* Docker;
* Docker Compose.

---

## Instalação

Entre na pasta do frontend:

```bash
cd blog-professores-front
```

Instale as dependências:

```bash
npm install
```

---

# ▶️ Executando o Frontend

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite disponibilizará a aplicação normalmente em:

```text
http://localhost:5173
```

---

# 🏗️ Build de Produção

Para gerar a versão de produção:

```bash
npm run build
```

O processo gera os arquivos otimizados para distribuição.

Para visualizar o build:

```bash
npm run preview
```

---

# 🧹 Lint

O projeto utiliza ESLint para verificar problemas no código.

Execute:

```bash
npm run lint
```

O comando é utilizado também no processo de integração contínua.

---

# 🐳 Docker

O frontend possui um `Dockerfile` próprio.

Arquivo:

```text
Dockerfile
```

Conteúdo conceitual:

```text
Node.js
   │
   ▼
Instala dependências
   │
   ▼
Copia código da aplicação
   │
   ▼
Inicia Vite
   │
   ▼
Porta 5173
```

Para construir a imagem:

```bash
docker build -t blog-professores-front .
```

Para executar o container:

```bash
docker run --rm -p 5173:5173 blog-professores-front
```

---

# 🐳 Docker Compose

O projeto possui um `docker-compose.yml` na raiz do projeto, responsável por executar o ambiente completo.

Estrutura:

```text
blog-professores/
│
├── docker-compose.yml
│
├── blog-professores-front/
│
└── blog-professores-api/
```

O Compose integra:

```text
Frontend
   │
   │ :5173
   ▼
Backend
   │
   │ :3000
   ▼
MongoDB
   │
   │ :27017
   ▼
Banco de dados
```

Para iniciar todo o ambiente:

```bash
docker compose up --build
```

Para executar em segundo plano:

```bash
docker compose up --build -d
```

Para verificar os containers:

```bash
docker compose ps
```

Para encerrar o ambiente:

```bash
docker compose down
```

---

# 🧪 Testes

Os testes automatizados estão atualmente implementados no backend utilizando:

* Jest;
* Supertest;
* MongoDB.

Para executar os testes dentro do ambiente Docker:

```bash
docker compose exec api npm test
```

Atualmente são validados cenários relacionados aos posts:

```text
✓ Deve listar os posts
✓ Deve criar um novo post
✓ Não deve criar um post inválido
```

Resultado esperado:

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

# 🔄 CI/CD — GitHub Actions

O projeto possui integração contínua através do **GitHub Actions**.

Workflow:

```text
.github/
└── workflows/
    └── ci.yml
```

A cada `push` ou `pull request` para as branches configuradas, o GitHub executa automaticamente as verificações.

## Frontend

O pipeline executa:

```text
Checkout
   ↓
Node.js 22
   ↓
npm ci
   ↓
npm run lint
   ↓
npm run build
```

## Backend

O pipeline executa:

```text
Checkout
   ↓
Node.js 22
   ↓
MongoDB
   ↓
npm ci
   ↓
npm test
```

Dessa forma, alterações no código são verificadas automaticamente antes de serem consideradas válidas pelo processo de integração contínua.

---

# 📦 Scripts Disponíveis

Dentro da pasta `blog-professores-front`:

| Comando           | Descrição                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia o servidor de desenvolvimento |
| `npm run build`   | Gera o build de produção             |
| `npm run preview` | Visualiza o build de produção        |
| `npm run lint`    | Executa o ESLint                     |

---

# 🔌 API Backend

O frontend depende do backend do projeto.

Estrutura do backend:

```text
blog-professores-api/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validacoes/
│   ├── app.js
│   └── servidor.js
│
├── tests/
├── Dockerfile
├── package.json
└── package-lock.json
```

O backend é responsável por:

* API REST;
* CRUD de posts;
* autenticação;
* autorização;
* validação;
* persistência no MongoDB;
* tratamento de erros.

---

# 🗄️ Banco de Dados

O projeto utiliza **MongoDB** para armazenamento dos dados.

Quando executado através do Docker Compose, o banco utiliza:

```text
MongoDB
Host: mongodb
Porta: 27017
```

A API se conecta ao banco através da variável:

```text
MONGO_URI
```

No ambiente Docker, a comunicação ocorre através da rede interna criada pelo Docker Compose.

---

# 🔐 Variáveis de Ambiente

As configurações sensíveis do backend são mantidas através de variáveis de ambiente.

Entre elas:

```text
MONGO_URI
JWT_SECRET
```

Essas informações não devem ser armazenadas diretamente no código-fonte ou publicadas no repositório.

O arquivo `.env` utilizado localmente deve permanecer fora do controle de versão quando contiver informações sensíveis.

---

# 🔄 Fluxo da Aplicação

O fluxo principal da aplicação pode ser representado da seguinte forma:

```text
Usuário acessa o Frontend
          │
          ▼
      React/Vite
          │
          │ HTTP
          ▼
      API REST
          │
          ├──────────────┐
          │              │
          ▼              ▼
   Autenticação       Posts
          │              │
          │              │
          └──────┬───────┘
                 ▼
              MongoDB
```

---

# 🎯 Funcionalidades Implementadas

* [x] Interface desenvolvida em React
* [x] Navegação entre páginas
* [x] Listagem de posts
* [x] Visualização individual de posts
* [x] Busca de posts
* [x] Login
* [x] Autenticação JWT
* [x] Rotas privadas
* [x] Criação de posts
* [x] Edição de posts
* [x] Exclusão de posts
* [x] Integração com API REST
* [x] Persistência em MongoDB
* [x] Docker
* [x] Docker Compose
* [x] ESLint
* [x] Build de produção
* [x] Testes automatizados no backend
* [x] GitHub Actions
* [x] CI/CD

---

# 👨‍💻 Desenvolvimento

Projeto desenvolvido como parte da formação em desenvolvimento Full Stack.

A aplicação foi estruturada buscando separar responsabilidades entre:

```text
Interface
   ↓
Serviços de API
   ↓
Backend
   ↓
Banco de Dados
```

Essa separação permite maior organização, manutenção e evolução do sistema.

---

# 📌 Status do Projeto

**Status: Concluído para a Fase 03.**

Principais validações realizadas:

```text
Frontend
✓ Lint
✓ Build

Backend
✓ API
✓ CRUD
✓ Autenticação
✓ Testes automatizados

Infraestrutura
✓ Docker
✓ Docker Compose
✓ MongoDB

CI/CD
✓ GitHub Actions
✓ Frontend Lint
✓ Frontend Build
✓ Backend Tests
```

---
