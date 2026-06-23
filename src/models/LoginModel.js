const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    senha: {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return;
        //comando utilizado para buscar no banco no campo de email um valor que seja igual ao digitado no campo de email
        this.user = await LoginModel.findOne({email: this.body.email});
        //Se a query retornou um valor null(não achou nada), Retorna usuario não existente
        if(!this.user){
            this.errors.push('Usuario Não Existe');
            return;
        }
        //O CompareSync ja faz o hash da senha digitada no campo para comparar com a do banco, e se elas forem diferentes a negação (!) retorna true para entrar na condição
        if(!bcryptjs.compareSync(this.body.senha, this.user.senha)){
            this.errors.push('Senha Invalida');
            //Volto o user para sem "valor" pois se a pessoa quiser tentar de novo o login eu posso verificar novamente no banco
            this.user = null;
            return;
        }
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return;
        await this.isUser();
        if(this.errors.length > 0) return;
        
        //Gerando a variavel que sera responsavel por fazer o hash da senha
        const salt = bcryptjs.genSaltSync();
        //Após verificar se todos os campos estao certos eu altero a senha antiga para a nova com o comando de gerar o hash da senha para salvar no banco
         this.body.senha = bcryptjs.hashSync(this.body.senha, salt)
         
         this.user = await LoginModel.create(this.body);
    }

    async isUser(){
        //Verificando se o usuario existe no banco, se retornar qualquer valor diferente de nulo é adicionado um erro no array
        this.user = await LoginModel.findOne({email: this.body.email});
        if(this.user) this.errors.push('Usuario Já Existe!')
    }

    valida(){
        this.cleanUp();
        if(!validator.isEmail(this.body.email)) this.errors.push('Email Invalido');
        if(this.body.senha.length < 3 || this.body.senha.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 Caracteres');
    }

    //Metodo que verifica os tipos da chave para que no login ou no registro nao aconteça o input de outro valor fora o de string
    cleanUp(){
        //Verificação das Chaves
        for (const key in this.body) {
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }
        //Limitando o body a somente esses dois campos
        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }
}

module.exports = Login;