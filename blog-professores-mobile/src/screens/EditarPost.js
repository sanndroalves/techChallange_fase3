import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native"

import Botao from "../components/Botao"
import CampoTexto from "../components/CampoTexto"
import MensagemErro from "../components/MensagemErro"
import { atualizarPost, buscarPost } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

function EditarPost({ route, navigation }) {
    const { id } = route.params
    const { token } = useAuth()

    const [titulo, setTitulo] = useState("")
    const [conteudo, setConteudo] = useState("")
    const [autor, setAutor] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    // carrega os dados atuais do post
    useEffect(() => {
        buscarPost(id)
            .then((post) => {
                setTitulo(post.titulo)
                setConteudo(post.conteudo)
                setAutor(post.autor)
            })
            .catch((erro) => setErro(erro.message))
            .finally(() => setCarregando(false))
    }, [id])

    async function salvar() {
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
        setSalvando(true)

        try {
            await atualizarPost(id, { titulo, conteudo, autor }, token)

            navigation.goBack()
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setSalvando(false)
        }
    }

    if (carregando) {
        return <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 40 }} />
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            <CampoTexto label="Título" value={titulo} onChangeText={setTitulo} maxLength={100} />

            <CampoTexto label="Autor" value={autor} onChangeText={setAutor} maxLength={80} />

            <CampoTexto label="Conteúdo" value={conteudo} onChangeText={setConteudo} multilinha />

            <MensagemErro mensagem={erro} />

            <Botao titulo="Salvar alterações" aoPressionar={salvar} carregando={salvando} />

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

export default EditarPost
