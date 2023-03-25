// Importa o módulo async do regenerator-runtime para ser utilizado com funções assíncronas
const { async } = require('regenerator-runtime');

// Importa o modelo Contato do arquivo ContatoModel.js
const Contato = require('../models/ContatoModel')

// Função que renderiza a página de contato com o objeto de contato vazio
exports.index = (req, res) => {
    if (req.session.user) return res.render('contato', { contato: {} });
    return res.render('login');

}

// Função assíncrona para registrar um novo contato
exports.register = async (req, res) => {
    try {
        // Cria um novo objeto de Contato com os dados recebidos no body da requisição
        const contato = new Contato(req.body, req.session.user.email);
        // Chama o método de registro do contato, que é uma função assíncrona
        await contato.register()
        let idUser = null;
        // Verifica se houve erros no registro e redireciona para a página de registro com os erros em caso positivo
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato/index', { body: req.body, errors: contato.errors }));
            return
        }

        // Se não houve erros, adiciona uma mensagem de sucesso no flash e redireciona para a página inicial
        req.flash('success', 'Contato registrado com sucesso');
        idUser = contato.contato._id;
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return idUser;

    } catch (e) {
        // Em caso de exceção, redireciona para a página de erro 404
        return res.render('404')
    }
}

// Função assíncrona que renderiza a página de edição de um contato existente
exports.editIndex = async function (req, res) {
    try {
        //se usuário estiver logado
        if (req.session.user) {
            //se não existir o id do contato renderiza a página 404
            if (!req.params.id) res.render('../views/includes/404');
            // // localiza os dados do contato pelo id
            const contato = await Contato.buscaPorId(req.params.id);
            // se naõ existir o id do contato renderiza a página 404
            if (!contato) res.render('../views/includes/404');
            idUser = contato._id;
            req.session.contato = {
                _id: idUser || '',
                nome: contato.nome,
                sobrenome: contato.sobrenome,
                telefone: contato.telefone,
                email: contato.email,
                idUser: contato.idUser
            }

            return res.render('contato', { contato })

        }
        return res.render('login');
    } catch (e) {
        console.log(e);
        return res.render('../views/includes/404');
    }
}

// Função assíncrona para editar um contato existente
exports.edit = async (req, res) => {
    try {
        if (req.session.user) {
            //se não existir o id do contato renderiza a página 404
            if (!req.params.id) res.render('../views/includes/404');
            //cria a instância com o body coletado no post
            const contato = new Contato(req.body, req.session.user.email);
            // chama o método 'edit' do model que atualizará os dados
            await contato.edit(req.params.id);
            idUser = req.params.id

            //exibindo as mensagens de erro no formulário(view) caso exista
            if (contato.errors.length > 0) {
                //salva o array de mensagens no flash messages com a tag 'errors'
                req.flash('errors', contato.errors);
                //volta a página de cadastro e exibe os erros, salvando a sessão
                req.session.contato = {
                    _id: idUser,
                    nome: contato.nome,
                    sobrenome: contato.sobrenome,
                    telefone: contato.telefone,
                    email: contato.email,
                    idUser: contato.idUser
                }

                req.session.save(() => res.render('../views/contato', { body: req.session.contato, errors: contato.errors }));
                req.session.contato._id = idUser;
                return;
            }
            req.flash('success', 'Contato editado com sucesso');
            //volta a página de cadastro, salvando a sessão
            idUser = contato.contato._id;
            req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
            return;
        }
        return res.render('login');
    } catch (e) {
        console.log(e);
        return res.render('../views/includes/404');
    }
}
exports.delete = async function (req, res) {
    try {
        //se usuário estiver logado
        if (req.session.user) {
            //se não existir o id do contato renderiza a página 404
            if (!req.params.id) res.render('../views/includes/404');
            // exlcua contato pelo id
            const contato = await Contato.delete(req.params.id);
            // se naõ existir o id do contato renderiza a página 404
            if (!contato) res.render('../views/includes/404');
            req.flash('success', 'Contato exluído com sucesso');
            //volta a página index, salvando a sessão
            req.session.save(() => res.redirect(`back`));
            return;
        }
        return res.render('login');
    } catch (e) {
        console.log(e);
        return res.render('../views/includes/404');
    }

}