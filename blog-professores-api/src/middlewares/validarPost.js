const postSchema = require("../validacoes/postValidacao");

function validarPost(req, res, next) {

    const { error } = postSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            mensagem: error.details[0].message
        });
    }

    next();

}

module.exports = validarPost;