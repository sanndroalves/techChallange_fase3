require("dotenv").config();

const app = require("./app");
const conectarBanco = require("./config/banco");

const PORTA = process.env.PORT || 3000;

async function iniciarServidor() {

    await conectarBanco();

    app.listen(PORTA, () => {

        console.log(`Servidor iniciado na porta ${PORTA}`);

    });

}

iniciarServidor();