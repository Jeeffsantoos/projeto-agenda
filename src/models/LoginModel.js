const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')

// Cria o esquema do banco de dados para o modelo de Login
const LoginSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, { collection: 'users' });


// Cria o modelo de Login a partir do esquema criado acima
const LoginModel = mongoose.model('Login', LoginSchema)

// Cria a classe Login, que será utilizada para cadastrar e autenticar usuários
class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    // Método utilizado para cadastrar um usuário
    async register() {
        // Valida o formulário antes de cadastrar o usuário
        this.validaCadastro();
        if (this.errors.length > 0) return;

        // Verifica se já existe um usuário com o mesmo e-mail
        await this.userExists();

        // Gera um hash para a senha do usuário antes de cadastrá-lo
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        // Cadastra o usuário no banco de dados
        this.user = await LoginModel.create(this.body)
    }

    // Método utilizado para autenticar um usuário
    async login() {
        // Valida o formulário antes de autenticar o usuário
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email })

        // Verifica se o usuário existe no banco de dados
        if (!this.user) {
            this.errors.push('Usuário inválido')
            return
        }

        // Verifica se a senha do usuário é válida
        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida')
            this.user = null;
            return
        }
    }

    validaCadastro() {
        // chama método que percorre cada chave e valida se todos os valores são strings
        this.cleanUp();
        // E-mail precisa ser preenchido e válido
        if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
        // Nome precisa ser preenchido
        if (!this.body.nome) this.errors.push('Nome precisa ser preenchido');
        // Sobrenome precisa ser preenchido
        if (!this.body.sobrenome) this.errors.push('Sobrenome precisa ser preenchido');
        // senha precisa ter entre 6 e 20 caracteres
        if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        // repetir senha precisa ter entre 6 e 20 caracteres

    }
    valida() {
        // chama método que percorre cada chave e valida se todos os valores são strings
        this.cleanUp();
        // E-mail precisa ser preenchido e válido
        if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
    }

    // Método utilizado para verificar se um usuário já existe no banco de dados
    async userExists() {

        this.user = await LoginModel.findOne({ email: this.body.email })
        if (this.user) this.errors.push('Usuario já existe.')
    }

    // Método utilizado para limpar os campos do formulário antes de validá-los
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
            nome: this.body.nome,
            sobrenome: this.body.sobrenome
        }
    }
}

// Exporta a classe Login para ser utilizada em outras partes da aplicação
module.exports = Login;
