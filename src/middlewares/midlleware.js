// Define um middleware global que adiciona as variáveis locals 'errors', 'success' e 'user' ao objeto de resposta.
exports.meuMiddlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user;
    res.locals.contato = req.session.contato
    next()
};

// Define um middleware para checar erros CSRF. Se houver um erro, renderiza a página 404.
exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        res.render('404')
    }
    next();
}

// Define um middleware que adiciona a variável local '_csrf' ao objeto de resposta.
exports.csrfMiddleware = (req, res, next) => {
    res.locals._csrf = req.csrfToken()
    next()
}

// Define um middleware que verifica se o usuário está logado. Se não estiver, redireciona para a página inicial e exibe uma mensagem de erro.
exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('errors', 'Você precisa estar logado para editar os contatos!');
        req.session.save(() => res.redirect('/'))
        return
    }
    next()
}
