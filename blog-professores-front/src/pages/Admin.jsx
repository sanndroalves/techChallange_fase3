import styled from "styled-components"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { buscarPosts, excluirPost } from "../services/api"
import { useAuth } from "../context/useAuth"

const Pagina = styled.main`
    max-width: 1000px;
`

const CabecalhoPagina = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`

const Titulo = styled.h1`
    color: #111827;
`

const Informacoes = styled.p`
    color: #6b7280;
    margin-top: 6px;
`

const BotaoCriar = styled.button`
    white-space: nowrap;
`

const Lista = styled.section`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const Post = styled.article`
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
`

const TituloPost = styled.h2`
    color: #111827;
    margin-bottom: 6px;
`

const Autor = styled.p`
    color: #2563eb;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 16px;
`

const Botoes = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;

    @media (max-width: 600px) {
        flex-direction: column;

        button {
            width: 100%;
        }
    }
`

const BotaoExcluir = styled.button`
    background: #dc2626;

    &:hover {
        background: #b91c1c;
    }
`

const BotaoSair = styled.button`
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
    margin-bottom: 20px;
`

function Admin() {
    const navegar = useNavigate()
    const { token, usuario, logout } = useAuth()

    const [posts, setPosts] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useEffect(() => {
        buscarPosts()
            .then((dados) => {
                setPosts(dados)
            })
            .catch(() => {
                setErro("Não foi possível carregar os posts.")
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [])

    async function excluir(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este post?"
        )

        if (!confirmar) {
            return
        }

        try {
            await excluirPost(id, token)

            setPosts(
                posts.filter((post) => post._id !== id)
            )
        } catch (erro) {
            setErro(erro.message)
        }
    }

    function sair() {
        logout()
        navegar("/login")
    }

    if (carregando) {
        return <h1>Carregando posts...</h1>
    }

    return (
        <Pagina>
            <CabecalhoPagina>
                <div>
                    <Titulo>Área Administrativa</Titulo>

                    <Informacoes>
                        Professor: {usuario?.nome}
                    </Informacoes>
                </div>

                <BotaoCriar
                    onClick={() => navegar("/criar-post")}
                >
                    + Novo post
                </BotaoCriar>
            </CabecalhoPagina>

            {erro && (
                <MensagemErro role="alert">
                    {erro}
                </MensagemErro>
            )}

            {posts.length === 0 ? (
                <p>Nenhum post cadastrado.</p>
            ) : (
                <Lista>
                    {posts.map((post) => (
                        <Post key={post._id}>
                            <TituloPost>
                                {post.titulo}
                            </TituloPost>

                            <Autor>
                                Por {post.autor}
                            </Autor>

                            <Botoes>
                                <button
                                    onClick={() =>
                                        navegar(
                                            `/editar-post/${post._id}`
                                        )
                                    }
                                >
                                    Editar
                                </button>

                                <BotaoExcluir
                                    onClick={() =>
                                        excluir(post._id)
                                    }
                                >
                                    Excluir
                                </BotaoExcluir>
                            </Botoes>
                        </Post>
                    ))}
                </Lista>
            )}

            <Botoes>
                <BotaoSair onClick={sair}>
                    Sair da área administrativa
                </BotaoSair>
            </Botoes>
        </Pagina>
    )
}

export default Admin