const express = require("express");

const autenticar = require("../middlewares/autenticar");
const postController = require("../controllers/postController");
const validarPost = require("../middlewares/validarPost");

const router = express.Router();
 
router.get("/posts", postController.listarPosts);

router.post(
    "/posts",
    autenticar,
    validarPost,
    postController.criarPost
);

router.get(
    "/posts/busca",
    postController.pesquisarPosts
);

router.get(
    "/posts/:id",
    postController.buscarPostPorId
);

router.put(
    "/posts/:id",
    autenticar,
    validarPost,
    postController.atualizarPost
);

router.delete(
    "/posts/:id",
    autenticar,
    postController.excluirPost
);




module.exports = router;