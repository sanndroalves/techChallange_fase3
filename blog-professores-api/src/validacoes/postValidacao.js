const Joi = require("joi");

const postSchema = Joi.object({

    titulo: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .required(),

    conteudo: Joi.string()
        .trim()
        .min(10)
        .required(),

    autor: Joi.string()
        .trim()
        .min(3)
        .max(80)
        .required()

});

module.exports = postSchema;