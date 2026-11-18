import { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

import Botao from "../components/Botao"
import CampoTexto from "../components/CampoTexto"
import MensagemErro from "../components/MensagemErro"
import { criarPost } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

function CriarPost({ navigation }) {
    const { token, usuario } = useAuth()

    const [titulo, setTitulo] = useState("")
    const [conteudo, setConteudo] = useState("")
    const [autor, setAutor] = useState(usuario?.nome || "")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)

    async function salvar() {
        // mesmas regras da validacao do back (joi)
        if (titulo.trim().length < 5) {
            setErro("O título precisa ter pelo menos 5 caracteres.")
            return
        }

        if (autor.trim().length < 3) {
            setErro("O autor precisa ter pelo menos 3 caracteres.")
            return
        }

        if (conteudo.trim().length < 10) {
            setErro("O conteúdo precisa ter pelo menos 10 caracteres.")
            return
        }

        setErro("")
        setCarregando(true)

        try {
            await criarPost({ titulo, conteudo, autor }, token)

            navigation.goBack()
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            <CampoTexto label="Título" value={titulo} onChangeText={setTitulo} maxLength={100} />

            <CampoTexto label="Autor" value={autor} onChangeText={setAutor} maxLength={80} />

            <CampoTexto label="Conteúdo" value={conteudo} onChangeText={setConteudo} multilinha />

            <MensagemErro mensagem={erro} />

            <Botao titulo="Publicar post" aoPressionar={salvar} carregando={carregando} />

            <Botao
                titulo="Cancelar"
                tipo="secundario"
                aoPressionar={() => navigation.goBack()}
                estilo={{ marginTop: 10 }}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo
    }
})

export default CriarPost
