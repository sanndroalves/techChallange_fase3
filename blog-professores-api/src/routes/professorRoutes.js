const express = require("express");

const autenticar = require("../middlewares/autenticar");
const somenteProfessor = require("../middlewares/somenteProfessor");
const usuarioController = require("../controllers/usuarioController");

const router = express.Router();

// todas as rotas de professores so podem ser acessadas por professor
router.use("/professores", autenticar, somenteProfessor);

router.get("/professores", (req, res, next) =>
    usuarioController.listar(req, res, next, "professor")
);

router.get("/professores/:id", (req, res, next) =>
    usuarioController.buscarPorId(req, res, next, "professor")
);

router.post("/professores", (req, res, next) =>
    usuarioController.criar(req, res, next, "professor")
);

router.put("/professores/:id", (req, res, next) =>
    usuarioController.atualizar(req, res, next, "professor")
);

router.delete("/professores/:id", (req, res, next) =>
    usuarioController.excluir(req, res, next, "professor")
);

module.exports = router;
