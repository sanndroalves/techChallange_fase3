require("dotenv").config();

const express = require("express");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const tratamentoErros = require("./middlewares/tratamentoErros");

const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json());

app.use(postRoutes);
app.use(authRoutes);
app.use(tratamentoErros);

module.exports = app;
