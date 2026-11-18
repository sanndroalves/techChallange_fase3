const request = require("supertest");
const app = require("../src/app");

const mongoose = require("mongoose");
const conectarBanco = require("../src/config/banco");
const Usuario = require("../src/models/Usuario");

describe("Professores e alunos", () => {
    let tokenProfessor;
    let tokenAluno;
    let idAluno;

    const emailProfessor = "prof.jest@teste.com";
    const emailAluno = "aluno.jest@teste.com";

    beforeAll(async () => {
        await conectarBanco();

        await Usuario.deleteMany({
            email: { $in: [emailProfessor, emailAluno] }
        });

        // /usuarios cria professor por padrao
        await request(app)
            .post("/usuarios")
            .send({
                nome: "Professor Jest",
                email: emailProfessor,
                senha: "123456"
            });

        const loginProfessor = await request(app)
            .post("/login")
            .send({ email: emailProfessor, senha: "123456" });

        tokenProfessor = loginProfessor.body.token;
    });

    test("Professor deve cadastrar um aluno", async () => {
        const resposta = await request(app)
            .post("/alunos")
            .set("Authorization", `Bearer ${tokenProfessor}`)
            .send({
                nome: "Aluno Jest",
                email: emailAluno,
                senha: "123456"
            });

        expect(resposta.statusCode).toBe(201);
        expect(resposta.body.tipo).toBe("aluno");
        expect(resposta.body.senha).toBeUndefined();

        idAluno = resposta.body._id;
    });

    test("Deve listar professores com paginação", async () => {
        const resposta = await request(app)
            .get("/professores?pagina=1&limite=5")
            .set("Authorization", `Bearer ${tokenProfessor}`);

        expect(resposta.statusCode).toBe(200);
        expect(Array.isArray(resposta.body.dados)).toBe(true);
        expect(resposta.body.pagina).toBe(1);
    });

    test("Aluno não pode criar post", async () => {
        const loginAluno = await request(app)
            .post("/login")
            .send({ email: emailAluno, senha: "123456" });

        tokenAluno = loginAluno.body.token;

        expect(loginAluno.body.usuario.tipo).toBe("aluno");

        const resposta = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${tokenAluno}`)
            .send({
                titulo: "Post do aluno",
                conteudo: "Aluno tentando criar um post",
                autor: "Aluno"
            });

        expect(resposta.statusCode).toBe(403);
    });

    test("Aluno não pode listar professores", async () => {
        const resposta = await request(app)
            .get("/professores")
            .set("Authorization", `Bearer ${tokenAluno}`);

        expect(resposta.statusCode).toBe(403);
    });

    test("Professor deve excluir o aluno", async () => {
        const resposta = await request(app)
            .delete(`/alunos/${idAluno}`)
            .set("Authorization", `Bearer ${tokenProfessor}`);

        expect(resposta.statusCode).toBe(204);
    });

    afterAll(async () => {
        await Usuario.deleteMany({
            email: { $in: [emailProfessor, emailAluno] }
        });

        await mongoose.connection.close();
    });
});
