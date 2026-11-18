import { useState } from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native"

import Botao from "../components/Botao"
import CampoTexto from "../components/CampoTexto"
import MensagemErro from "../components/MensagemErro"
import { fazerLogin } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

function Login({ navigation }) {
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)

    async function entrar() {
        if (!email || !senha) {
            setErro("Preencha o e-mail e a senha.")
            return
        }

        setErro("")
        setCarregando(true)

        try {
            const dados = await fazerLogin(email.trim(), senha)

            await login(dados)

            navigation.goBack()
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.caixa}>
                <Text style={styles.titulo}>Entrar</Text>
                <Text style={styles.descricao}>
                    Professores e alunos acessam com o e-mail cadastrado.
                </Text>

                <CampoTexto
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="seuemail@exemplo.com"
                />

                <CampoTexto
                    label="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    placeholder="Sua senha"
                />

                <MensagemErro mensagem={erro} />

                <Botao titulo="Entrar" aoPressionar={entrar} carregando={carregando} />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        justifyContent: "center",
        padding: 20
    },
    caixa: {
        backgroundColor: cores.branco,
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: cores.borda
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: cores.escuro,
        marginBottom: 6
    },
    descricao: {
        color: cores.textoClaro,
        marginBottom: 24
    }
})

export default Login
