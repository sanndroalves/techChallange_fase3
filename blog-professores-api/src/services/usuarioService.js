const bcrypt = require("bcrypt");

const Usuario = require("../models/Usuario");

// nao devolve a senha nas consultas
const CAMPOS = "nome email tipo createdAt updatedAt";

async function listarUsuarios(tipo, pagina, limite) {

    const pular = (pagina - 1) * limite;

    const usuarios = await Usuario.find({ tipo })
        .select(CAMPOS)
        .sort({ nome: 1 })
        .skip(pular)
        .limit(limite);

    const total = await Usuario.countDocuments({ tipo });

    return {
        dados: usuarios,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite) || 1
    };

}

async function buscarUsuarioPorId(tipo, id) {
    return Usuario.findOne({ _id: id, tipo }).select(CAMPOS);
}

async function buscarPorEmail(email) {
    return Usuario.findOne({ email: email.trim().toLowerCase() });
}

async function criarUsuario(tipo, dados) {

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

    const usuario = await Usuario.create({
        nome: dados.nome,
        email: dados.email,
        senha: senhaCriptografada,
        tipo
    });

    return buscarUsuarioPorId(tipo, usuario._id);

}

async function atualizarUsuario(tipo, id, dados) {

    const novosDados = {
        nome: dados.nome,
        email: dados.email
    };

    // so troca a senha se o campo foi preenchido
    if (dados.senha) {
        novosDados.senha = await bcrypt.hash(dados.senha, 10);
    }

    return Usuario.findOneAndUpdate(
        { _id: id, tipo },
        novosDados,
        {
            returnDocument: "after",
            runValidators: true
        }
    ).select(CAMPOS);

}

async function excluirUsuario(tipo, id) {
    return Usuario.findOneAndDelete({ _id: id, tipo });
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarPorEmail,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario
};
