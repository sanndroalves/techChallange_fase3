import { useCallback, useLayoutEffect, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import CardPost from "../components/CardPost"
import Botao from "../components/Botao"
import MensagemErro from "../components/MensagemErro"
import { buscarPosts, pesquisarPosts } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

function Home({ navigation }) {
    const { autenticado, ehProfessor, usuario, logout } = useAuth()

    const [posts, setPosts] = useState([])
    const [busca, setBusca] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [atualizando, setAtualizando] = useState(false)
    const [erro, setErro] = useState("")

    // botao de entrar/sair la no cabecalho
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={() => {
                        if (autenticado) {
                            logout()
                        } else {
                            navigation.navigate("Login")
                        }
                    }}
                    accessibilityRole="button"
                >
                    <Text style={styles.botaoCabecalho}>
                        {autenticado ? "Sair" : "Entrar"}
                    </Text>
                </Pressable>
            )
        })
    }, [navigation, autenticado])

    async function carregarPosts() {
        setErro("")

        try {
            let dados

            if (busca.trim() !== "") {
                dados = await pesquisarPosts(busca.trim())
            } else {
                dados = await buscarPosts()
            }

            // mais novos primeiro
            dados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

            setPosts(dados)
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setCarregando(false)
            setAtualizando(false)
        }
    }

    // roda quando a tela abre, quando volta pra ela (ex: depois de criar um post)
    // e quando muda a busca. O timer espera parar de digitar antes de chamar a api
    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                carregarPosts()
            }, 400)

            return () => clearTimeout(timer)
        }, [busca])
    )

    function atualizar() {
        setAtualizando(true)
        carregarPosts()
    }

    return (
        <View style={styles.container}>
            {autenticado && (
                <View style={styles.boasVindas}>
                    <Text style={styles.textoBoasVindas}>
                        Olá, {usuario?.nome} ({ehProfessor ? "professor" : "aluno"})
                    </Text>

                    {ehProfessor && (
                        <Botao
                            titulo="Área do professor"
                            aoPressionar={() => navigation.navigate("Admin")}
                            estilo={{ marginTop: 10 }}
                        />
                    )}
                </View>
            )}

            <TextInput
                style={styles.busca}
                placeholder="Buscar posts..."
                placeholderTextColor={cores.textoClaro}
                value={busca}
                onChangeText={setBusca}
                accessibilityLabel="Buscar posts"
                returnKeyType="search"
            />

            <MensagemErro mensagem={erro} />

            {carregando ? (
                <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <CardPost
                            post={item}
                            aoPressionar={() => navigation.navigate("Post", { id: item._id })}
                        />
                    )}
                    refreshing={atualizando}
                    onRefresh={atualizar}
                    ListEmptyComponent={
                        <Text style={styles.vazio}>
                            {busca ? "Nenhum post encontrado para essa busca." : "Nenhum post publicado ainda."}
                        </Text>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        padding: 16
    },
    botaoCabecalho: {
        color: cores.branco,
        fontWeight: "bold",
        fontSize: 15
    },
    boasVindas: {
        marginBottom: 12
    },
    textoBoasVindas: {
        color: cores.texto,
        fontSize: 15
    },
    busca: {
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16
    },
    vazio: {
        textAlign: "center",
        color: cores.textoClaro,
        marginTop: 30
    }
})

export default Home
