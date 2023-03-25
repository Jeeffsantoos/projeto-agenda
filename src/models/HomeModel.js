const mongoose = require('mongoose');

// Define o esquema de dados para a coleção "Home"
const HomeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: String
});

// Cria um modelo do Mongoose para a coleção "Home"
const HomeModel = mongoose.model('Home', HomeSchema)

// Define uma classe vazia "Home"
class Home {
}

// Exporta a classe "Home"
module.exports = Home;