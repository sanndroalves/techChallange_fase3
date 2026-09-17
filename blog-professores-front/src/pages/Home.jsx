import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { buscarPosts } from "../services/api"
import CardPost from "../components/CardPost"
import CampoBusca from "../components/CampoBusca"

function Home() {
    const [posts, setPosts] = useState([])
    const [busca, setBusca] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    const navegar = useNavigate()

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

    const postsFiltrados = posts.filter((post) => {
        const termo = busca.toLowerCase()

        return (
            post.titulo.toLowerCase().includes(termo) ||
            post.conteudo.toLowerCase().includes(termo) ||
            post.autor.toLowerCase().includes(termo)
        )
    })

    if (carregando) {
        return <h1>Carregando posts...</h1>
    }

    if (erro) {
        return <h1>{erro}</h1>
    }

    return (
        <main>
            <h1>Blog dos Professores</h1>

            <p>
                Conhecimento, experiências e ideias compartilhadas
                pelos nossos professores.
            </p>

            <CampoBusca
                valor={busca}
                aoAlterar={setBusca}
            />

            {postsFiltrados.length === 0 ? (
                <p>Nenhum post encontrado.</p>
            ) : (
                postsFiltrados.map((post) => (
                    <CardPost
                        key={post._id}
                        post={post}
                        aoClicar={() => navegar(`/post/${post._id}`)}
                    />
                ))
            )}
        </main>
    )
}

export default Home