# Calculadora de Gastos

Aplicação web fullstack para gerenciamento de produtos e controle de gastos, com autenticação de usuários.

## Tecnologias

- **Backend:** Node.js, Express.js
- **Banco de dados:** MongoDB (Mongoose)
- **Template engine:** EJS
- **Frontend:** Webpack + Babel
- **Autenticação:** express-session + connect-mongo + bcryptjs
- **Segurança:** Helmet, csurf (proteção CSRF), connect-flash

## Funcionalidades

- Cadastro e login de usuários com senha criptografada
- CRUD completo de produtos (nome, preço, quantidade)
- Proteção de rotas autenticadas via middleware `loginRequired`
- Mensagens de feedback com flash messages
- Proteção contra ataques CSRF em todos os formulários
- Sessões persistidas no MongoDB

## Estrutura do Projeto

```
.
├── server.js               # Entrada da aplicação
├── router.js               # Definição de rotas
├── webpack.config.js       # Configuração do Webpack
├── frontend/
│   ├── main.js             # Ponto de entrada do frontend
│   └── Modules/            # Módulos JS do cliente (Login, Produto)
├── public/
│   └── assets/js/          # Bundle gerado pelo Webpack
└── src/
    ├── controllers/        # Lógica das rotas (home, login, produto)
    ├── middlewares/        # Middlewares globais e de autenticação
    ├── models/             # Schemas Mongoose (Login, Produto)
    └── views/              # Templates EJS (index, login, 404, partials)
```

## Rotas

| Método | Rota                  | Descrição                            | Autenticação |
| ------ | --------------------- | ------------------------------------ | :----------: |
| GET    | `/`                   | Página inicial com lista de produtos |      -       |
| GET    | `/login/index`        | Página de login/cadastro             |      -       |
| POST   | `/login/register`     | Cadastrar novo usuário               |      -       |
| POST   | `/login/login`        | Autenticar usuário                   |      -       |
| GET    | `/login/logout`       | Encerrar sessão                      |      -       |
| POST   | `/produto/register`   | Cadastrar produto                    |     Sim      |
| GET    | `/produto/index/:id`  | Página de edição de produto          |     Sim      |
| POST   | `/produto/edit/:id`   | Atualizar produto                    |     Sim      |
| GET    | `/produto/delete/:id` | Deletar produto                      |     Sim      |

## Como Rodar Localmente

### Pré-requisitos

- Node.js >= 14
- MongoDB (local ou Atlas)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/MiguelCera123/calculadoradegastos.git
cd calculadoradegastos

# Instale as dependências
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
CONNECTIONSTRING=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/calculadoradegastos
```

### Scripts

```bash
# Inicia o servidor com nodemon (hot reload)
npm start

# Compila o frontend com webpack em modo watch
npm run dev
```

> Execute `npm start` e `npm run dev` em terminais separados para rodar o projeto completo.

O servidor estará disponível em `http://localhost:3000`.

## Segurança

- Senhas armazenadas com hash via **bcryptjs**
- Token CSRF em todos os formulários via **csurf**
- Headers de segurança via **Helmet**
- Sessões salvas no MongoDB com **connect-mongo**
- Validação de campos no servidor antes de qualquer operação no banco
