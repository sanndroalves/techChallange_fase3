import { useCallback, useState } from "react"
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import Botao from "../components/Botao"
import MensagemErro from "../components/MensagemErro"
import { buscarPosts, excluirPost } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

function Admin({ navigation }) {
    const { token, usuario } = useAuth()

    const [posts, setPosts] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useFocusEffect(
        useCallback(() => {
            buscarPosts()
                .then((dados) => {
                    dados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    setPosts(dados)
                })
                .catch((erro) => setErro(erro.message))
                .finally(() => setCarregando(false))
        }, [])
    )

    function confirmarExclusao(post) {
        Alert.alert(
            "Excluir post",
            `Deseja realmente excluir "${post.titulo}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => excluir(post._id) }
            ]
        )
    }

    async function excluir(id) {
        try {
            await excluirPost(id, token)

            setPosts(posts.filter((post) => post._id !== id))
        } catch (erro) {
            setErro(erro.message)
        }
    }

    // cabecalho da lista com os botoes de navegacao
    function Topo() {
        return (
            <View style={styles.topo}>
                <Text style={styles.titulo}>Área Administrativa</Text>
                <Text style={styles.info}>Professor: {usuario?.nome}</Text>

                <Botao
                    titulo="+ Novo post"
                    aoPressionar={() => navigation.navigate("CriarPost")}
                    estilo={{ marginTop: 16 }}
                />

                <View style={styles.linhaBotoes}>
                    <Botao
                        titulo="Professores"
                        tipo="secundario"
                        aoPressionar={() => navigation.navigate("Professores")}
                        estilo={{ flex: 1 }}
                    />
                    <Botao
                        titulo="Alunos"
                        tipo="secundario"
                        aoPressionar={() => navigation.navigate("Alunos")}
                        estilo={{ flex: 1 }}
                    />
                </View>

                <MensagemErro mensagem={erro} />

                <Text style={styles.subtitulo}>Posts ({posts.length})</Text>
            </View>
        )
    }

    if (carregando) {
        return <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 40 }} />
    }

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
            data={posts}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={Topo}
            ListEmptyComponent={<Text style={styles.vazio}>Nenhum post cadastrado.</Text>}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.tituloPost}>{item.titulo}</Text>
                    <Text style={styles.autor}>Por {item.autor}</Text>

                    <View style={styles.linhaBotoes}>
                        <Botao
                            titulo="Editar"
                            aoPressionar={() => navigation.navigate("EditarPost", { id: item._id })}
                            estilo={{ flex: 1 }}
                        />
                        <Botao
                            titulo="Excluir"
                            tipo="perigo"
                            aoPressionar={() => confirmarExclusao(item)}
                            estilo={{ flex: 1 }}
                        />
                    </View>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo
    },
    topo: {
        marginBottom: 8
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: cores.escuro
    },
    info: {
        color: cores.textoClaro,
        marginTop: 4
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.escuro,
        marginTop: 8
    },
    linhaBotoes: {
        flexDirection: "row",
        gap: 10,
        marginTop: 12,
        marginBottom: 12
    },
    card: {
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
    },
    tituloPost: {
        fontSize: 17,
        fontWeight: "bold",
        color: cores.escuro
    },
    autor: {
        color: cores.primaria,
        fontWeight: "bold",
        fontSize: 13,
        marginTop: 4
    },
    vazio: {
        textAlign: "center",
        color: cores.textoClaro,
        marginTop: 20
    }
})

export default Admin
