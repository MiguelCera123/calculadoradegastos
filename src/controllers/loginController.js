//Importando o Model para utilizaçao dos metodos criados
const Login = require("../models/LoginModel");

//Todo local que tiver um exports eu estarei exportando o metodo para utilizar nas rotas
exports.index = (req, res) => {
  //Verifica se uma sessão foi criada para poder redicerionar e avisar o usuario que deu certo, a sessao é criada no metodo de login
  if(req.session.user) return res.render("login-logado");
  res.render("login");
};
//Metodo de Registro
exports.register = async (req, res) => {
  try {
    //Capturo o conteudo do formulario
    const login = new Login(req.body);
    //Tento realizar o login Atraves do model
    await login.register();
    //Se houver algum erro ele passa os erros para a sessão para ser exibido para o usuario
    if(login.errors.length > 0) {
      //Passando erros para sessao
        req.flash('errors', login.errors);
        //salvando a sessão e voltando para a tela de login
        req.session.save(function(){
            return res.redirect('/login/index')
        })
        //retorna para que ele nao continue e execute algo por engano
        return;
    }
    //Se nao houver erros ele mostra ao usuario que houve sucesso e redireciona para a tela de login novamente
    req.flash('success', 'Usuario criado com Sucesso')
    //salva a sessao e redireciona
    req.session.save(() =>{
        return res.redirect('/login/index');
    });
  } 
  //Captura os erros para mim e redireciona para a pagina de ERRO
  catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();
    if(login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(function(){
            return res.redirect('/login/index')
        })
        return;
    }
    req.flash('success', 'Login efetuado com Sucesso');
    req.session.user = login.user;
    req.session.save(() =>{
        return res.redirect('/login/index');
    });

  } catch (e) {
    console.log(e);
  }
}

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/')
}