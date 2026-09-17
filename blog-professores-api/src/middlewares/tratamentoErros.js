function tratamentoErros(erro, req, res, next) {

    console.error(erro);

    return res.status(500).json({
        mensagem: "Erro interno do servidor."
    });

}

module.exports = tratamentoErros;