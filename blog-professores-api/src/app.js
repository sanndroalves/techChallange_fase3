require("dotenv").config();

const express = require("express");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require("./routes/professorRoutes");
const alunoRoutes = require("./routes/alunoRoutes");

const tratamentoErros = require("./middlewares/tratamentoErros");
const logRequisicoes = require("./middlewares/logRequisicoes");

const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json());

// so mostra o log quando nao esta rodando os testes
if (process.env.NODE_ENV !== "test") {
    app.use(logRequisicoes);
}

app.use(postRoutes);
app.use(authRoutes);
app.use(professorRoutes);
app.use(alunoRoutes);
app.use(tratamentoErros);

module.exports = app;
