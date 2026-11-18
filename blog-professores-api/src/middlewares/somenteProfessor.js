// usar sempre depois do middleware autenticar (precisa do req.usuario)
function somenteProfessor(req, res, next) {

    if (!req.usuario || req.usuario.tipo !== "professor") {
        return res.status(403).json({
            mensagem: "Apenas professores podem fazer essa ação."
        });
    }

    next();

}

module.exports = somenteProfessor;
