function logRequisicoes(req, res, next) {

    const inicio = Date.now();

    res.on("finish", () => {

        const hora = new Date().toLocaleTimeString("pt-BR");
        const tempo = Date.now() - inicio;
        const usuario = req.usuario ? ` - ${req.usuario.email} (${req.usuario.tipo})` : "";

        console.log(`[${hora}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${tempo}ms)${usuario}`);

    });

    next();

}

module.exports = logRequisicoes;
