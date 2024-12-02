import { afterEach, beforeEach, describe } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";

let servidor;
beforeEach(() => {
    const porta = 3000;
    servidor = app.listen(3000);
});

afterEach(() => {
    servidor.close();
});

describe("Testando a rota login (POST)", () => {
    it("O login deve possuir um email e uma senha para se autenticar", async () => {
        const loginMock = {
            email: 'raphael@teste.com.br'
        };

        await request(servidor)
            .post('/login')
            .send(loginMock)
            .expect(500)
            .expect('"A senha de usuário é obrigatória."')
    });

    it("O login deve validar se o usuário está cadastrado", async () => {
        const loginMock = {
            email: "marcelo@naoexiste.com.br",
            senha: "123"
        }

        await request(servidor)
            .post('/login')
            .send(loginMock)
            .expect(500)
            .expect('"Usuário não cadastrado."')
    });

    it.skip("O login deve validar email incorreto", async () => {
        const loginMock = {
            email: "marcelo@testeerrado.com",
            senha: "123"
        }

        await request(servidor)
            .post('/login')
            .send(loginMock)
            .expect(500)
            .expect('"Usuário ou senha invalido."')
    });

    it("O login deve validar senha incorreta", async () => {
        const loginMock = {
            email: "marcelo@testee.com",
            senha: "12345"
        }

        await request(servidor)
            .post('/login')
            .send(loginMock)
            .expect(500)
            .expect('"Usuário ou senha invalido."')
    });

    it("O login deve validar se está sendo retornado um accessToken", async () => {
        const loginMock = {
            email: "marcelo@testee.com",
            senha: "123"
        };

        const resposta = await request(servidor)
            .post('/login')
            .set('Accept', 'application/json')
            .send(loginMock)
            .expect(201);
        expect(resposta.body.message).toBe('Usuário conectado');
        expect(resposta.body).toHaveProperty('accessToken');
    })
});