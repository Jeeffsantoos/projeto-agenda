const mongoose = require('mongoose');
const validator = require('validator')

// Define o esquema (schema) do contato com os campos e tipos de dados esperados
const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    idUser: { type: String, required: false },
    criadoEm: { type: Date, default: Date.now }
}, { collection: 'contatos' });

// Cria um modelo (model) do Contato usando o esquema definido acima
const ContatoModel = mongoose.model('Contato', ContatoSchema)

// Define a classe Contato que será usada para criar novos contatos, editar contatos existentes, buscar contatos e excluir contatos
class Contato {
    constructor(body, idUser) {
        this.body = body; // O corpo da requisição HTTP feita pelo usuário
        this.errors = []; // Lista de erros encontrados na validação do corpo da requisição
        this.contato = null; // O contato que será criado, editado ou buscado
        this.user = idUser;
    }

    // Método para registrar um novo contato no banco de dados
    async register() {
        this.valida(); // Verifica se os campos do corpo da requisição são válidos

        if (this.errors.length > 0) return // Se houver erros, retorna a lista de erros encontrados

        // Cria o contato no banco de dados usando o modelo definido acima e o corpo da requisição HTTP
        this.contato = await ContatoModel.create(this.body)
    }

    // Método para editar um contato existente no banco de dados usando seu ID
    async edit(id) {
        if (typeof id !== 'string') return // Verifica se o ID é uma string
        this.valida(); // Verifica se os campos do corpo da requisição são válidos

        if (this.errors.length > 0) return // Se houver erros, retorna a lista de erros encontrados

        // Atualiza o contato no banco de dados usando o modelo definido acima, o ID do contato e o corpo da requisição HTTP
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
            new: true // Retorna o contato atualizado
        })
    }

    // Método estático para buscar um contato existente no banco de dados usando seu ID
    static async buscaPorId(id) {
        if (typeof id !== 'string') return // Verifica se o ID é uma string
        const contato = await ContatoModel.findById(id) // Busca o contato no banco de dados pelo ID
        return contato // Retorna o contato encontrado
    }

    // Método estático para buscar todos os contatos no banco de dados em ordem decrescente de data de criação
    static async buscaContatos(userEmail) {
        const contatos = await ContatoModel.find({ idUser: userEmail })
            .sort({ criadoEm: -1 }) // Ordena os contatos por data de criação decrescente
        return contatos // Retorna a lista de contatos encontrados
    }

    // Método estático para excluir um contato existente no banco de dados usando seu ID
    static async delete(id) {
        if (typeof id !== 'string') return // Verifica se o ID é uma string
        const contato = await ContatoModel.findOneAndDelete({ _id: id })
        return contato
    }


    // Método para validar o corpo da requisição
    valida() {
        this.cleanUp();
        if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        if (!this.body.nome) this.errors.push('Nome é um campo obrigatório');
        if (!this.body.email && !this.body.telefone) {
            this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
        }
    }

    // Método para limpar o corpo da requisição
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
            idUser: this.user
        };
    }
}

// Exportação da classe Contato
module.exports = Contato;