import { useCallback, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import Botao from "../components/Botao"
import MensagemErro from "../components/MensagemErro"
import { buscarPost } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

function Post({ route, navigation }) {
    const { id } = route.params
    const { ehProfessor } = useAuth()

    const [post, setPost] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useFocusEffect(
        useCallback(() => {
            buscarPost(id)
                .then((dados) => setPost(dados))
                .catch((erro) => setErro(erro.message))
                .finally(() => setCarregando(false))
        }, [id])
    )

    if (carregando) {
        return <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 40 }} />
    }

    if (!post) {
        return (
            <View style={styles.container}>
                <MensagemErro mensagem={erro || "Post não encontrado."} />
            </View>
        )
    }

    const data = new Date(post.createdAt).toLocaleDateString("pt-BR")

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.titulo}>{post.titulo}</Text>

            <Text style={styles.info}>
                Por <Text style={styles.autor}>{post.autor}</Text> em {data}
            </Text>

            <View style={styles.linha} />

            <Text style={styles.conteudo}>{post.conteudo}</Text>

            {/* so professor ve o botao de editar */}
            {ehProfessor && (
                <Botao
                    titulo="Editar post"
                    aoPressionar={() => navigation.navigate("EditarPost", { id: post._id })}
                    estilo={{ marginTop: 24 }}
                />
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.branco,
        padding: 20
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: cores.escuro,
        marginBottom: 8
    },
    info: {
        color: cores.textoClaro
    },
    autor: {
        color: cores.primaria,
        fontWeight: "bold"
    },
    linha: {
        height: 1,
        backgroundColor: cores.borda,
        marginVertical: 16
    },
    conteudo: {
        fontSize: 16,
        lineHeight: 26,
        color: cores.texto
    }
})

export default Post
