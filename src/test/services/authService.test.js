import { describe, expect } from "@jest/globals";
import AuthService from "../../services/authService.js";
import bcryptjs from 'bcryptjs';
import Usuario from "../../models/usuario.js";

const authService = new AuthService();

describe('Testando  a authService.cadastrarUsuario', () => {
    it('O usuario deve possuir um nome, email e senha', async () => {
        //arrange
        const usuarioMock = {
            nome: "Rafael",
            email: "rafael@teste.com.br"
        };

        //act
        const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);

        //assert
        await expect(usuarioSalvo).rejects.toThrowError("A senha de usuário é obrigatória!");
    });

    it('A senha do usuário precisa ser criptografada quando for salva no BD', async () => {
        const usuarioMock = {
            nome: "Marcelo",
            email: "marcelo@teste.com",
            senha: "123"
        }

        const usuarioSalvo = await authService.cadastrarUsuario(usuarioMock)
        const senhasIguais = await bcryptjs.compare("123", usuarioSalvo.content.senha);

        expect(senhasIguais).toStrictEqual(true)

        await Usuario.excluir(usuarioSalvo.content.id)
    });

    it('Não pode ser cadastrado um usário com email duplicado', async () => {
        const usuarioMock = {
            nome: "Marcelo",
            email: "teste@gmail.com",
            senha: "123"
        }

        const usuarioSalvo = authService.cadastrarUsuario(usuarioMock)

        await expect(usuarioSalvo).rejects.toThrowError('O email já está cadastrado!')
    });

    it('Ao cadastrar um usuário, deve ser retornada uma mensagem informando que o cadastro foi realizado', async () => {
        const usuarioMock = {
            nome: "Marcelo",
            email: "marcelo@teste.com",
            senha: "123"
        };

        const usuarioSalvo = await authService.cadastrarUsuario(usuarioMock);

        expect(usuarioSalvo.message).toStrictEqual("usuário criado!");

        await Usuario.excluir(usuarioSalvo.content.id);
    });

    it("Ao cadastrar o usuário, validar o retorno das informações do usuário", async () => {
        const usuarioMock = {
            nome: "Marcelo",
            email: "marcelo@teste.com",
            senha: "123"
        };

        const usuarioSalvo = await authService.cadastrarUsuario(usuarioMock);

        expect(usuarioSalvo.content.nome).toStrictEqual("Marcelo")
        expect(usuarioSalvo.content.email).toStrictEqual("marcelo@teste.com")

        const senhasIguais = await bcryptjs.compare("123", usuarioSalvo.content.senha);
        expect(senhasIguais).toStrictEqual(true)

        await Usuario.excluir(usuarioSalvo.content.id);
    });
});