const postService = require("../services/postService");
const postSchema = require("../validacoes/postValidacao");
const mongoose = require("mongoose");


async function listarPosts(req, res, next) {

    try {

        const posts = await postService.listarPosts();

        return res.json(posts);

    } catch (erro) {

        next(erro);

    }

}

async function criarPost(req, res) {

    try {

        const novoPost = await postService.criarPost(req.body);

        return res.status(201).json(novoPost);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao criar o post."
        });

    }

}

async function buscarPostPorId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                mensagem: "ID inválido."
            });

        }

    try {

        const post = await postService.buscarPostPorId(
            req.params.id
        );

        if (!post) {

            return res.status(404).json({
                mensagem: "Post não encontrado."
            });

        }

        return res.json(post);

    } catch (erro) {

        next(erro);

    }

}

async function atualizarPost(req, res, next) {

    try {

        const post = await postService.atualizarPost(
            req.params.id,
            req.body
        );

        if (!post) {

            return res.status(404).json({
                mensagem: "Post não encontrado."
            });

        }

        return res.json(post);

    } catch (erro) {

        next(erro);

    }

}

async function excluirPost(req, res, next) {

    try {

        const post = await postService.excluirPost(
            req.params.id
        );

        if (!post) {

            return res.status(404).json({
                mensagem: "Post não encontrado."
            });

        }

        return res.status(204).send();

    } catch (erro) {

        next(erro);

    }

}

async function pesquisarPosts(req, res, next) {

    try {

        const texto = req.query.texto;

        if (!texto) {

            return res.status(400).json({
                mensagem: "Informe o parâmetro 'texto'."
            });

        }

        const posts = await postService.pesquisarPosts(texto);

        return res.json(posts);

    } catch (erro) {

        next(erro);

    }

}

module.exports = {
    listarPosts,
    criarPost,
    buscarPostPorId,
    atualizarPost,
    excluirPost,
    pesquisarPosts
};