// script pra criar usuarios de teste no banco
// rodar com: npm run seed
require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const conectarBanco = require("./config/banco");
const Usuario = require("./models/Usuario");

const usuarios = [
    {
        nome: "Professor Admin",
        email: "professor@blog.com",
        senha: "123456",
        tipo: "professor"
    },
    {
        nome: "Aluno Teste",
        email: "aluno@blog.com",
        senha: "123456",
        tipo: "aluno"
    }
];

async function rodarSeed() {

    await conectarBanco();

    for (const usuario of usuarios) {

        const existe = await Usuario.findOne({ email: usuario.email });

        if (existe) {
            console.log(`${usuario.email} já existe, pulando...`);
            continue;
        }

        await Usuario.create({
            ...usuario,
            senha: await bcrypt.hash(usuario.senha, 10)
        });

        console.log(`${usuario.email} criado (senha: ${usuario.senha})`);

    }

    await mongoose.connection.close();

}

rodarSeed();
