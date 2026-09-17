import styled from "styled-components"

const Card = styled.article`
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    margin-top: 20px;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
`

const Titulo = styled.h2`
    color: #111827;
    margin-bottom: 8px;
`

const Autor = styled.p`
    color: #2563eb;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
`

const Conteudo = styled.p`
    color: #4b5563;
`

function CardPost({ post, aoClicar }) {
    return (
        <Card
            onClick={aoClicar}
            role="button"
            tabIndex="0"
            onKeyDown={(evento) => {
                if (evento.key === "Enter") {
                    aoClicar()
                }
            }}
        >
            <Titulo>{post.titulo}</Titulo>

            <Autor>
                Por {post.autor}
            </Autor>

            <Conteudo>
                {post.conteudo.length > 180
                    ? `${post.conteudo.substring(0, 180)}...`
                    : post.conteudo}
            </Conteudo>
        </Card>
    )
}

export default CardPost