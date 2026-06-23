export default class Produto {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    //verifica se o forma nao existe
    if (!this.form) return;
    //escuta o evento de submit, e previni por padrao o envio
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      //executa o metodo de verificação
      this.validate(e);
    });
  }
  //metodo que percorre todos os elementos do form e remove as classes de erros
  removeErrors() {
    this.form
      .querySelectorAll(".invalid-feedback")
      .forEach((el) => el.remove());
    this.form
      .querySelectorAll(".is-invalid")
      .forEach((el) => el.classList.remove("is-invalid"));
  }
//metodo que cria erro caso aja
  criaErro(input, msg) {
    console.log("CRIANDO ERRO");
    input.classList.add("is-invalid");
    const div = document.createElement("div");
    div.classList.add("invalid-feedback");
    div.innerText = msg;
    input.after(div);
  }
  //metodo que faz a validação dos campos necessarios
  validate(e) {
    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    const quantidadeInput = el.querySelector('input[name="quantidade"]');
    const precoInput = el.querySelector('input[name="preco"]');
    this.removeErrors();

    let error = false;

    if (!nomeInput.value) {
      this.criaErro(nomeInput, "É necessario preencher o campo de nome");
      error = true;
    }
    if (!quantidadeInput.value) {
      this.criaErro(quantidadeInput, "É necessario preencher o campo de Quantidade");
      error = true;
    }
    if (!precoInput.value) {
      this.criaErro(precoInput, "É necessario preencher o campo de preco");
      error = true;
    }

    if (!error) el.submit();
  }
}
