import styled from "styled-components"

const Busca = styled.input`
    margin-top: 24px;
    font-size: 16px;
    padding: 14px 16px;
`

function CampoBusca({ valor, aoAlterar }) {
    return (
        <Busca
            type="search"
            placeholder="Buscar por título, conteúdo ou autor..."
            aria-label="Buscar posts"
            value={valor}
            onChange={(evento) => aoAlterar(evento.target.value)}
        />
    )
}

export default CampoBusca