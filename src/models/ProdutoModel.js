//Importando o mongoose para poder fazer o schema e gerenciar o banco de dados
const mongoose = require("mongoose");
//Validação de Email que preciso verificar se é necessaria
const validator = require("validator");
//Schema da tabela do banco
const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },

  preco: { type: Number, required: true, min: 0},

  quantidade: { type: Number, required: true, min: 1},

  criadoEm: { type: Date, default: Date.now },
});
//Instanciamento do schema, e nome da tabela como Produto
const ProdutoModel = mongoose.model("Produto", ProdutoSchema);
//Inicialização da função e variaveis
function Produto(body) {
  this.body = body;
  this.errors = [];
  this.produto = null;
}
//Prototype responsavel por salvar no banco
Produto.prototype.register = async function () {
    //metodo que verifica os valores
  this.valida();
  //se houver erros ele retorna e nao salva no banco, uma verificação a mais caso aconteça algum erro posterior ao valida
  if (this.errors.length > 0) return;
  //salvando no banco
  this.produto = await ProdutoModel.create(this.body);
};
//prototype de validação de valores
Produto.prototype.valida = function () {
  this.cleanUp();

  if (!this.body.nome) this.errors.push("Nome é um campo Obrigatorio");
  if (!this.body.preco) this.errors.push("Preço é um campo Obrigatorio",);
  if (!this.body.quantidade)this.errors.push("Quantidade é um campo Obrigatorio");
  if (this.body.preco < 0) this.errors.push("Preço negativo não é permitido",);
  if (this.body.quantidade < 0) this.errors.push("Quantidade negativa não é permitida",);
};
//prototype de limpeza caso seja enviado um valor diferente de string nos campos 
Produto.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  //montando o shcema do body caso aja mais campos no body, e tambem definindo as chaves
  this.body = {
    nome: this.body.nome,
    preco: this.body.preco,
    quantidade: this.body.quantidade,
  };
};
//prototype de edição
Produto.prototype.edit = async function (id) {
    //verificando se a string tem valor invalido
  if (typeof id !== "string") return;
  //fazendo o mesmo processo de verificação dos valores antes de salvar no banco
  this.valida();
  //se tem erros nao salva no banco a alteração
  if (this.errors.length > 0) return;
  //Procura pelo id e atualiza no banco
  this.produto = await ProdutoModel.findByIdAndUpdate(id, this.body, {
    //serve para retornar os novos dados
    new: true,
  });
};
//prototype que procura pelo id que sera usado para quando tentarmos alterar os dados 
Produto.buscaPorId = async function (id) {
  if (typeof id !== "string") return;
  const produto = await ProdutoModel.findById(id);
  return produto;
};
//prototype para ler os dados salvos, servira para exibir na tela
Produto.buscaProdutos = async function () {
  const produtos = await ProdutoModel.find().sort({ criadoEm: -1 });
  return produtos;
};
//metodo de deletar no banco
Produto.delete = async function (id) {
  if (typeof id !== "string") return;
  const produto = await ProdutoModel.findByIdAndDelete(id);
  return produto;
};
//exportando para utilizar esses metodos
module.exports = Produto;
