import styled from "styled-components"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { fazerLogin } from "../services/api"
import { useAuth } from "../context/useAuth"

const Pagina = styled.main`
    max-width: 480px;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Caixa = styled.section`
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
`

const Titulo = styled.h1`
    color: #111827;
    margin-bottom: 8px;
`

const Descricao = styled.p`
    color: #6b7280;
    margin-bottom: 28px;
`

const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const Campo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`

const Label = styled.label`
    font-weight: bold;
    color: #374151;
`

const Botao = styled.button`
    width: 100%;
    padding: 13px;
    font-weight: bold;
    margin-top: 4px;
`

const MensagemErro = styled.p`
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 10px 12px;
    border-radius: 8px;
`

function Login() {
    const navegar = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)

    async function entrar(evento) {
        evento.preventDefault()

        setErro("")
        setCarregando(true)

        try {
            const dados = await fazerLogin(email, senha)

            login(dados)

            navegar("/admin")
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <Pagina>
            <Caixa>
                <Titulo>Área do Professor</Titulo>

                <Descricao>
                    Entre para gerenciar os posts do blog.
                </Descricao>

                <Formulario onSubmit={entrar}>
                    <Campo>
                        <Label htmlFor="email">
                            E-mail
                        </Label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(evento) =>
                                setEmail(evento.target.value)
                            }
                            required
                            autoComplete="email"
                        />
                    </Campo>

                    <Campo>
                        <Label htmlFor="senha">
                            Senha
                        </Label>

                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(evento) =>
                                setSenha(evento.target.value)
                            }
                            required
                            autoComplete="current-password"
                        />
                    </Campo>

                    {erro && (
                        <MensagemErro role="alert">
                            {erro}
                        </MensagemErro>
                    )}

                    <Botao
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Entrando..."
                            : "Entrar"}
                    </Botao>
                </Formulario>
            </Caixa>
        </Pagina>
    )
}

export default Login