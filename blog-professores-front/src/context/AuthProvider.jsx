import { useState } from "react"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    )

    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem("usuario")) || null
    )

    function login(dados) {
        setToken(dados.token)
        setUsuario(dados.usuario)

        localStorage.setItem("token", dados.token)
        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        )
    }

    function logout() {
        setToken(null)
        setUsuario(null)

        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
    }

    const autenticado = !!token

    return (
        <AuthContext.Provider
            value={{
                token,
                usuario,
                autenticado,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}