//Biblioteca responsavel pelas nossas variaveis de ambiente ".env"
require("dotenv").config();
//Inicialização do express, primeiro requerindo ele e depois inicializando ele
const express = require("express");
const app = express();

const mongoose = require("mongoose");
//envia uma promessa para que assim que a conexao estiver feita ele EMITA um sinal de pronto
mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    //sinal de pronto
    app.emit("pronto");
  })
  //logando casa aconteça um erro
  .catch((e) => console.log(e));
//Inicializando a opção de poder adicionar cookies, para identificar usuarios através do seu navegador
const session = require("express-session");
//Inicializando Biblioteca responsavel por salvar os dados no banco de dados e nao na memoria
const MongoStore = require("connect-mongo").default;
//Inicializando biblioteca responsavel por enviar mensagens flash, que assim que são lidas elas ja somem
const flash = require("connect-flash");
//Importando o objeto que contem todas as nossas rotas
const routes = require("./router");
//Importando a biblioteca que vai nos ajudar a usar caminhos absolutos, evitando erros possiveis de se acontecer
const path = require("path");
//Padrão do Express para segurança
const helmet = require('helmet');
//Importando biblioteca responsavel por gerar codigos de segurança para formularios, que evitam que aconteça uma injeção de conteudo indesejado em form
const csrf= require('csurf')
//Importando via desestruturação os nossos Middlewares
//Middlewares = funções que são executadas na rota
const { middlewareGlobal, checkCsrfErrors, csrfMiddleware } = require("./src/middlewares/middleware");

//         Criar  Ler  Atualizar Deletar
// CRUD -> CREATE READ UPDATE    DELETE
//         POST   GET  PUT       DELETE
//
// http://meusite.com/ <- GET -> Entregue a pagina
//Inicializando o Helmet
app.use(helmet());
//Permitindo a inserção de Json no corpo da requisição
app.use(express.json());
//Permitindo a inserção de valores de pesquisa, tokens etc...
app.use(express.urlencoded({ extended: true }));
//Definindo a pasta public como statica para o projeto
app.use(express.static(path.resolve(__dirname, "public")));
//Definindo as propriedades da sessão, tempo do cookie, como vai ser salvo no banco de dados os valores, criando conexão
const sessionOptions = session({
  //serve como uma assinatura, um carimbo para identificar o cookie
  secret: "abcdefghijklmnopqrstuvwxyz()",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 24 * 7,
    httpOnly: true,
  },
});
//Usando as opçoes de seção que criamos anteriormente
app.use(sessionOptions);
//Executando a biblioteca de mensagens flash
app.use(flash());
//Definindo o local aonde vai estar as nossas views, e tambem a engine que ele vai funcionar, nesse caso ejs
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
//Executando o csrf
app.use(csrf());
//Nossos proprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfErrors);
app.use(csrfMiddleware);
app.use(routes);
//O Express esta escutando a conexão do banco, para que assim que ela aconteça, nós possamos ouvir requisições
app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Executando");
  });
});
