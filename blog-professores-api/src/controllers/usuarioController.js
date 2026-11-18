const mongoose = require("mongoose");

const usuarioService = require("../services/usuarioService");
const {
    usuarioCriacaoSchema,
    usuarioEdicaoSchema
} = require("../validacoes/usuarioValidacao");

// o mesmo controller serve pra professores e alunos,
// o que muda e so o "tipo" que vem da rota

async function listar(req, res, next, tipo) {

    try {

        let pagina = parseInt(req.query.pagina) || 1;
        let limite = parseInt(req.query.limite) || 10;

        if (pagina < 1) pagina = 1;
        if (limite < 1 || limite > 50) limite = 10;

        const resultado = await usuarioService.listarUsuarios(tipo, pagina, limite);

        return res.json(resultado);

    } catch (erro) {

        next(erro);

    }

}

async function buscarPorId(req, res, next, tipo) {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            mensagem: "ID inválido."
        });
    }

    try {

        const usuario = await usuarioService.buscarUsuarioPorId(tipo, req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Cadastro não encontrado."
            });
        }

        return res.json(usuario);

    } catch (erro) {

        next(erro);

    }

}

async function criar(req, res, next, tipo) {

    const { error } = usuarioCriacaoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            mensagem: error.details[0].message
        });
    }

    try {

        const existe = await usuarioService.buscarPorEmail(req.body.email);

        if (existe) {
            return res.status(400).json({
                mensagem: "E-mail já cadastrado."
            });
        }

        const usuario = await usuarioService.criarUsuario(tipo, req.body);

        return res.status(201).json(usuario);

    } catch (erro) {

        next(erro);

    }

}

async function atualizar(req, res, next, tipo) {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            mensagem: "ID inválido."
        });
    }

    const { error } = usuarioEdicaoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            mensagem: error.details[0].message
        });
    }

    try {

        // verifica se o email ja nao e de outra pessoa
        const existe = await usuarioService.buscarPorEmail(req.body.email);

        if (existe && existe._id.toString() !== req.params.id) {
            return res.status(400).json({
                mensagem: "E-mail já cadastrado."
            });
        }

        const usuario = await usuarioService.atualizarUsuario(tipo, req.params.id, req.body);

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Cadastro não encontrado."
            });
        }

        return res.json(usuario);

    } catch (erro) {

        next(erro);

    }

}

async function excluir(req, res, next, tipo) {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            mensagem: "ID inválido."
        });
    }

    // professor nao pode se excluir, senao perde o acesso
    if (String(req.usuario.id) === req.params.id) {
        return res.status(400).json({
            mensagem: "Você não pode excluir o seu próprio usuário."
        });
    }

    try {

        const usuario = await usuarioService.excluirUsuario(tipo, req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Cadastro não encontrado."
            });
        }

        return res.status(204).send();

    } catch (erro) {

        next(erro);

    }

}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
};
