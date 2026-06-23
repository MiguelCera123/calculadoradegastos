const produto = require("../models/ProdutoModel");

exports.index = async (req, res) => {
  const produtos = await produto.buscaProdutos();
  res.render("index", { produtos, produto: {} });
};
