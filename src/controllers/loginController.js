// Importa o modelo Login
const Login = require('../models/LoginModel')

// Função que renderiza a página de login, verificando se o usuário já está logado
exports.index = (req, res) => {
    if (req.session.user) return res.render('login-logado')
    return res.render('login')
};

// Função que registra um novo usuário
exports.register = async (req, res) => {
    try {
        // Cria um novo objeto Login com as informações do corpo da requisição
        const login = new Login(req.body)
        await login.register();

        // Verifica se há erros no registro, e redireciona com mensagem de erro, caso haja
        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login/index')
            })
            return
        }

        // Redireciona com mensagem de sucesso, caso não haja erros
        req.flash('success', 'Seu usuário foi criado com sucesso.')
        req.session.save(function () {
            return res.redirect('/login/index')
        })

    } catch (e) {
        console.log(e)
        res.render('404')
        return
    }

}

// Função que realiza o login do usuário
exports.login = async (req, res) => {
    try {
        // Cria um novo objeto Login com as informações do corpo da requisição
        const login = new Login(req.body)
        await login.login();

        // Verifica se há erros no login, e redireciona com mensagem de erro, caso haja
        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login/index')
            })
            return
        }

        // Define a sessão do usuário e redireciona com mensagem de sucesso, caso não haja erros
        req.flash('success', 'Usuário logado')
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('/login/index')
        })

    } catch (e) {
        console.log(e)
        res.render('404')
        return
    }

}

// Função que realiza o logout do usuário
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login/index')
}