# Blog dos Professores — Mobile (Fase 4)

App mobile feito em **React Native (Expo)** para o blog dos professores.
Ele consome a mesma API em Node.js que fizemos nas fases anteriores (pasta `blog-professores-api`).

Na fase 3 fizemos o front web em React. Nessa fase a ideia foi levar as mesmas funcionalidades para o celular e adicionar o cadastro de **professores** e **alunos**, com permissões diferentes para cada um.

---

## Tecnologias

- React Native com Expo
- React Navigation (native-stack) para a navegação entre telas
- Context API para guardar o usuário logado
- AsyncStorage para manter o login salvo quando fecha o app
- `fetch` para chamar a API REST
- Só componentes funcionais e hooks (`useState`, `useEffect`, `useContext`, `useFocusEffect`...)

---

## Como rodar

### 1. Subir a API

Na raiz do repositório:

```bash
docker compose up api mongodb
```

Ou sem docker, dentro de `blog-professores-api`:

```bash
npm install
npm run dev
```

> Se rodar sem docker, troque o `MONGO_URI` do `.env` da API para `mongodb://localhost:27017/blog_professores`.

### 2. Criar os usuários de teste

Dentro de `blog-professores-api`:

```bash
npm run seed
```

Isso cria:

| Tipo      | E-mail             | Senha  |
|-----------|--------------------|--------|
| Professor | professor@blog.com | 123456 |
| Aluno     | aluno@blog.com     | 123456 |

(Se estiver usando docker: `docker exec -it blog-professores-api npm run seed`)

### 3. Configurar o endereço da API no app

O celular/emulador não enxerga o `localhost` do computador, então precisa informar o endereço certo.
Copie o `.env.example` para `.env`:

```bash
cp .env.example .env
```

E ajuste a variável:

- **Emulador Android:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` (é o padrão)
- **Celular com Expo Go:** `EXPO_PUBLIC_API_URL=http://IP_DO_SEU_PC:3000` (o celular precisa estar na mesma rede wi-fi)

Para descobrir o IP no Windows: `ipconfig` (procurar "Endereço IPv4").

### 4. Rodar o app

```bash
cd blog-professores-mobile
npm install
npx expo start
```

Depois é só apertar `a` para abrir no emulador Android ou ler o QR Code com o app **Expo Go** no celular.

---

## Arquitetura

```
blog-professores-mobile/
├── App.js                  -> envolve o app com o AuthProvider e carrega as rotas
├── .env.example
└── src/
    ├── components/         -> componentes reutilizáveis
    │   ├── Botao.js
    │   ├── CampoTexto.js
    │   ├── CardPost.js
    │   └── MensagemErro.js
    ├── context/
    │   └── AuthContext.js  -> login, logout, token e tipo do usuário
    ├── routes/
    │   └── Rotas.js        -> navegação (stack) e controle de acesso
    ├── screens/            -> telas
    │   ├── Home.js         -> lista de posts + busca
    │   ├── Post.js         -> leitura do post
    │   ├── Login.js
    │   ├── Admin.js        -> área do professor (editar/excluir posts)
    │   ├── CriarPost.js
    │   ├── EditarPost.js
    │   ├── ListaUsuarios.js -> lista paginada de professores ou alunos
    │   └── FormUsuario.js   -> cadastro/edição de professor ou aluno
    ├── services/
    │   └── api.js          -> todas as chamadas para a API
    └── styles/
        └── cores.js        -> cores do app (as mesmas do front web)
```

### Fluxo

```
Tela  ->  services/api.js  ->  API (Express)  ->  MongoDB
  ^
  └── AuthContext (token e usuário logado)
```

- **`services/api.js`**: tem uma função `requisicao()` que monta o `fetch`, coloca o token no header `Authorization: Bearer ...` e trata os erros. As outras funções (`buscarPosts`, `criarUsuario`...) só chamam ela.
- **`AuthContext`**: guarda o token e o usuário. Quando o app abre ele lê o AsyncStorage para ver se já tinha alguém logado. Também expõe `ehProfessor`, que é usado nas telas.
- **`Rotas.js`**: as telas de administração (Admin, CriarPost, EditarPost, Professores, Alunos, FormUsuario) só são registradas no navigator quando o usuário logado é professor. Então aluno ou visitante não consegue nem navegar até elas.
- **Professores e alunos usam as mesmas telas** (`ListaUsuarios` e `FormUsuario`). O que muda é o parâmetro `tipo` que vem pela rota. Fizemos assim para não duplicar código, já que a única diferença é o endpoint (`/professores` ou `/alunos`).

### Permissões

| Ação                                  | Visitante | Aluno | Professor |
|---------------------------------------|:---------:|:-----:|:---------:|
| Ver lista de posts / ler post / buscar | ✅        | ✅    | ✅        |
| Criar, editar e excluir posts          | ❌        | ❌    | ✅        |
| Cadastrar/editar/excluir professores   | ❌        | ❌    | ✅        |
| Cadastrar/editar/excluir alunos        | ❌        | ❌    | ✅        |

A permissão é validada **nos dois lados**: o app esconde as telas, e a API também bloqueia com o middleware `somenteProfessor` (retorna 403), então mesmo que alguém chame a API direto não consegue.

---

## Mudanças na API para essa fase

A API da fase 3 não tinha diferença entre professor e aluno, então foi preciso adicionar:

- Campo `tipo` (`professor` ou `aluno`) no model `Usuario`. Usuários antigos sem o campo são tratados como professor.
- O `tipo` agora vai dentro do token JWT e na resposta do `/login`.
- Middleware `somenteProfessor` nas rotas de criar/editar/excluir post.
- CRUD de professores e alunos (todas exigem token de professor):

| Método | Rota                                | Descrição                         |
|--------|-------------------------------------|-----------------------------------|
| GET    | `/professores?pagina=1&limite=10`   | Lista paginada                    |
| GET    | `/professores/:id`                  | Busca um professor                |
| POST   | `/professores`                      | Cadastra (`nome`, `email`, `senha`) |
| PUT    | `/professores/:id`                  | Edita (senha opcional)            |
| DELETE | `/professores/:id`                  | Exclui                            |

As rotas de `/alunos` funcionam igual.

Resposta da listagem:

```json
{
  "dados": [ { "_id": "...", "nome": "...", "email": "...", "tipo": "aluno" } ],
  "pagina": 1,
  "limite": 10,
  "total": 23,
  "totalPaginas": 3
}
```

- Script `npm run seed` para criar os usuários de teste.
- Novos testes em `tests/usuarios.test.js` (aluno não pode criar post, aluno não pode listar professores, etc).

---

## Guia de uso

### Visitante / Aluno

1. Ao abrir o app aparece a lista de posts com título, autor e um resumo.
2. Use o campo **Buscar posts** para filtrar por palavra-chave (busca no título e no conteúdo).
3. Puxe a lista para baixo para atualizar.
4. Toque em um post para ler o conteúdo completo.
5. O botão **Entrar** no canto superior leva para o login. O aluno logado continua só podendo ler.

### Professor

1. Faça login com um e-mail de professor.
2. Na tela inicial aparece o botão **Área do professor**.
3. Na área do professor dá para:
   - **+ Novo post**: preencher título, autor e conteúdo e publicar.
   - **Editar** / **Excluir** em cada post (a exclusão pede confirmação).
   - **Professores** e **Alunos**: lista paginada com botões de editar e excluir, e o botão de cadastrar.
4. Na edição de professor/aluno a senha pode ficar em branco para manter a atual.
5. O professor logado não consegue excluir a si mesmo (para não perder o acesso).
6. Para sair, toque em **Sair** no canto superior da tela inicial.

---

## Desafios que tivemos

- **localhost no celular:** no começo o app não conectava na API porque `localhost` no emulador é o próprio emulador. Resolvemos usando `10.0.2.2` no emulador Android e o IP da máquina no celular, por variável de ambiente (`EXPO_PUBLIC_API_URL`).
- **localStorage não existe no React Native:** no web guardávamos o token no `localStorage`. No mobile trocamos pelo AsyncStorage, que é assíncrono, então foi preciso um estado `carregando` para não mostrar a tela antes de saber se o usuário já estava logado.
- **Atualizar as listas ao voltar de uma tela:** depois de criar ou editar um post, a lista não atualizava porque o `useEffect` só roda quando a tela monta. Usamos o `useFocusEffect` do React Navigation, que roda sempre que a tela volta a ficar em foco.
- **Permissões:** a API não diferenciava professor de aluno. Tivemos que mexer no model, no token e criar um middleware novo, tomando cuidado para não quebrar os testes da fase anterior.
- **Busca:** para não chamar a API a cada letra digitada, colocamos um pequeno atraso (timer) antes de buscar.
