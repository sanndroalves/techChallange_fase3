const Post = require("../models/Post");

async function listarPosts() {
    return Post.find();
}

async function buscarPostPorId(id) {
    return Post.findById(id);
}

async function criarPost(dadosPost) {
    return Post.create(dadosPost);
}

async function atualizarPost(id, dadosPost) {

    return Post.findByIdAndUpdate(
        id,
        dadosPost,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

}

async function excluirPost(id) {

    return Post.findByIdAndDelete(id);

}

async function pesquisarPosts(texto) {

    return Post.find({

        $or: [

            {
                titulo: {
                    $regex: texto,
                    $options: "i"
                }
            },

            {
                conteudo: {
                    $regex: texto,
                    $options: "i"
                }
            }

        ]

    });

}

module.exports = {
    listarPosts,
    criarPost,
    buscarPostPorId,
    atualizarPost,
    excluirPost,
    pesquisarPosts
};