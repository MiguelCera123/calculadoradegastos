import validator from "validator";

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }
  removeErrors() {
    this.form
      .querySelectorAll(".invalid-feedback")
      .forEach((el) => el.remove());
    this.form
      .querySelectorAll(".is-invalid")
      .forEach((el) => el.classList.remove("is-invalid"));
  }

  criaErro(input, msg) {
    console.log("CRIANDO ERRO");
    input.classList.add("is-invalid");
    const div = document.createElement("div");
    div.classList.add("invalid-feedback");
    div.innerText = msg;
    input.after(div);
  }

  validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const senhaInput = el.querySelector('input[name="senha"]');
    this.removeErrors();

    let error = false;

    if (!validator.isEmail(emailInput.value)) {
      this.criaErro(emailInput, "Email inválido");
      error = true;
    }
    if (senhaInput.value.length < 3 || senhaInput.value.length > 50) {
      this.criaErro(senhaInput, "A senha deve ter entre 3 e 50 caracteres");
      error = true;
    }
    if (!error) el.submit();
  }
}
