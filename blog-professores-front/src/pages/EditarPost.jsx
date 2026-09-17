import styled from "styled-components"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { buscarPost, atualizarPost } from "../services/api"
import { useAuth } from "../context/useAuth"

const Pagina = styled.main`
    max-width: 800px;
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

const Botoes = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;

    @media (max-width: 600px) {
        flex-direction: column;
    }
`

const BotaoCancelar = styled.button`
    background: #6b7280;

    &:hover {
        background: #4b5563;
    }
`

const MensagemErro = styled.p`
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 10px 12px;
    border-radius: 8px;
`

function EditarPost() {
    const { id } = useParams()
    const navegar = useNavigate()
    const { token } = useAuth()

    const [titulo, setTitulo] = useState("")
    const [conteudo, setConteudo] = useState("")
    const [autor, setAutor] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")

    useEffect(() => {
        buscarPost(id)
            .then((post) => {
                setTitulo(post.titulo)
                setConteudo(post.conteudo)
                setAutor(post.autor)
            })
            .catch(() => {
                setErro("Não foi possível carregar o post.")
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [id])

    async function salvar(evento) {
        evento.preventDefault()

        setErro("")
        setSalvando(true)

        try {
            await atualizarPost(
                id,
                {
                    titulo,
                    conteudo,
                    autor
                },
                token
            )

            navegar("/admin")
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setSalvando(false)
        }
    }

    if (carregando) {
        return <h1>Carregando post...</h1>
    }

    return (
        <Pagina>
            <Caixa>
                <Titulo>Editar Post</Titulo>

                <Formulario onSubmit={salvar}>
                    <Campo>
                        <Label htmlFor="titulo">
                            Título
                        </Label>

                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(evento) =>
                                setTitulo(evento.target.value)
                            }
                            required
                        />
                    </Campo>

                    <Campo>
                        <Label htmlFor="autor">
                            Autor
                        </Label>

                        <input
                            id="autor"
                            type="text"
                            value={autor}
                            onChange={(evento) =>
                                setAutor(evento.target.value)
                            }
                            required
                        />
                    </Campo>

                    <Campo>
                        <Label htmlFor="conteudo">
                            Conteúdo
                        </Label>

                        <textarea
                            id="conteudo"
                            value={conteudo}
                            onChange={(evento) =>
                                setConteudo(evento.target.value)
                            }
                            required
                        />
                    </Campo>

                    {erro && (
                        <MensagemErro role="alert">
                            {erro}
                        </MensagemErro>
                    )}

                    <Botoes>
                        <button
                            type="submit"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </button>

                        <BotaoCancelar
                            type="button"
                            onClick={() => navegar("/admin")}
                        >
                            Cancelar
                        </BotaoCancelar>
                    </Botoes>
                </Formulario>
            </Caixa>
        </Pagina>
    )
}

export default EditarPost