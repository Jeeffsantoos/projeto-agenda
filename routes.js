const express = require('express');
const route = express.Router();

// Importando os controllers
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

// Importando o middleware de autenticação
const { loginRequired } = require('./src/middlewares/midlleware')

// Rotas da home
route.get('/', homeController.index);

// Rotas de login
route.get('/login/index', loginController.index); // Renderiza a página de login
route.post('/login/register', loginController.register); // Registra um novo usuário
route.post('/login/login', loginController.login); // Realiza o login
route.get('/login/logout', loginController.logout); // Realiza o logout

// Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index); // Renderiza a página de contatos
route.post('/contato/register', loginRequired, contatoController.register); // Registra um novo contato
route.get('/contato/index/:id', loginRequired, contatoController.editIndex); // Renderiza a página de edição de um contato
route.get('/contato/delete/:id', loginRequired, contatoController.delete); // Deleta um contato
route.post('/contato/edit/:id', loginRequired, contatoController.edit); // Edita um contato existente

// Exportando as rotas
module.exports = route;