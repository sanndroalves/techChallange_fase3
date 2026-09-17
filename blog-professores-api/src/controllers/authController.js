const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

async function cadastrarUsuario(req, res, next) {
    try {
        const { nome, email, senha } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            return res.status(400).json({
                mensagem: "E-mail já cadastrado."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada
        });

        res.status(201).json({
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email
        });
    } catch (erro) {
        next(erro);
    }
}

async function login(req, res, next) {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    cadastrarUsuario,
    login
};