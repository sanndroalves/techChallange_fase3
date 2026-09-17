import styled from "styled-components"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { buscarPost } from "../services/api"

const Pagina = styled.main`
    max-width: 800px;
`

const BotaoVoltar = styled.button`
    margin-bottom: 24px;
`

const Artigo = styled.article`
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
`

const Titulo = styled.h1`
    font-size: 36px;
    color: #111827;
    margin-bottom: 12px;
`

const Autor = styled.p`
    color: #2563eb;
    font-weight: bold;
    margin-bottom: 32px;
`

const Conteudo = styled.p`
    color: #374151;
    font-size: 17px;
    line-height: 1.8;
    white-space: pre-wrap;
`

function Post() {
    const { id } = useParams()
    const navegar = useNavigate()

    const [post, setPost] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useEffect(() => {
        buscarPost(id)
            .then((dados) => {
                setPost(dados)
            })
            .catch(() => {
                setErro("Não foi possível carregar o post.")
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [id])

    if (carregando) {
        return <h1>Carregando post...</h1>
    }

    if (erro) {
        return <h1>{erro}</h1>
    }

    return (
        <Pagina>
            <BotaoVoltar onClick={() => navegar("/")}>
                ← Voltar
            </BotaoVoltar>

            <Artigo>
                <Titulo>{post.titulo}</Titulo>

                <Autor>
                    Por {post.autor}
                </Autor>

                <Conteudo>
                    {post.conteudo}
                </Conteudo>
            </Artigo>
        </Pagina>
    )
}

export default Post