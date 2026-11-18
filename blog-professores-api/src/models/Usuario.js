const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        senha: {
            type: String,
            required: true
        },

        // professor pode criar/editar posts, aluno so visualiza
        tipo: {
            type: String,
            enum: ["professor", "aluno"],
            default: "professor"
        }
    },
    {
        timestamps: true
    }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;