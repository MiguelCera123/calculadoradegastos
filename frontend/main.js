import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Login from './Modules/Login';
import Produto from './Modules/Produto';

const login = new Login('.form-login');
const cadastro = new Login('.form-cadastro');
const produto = new Produto('.form-produto');

login.init();
cadastro.init();
produto.init();