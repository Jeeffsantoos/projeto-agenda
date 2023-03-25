// Importa as dependências necessárias
require('dotenv').config() // Importa o pacote dotenv para lidar com as variáveis de ambiente
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Importa o pacote connect-mongo para armazenar as sessões no banco de dados MongoDB
const flash = require('connect-flash'); // Importa o pacote connect-flash para enviar mensagens de erro e sucesso para o usuário
const routes = require('./routes') // Importa o arquivo de rotas do aplicativo
const path = require('path')
const helmet = require('helmet') // Importa o pacote helmet para proteger o aplicativo de várias vulnerabilidades da web
const csrf = require('csurf') // Importa o pacote csurf para proteger contra ataques CSRF
const { meuMiddlewareGlobal, checkCsrfError, csrfMiddleware, gateKeeper } = require('./src/middlewares/midlleware') // Importa os middlewares personalizados do aplicativo

// Configura as opções da sessão
const sessionOptions = session({
    secret: 'secret', // Chave secreta para assinar o ID da sessão
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTIONSTRING // URL de conexão com o MongoDB
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Tempo de vida do cookie da sessão em milissegundos (1 semana)
        httpOnly: true // Apenas permite acesso ao cookie via HTTP
    }
})

// Conecta ao banco de dados MongoDB
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.emit('pronto') // Emite o evento 'pronto' para iniciar o servidor
    })
    .catch(e => console.log(e))

// Configura as middlewares do aplicativo
app.use(sessionOptions) // Usa as opções de sessão configuradas anteriormente
app.use(helmet()) // Usa as configurações de segurança do pacote helmet
app.use(express.urlencoded({ extended: true })); // Habilita o uso do body-parser para analisar os dados do corpo da solicitação HTTP
app.use(csrf()) // Usa o pacote csurf para proteção CSRF
app.use(flash()); // Usa o pacote connect-flash para enviar mensagens de erro e sucesso para o usuário
app.use(meuMiddlewareGlobal) // Usa o middleware personalizado "meuMiddlewareGlobal"
app.use(checkCsrfError) // Usa o middleware personalizado "checkCsrfError"
app.use(csrfMiddleware) // Usa o middleware personalizado "csrfMiddleware"
app.use(express.static(path.resolve(__dirname, 'public'))) // Configura o diretório de arquivos estáticos

// Configura o mecanismo de visualização e as rotas do aplicativo
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(routes);

// Inicia o servidor na porta 8080 quando o evento "pronto" é emitido
app.on('pronto', () => {
    app.listen(8080, () => {
        console.log('Servidor iniciado.')
    })
})
