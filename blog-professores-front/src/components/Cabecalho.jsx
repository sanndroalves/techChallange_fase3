import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../context/useAuth"

const CabecalhoContainer = styled.header`
    background: #111827;
    color: #ffffff;
    padding: 16px 0;
`

const Navegacao = styled.nav`
    width: min(1100px, 92%);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
`

const Logo = styled(Link)`
    font-size: 20px;
    font-weight: bold;
    margin-right: auto;
`

const LinkNavegacao = styled(Link)`
    color: #d1d5db;
    transition: color 0.2s;

    &:hover {
        color: #ffffff;
    }
`

const Usuario = styled.span`
    color: #d1d5db;
    font-size: 14px;
`

const BotaoSair = styled.button`
    background: #dc2626;
    padding: 8px 14px;

    &:hover {
        background: #b91c1c;
    }
`

function Cabecalho() {
    const navegar = useNavigate()
    const { autenticado, usuario, logout } = useAuth()

    function sair() {
        logout()
        navegar("/")
    }

    return (
        <CabecalhoContainer>
            <Navegacao>
                <Logo to="/">
                    Blog dos Professores
                </Logo>

                <LinkNavegacao to="/">
                    Início
                </LinkNavegacao>

                {autenticado ? (
                    <>
                        <LinkNavegacao to="/admin">
                            Área do Professor
                        </LinkNavegacao>

                        <Usuario>
                            Olá, {usuario?.nome}
                        </Usuario>

                        <BotaoSair onClick={sair}>
                            Sair
                        </BotaoSair>
                    </>
                ) : (
                    <LinkNavegacao to="/login">
                        Login
                    </LinkNavegacao>
                )}
            </Navegacao>
        </CabecalhoContainer>
    )
}

export default Cabecalho