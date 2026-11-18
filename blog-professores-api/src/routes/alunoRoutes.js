const express = require("express");

const autenticar = require("../middlewares/autenticar");
const somenteProfessor = require("../middlewares/somenteProfessor");
const usuarioController = require("../controllers/usuarioController");

const router = express.Router();

// cadastro de alunos tambem e so pra professor
router.use("/alunos", autenticar, somenteProfessor);

router.get("/alunos", (req, res, next) =>
    usuarioController.listar(req, res, next, "aluno")
);

router.get("/alunos/:id", (req, res, next) =>
    usuarioController.buscarPorId(req, res, next, "aluno")
);

router.post("/alunos", (req, res, next) =>
    usuarioController.criar(req, res, next, "aluno")
);

router.put("/alunos/:id", (req, res, next) =>
    usuarioController.atualizar(req, res, next, "aluno")
);

router.delete("/alunos/:id", (req, res, next) =>
    usuarioController.excluir(req, res, next, "aluno")
);

module.exports = router;
