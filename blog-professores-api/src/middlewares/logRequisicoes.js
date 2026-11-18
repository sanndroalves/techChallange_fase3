// mostra no terminal cada requisicao que chega na api
// ex: [14:32:10] POST /login -> 200 (85ms)
function logRequisicoes(req, res, next) {

    const inicio = Date.now();

    // o "finish" roda quando a resposta ja foi enviada, ai da pra pegar o status
    res.on("finish", () => {

        const hora = new Date().toLocaleTimeString("pt-BR");
        const tempo = Date.now() - inicio;
        const usuario = req.usuario ? ` - ${req.usuario.email} (${req.usuario.tipo})` : "";

        console.log(`[${hora}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${tempo}ms)${usuario}`);

    });

    next();

}

module.exports = logRequisicoes;
