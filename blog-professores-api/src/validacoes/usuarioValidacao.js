const Joi = require("joi");

const usuarioCriacaoSchema = Joi.object({

    nome: Joi.string()
        .trim()
        .min(3)
        .max(80)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    senha: Joi.string()
        .min(6)
        .required()

});

// na edicao a senha e opcional, so troca se mandar
const usuarioEdicaoSchema = Joi.object({

    nome: Joi.string()
        .trim()
        .min(3)
        .max(80)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    senha: Joi.string()
        .min(6)
        .allow("")

});

module.exports = {
    usuarioCriacaoSchema,
    usuarioEdicaoSchema
};
