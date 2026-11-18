import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext()

// no mobile nao tem localStorage, entao usei o AsyncStorage
export function AuthProvider({ children }) {
    const [token, setToken] = useState(null)
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)

    // quando abre o app ve se ja tinha alguem logado
    useEffect(() => {
        async function carregarDados() {
            try {
                const tokenSalvo = await AsyncStorage.getItem("token")
                const usuarioSalvo = await AsyncStorage.getItem("usuario")

                if (tokenSalvo && usuarioSalvo) {
                    setToken(tokenSalvo)
                    setUsuario(JSON.parse(usuarioSalvo))
                }
            } catch (erro) {
                console.log("Erro ao carregar login salvo", erro)
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    async function login(dados) {
        setToken(dados.token)
        setUsuario(dados.usuario)

        await AsyncStorage.setItem("token", dados.token)
        await AsyncStorage.setItem("usuario", JSON.stringify(dados.usuario))
    }

    async function logout() {
        setToken(null)
        setUsuario(null)

        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("usuario")
    }

    const autenticado = !!token
    const ehProfessor = usuario?.tipo === "professor"

    return (
        <AuthContext.Provider
            value={{
                token,
                usuario,
                autenticado,
                ehProfessor,
                carregando,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
