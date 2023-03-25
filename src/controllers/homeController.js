// Importa o modelo de Contato
const Contato = require('../models/ContatoModel');

// Exporta uma função assíncrona que renderiza a página inicial, buscando todos os contatos
exports.index = async (req, res) => {
    // Busca todos os contatos com o método estático buscaContatos() do modelo Contato
    if (req.session.user) {
        const contatos = await Contato.buscaContatos(req.session.user.email);
        res.render('index', { contatos });
        return;

    }
    // Renderiza a página inicial passando os contatos encontrados como parâmetro
    res.render('login')
};
