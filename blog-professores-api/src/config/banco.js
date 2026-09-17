const mongoose = require("mongoose");

async function conectarBanco() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Banco conectado com sucesso.");

    } catch (erro) {

        console.log("Erro ao conectar no banco.");
        console.log(erro.message);

        process.exit(1);

    }

}

module.exports = conectarBanco;