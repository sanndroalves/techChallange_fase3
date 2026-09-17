const request = require("supertest");
const app = require("../src/app");

const mongoose = require("mongoose");
const conectarBanco = require("../src/config/banco");
const Usuario = require("../src/models/Usuario");

describe("Posts", () => {
    let token;

    beforeAll(async () => {
        await conectarBanco();

        const email = "teste.jest@teste.com";

        await Usuario.deleteOne({ email });

        await request(app)
            .post("/usuarios")
            .send({
                nome: "Usuário Teste",
                email,
                senha: "123456"
            });

        const respostaLogin = await request(app)
            .post("/login")
            .send({
                email,
                senha: "123456"
            });

        token = respostaLogin.body.token;
    });

    test("Deve listar os posts", async () => {
        const resposta = await request(app)
            .get("/posts");

        expect(resposta.statusCode).toBe(200);
    });

    test("Deve criar um novo post", async () => {
        const resposta = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                titulo: "Teste2",
                conteudo: "Conteúdo de teste para o Jest.2",
                autor: "Aluno2"
            });

        expect(resposta.statusCode).toBe(201);
    });

    test("Não deve criar um post inválido", async () => {
        const resposta = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(resposta.statusCode).toBe(400);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});