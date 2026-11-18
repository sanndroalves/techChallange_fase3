import { useCallback, useState } from "react"
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import Botao from "../components/Botao"
import MensagemErro from "../components/MensagemErro"
import { excluirUsuario, listarUsuarios } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

// essa mesma tela e usada pra listar professores e alunos
// o tipo vem pelo route.params (ver Rotas.js)
function ListaUsuarios({ route, navigation }) {
    const { tipo } = route.params
    const { token, usuario } = useAuth()

    const rota = tipo === "professor" ? "professores" : "alunos"
    const nomeTipo = tipo === "professor" ? "professor" : "aluno"

    const [usuarios, setUsuarios] = useState([])
    const [pagina, setPagina] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [total, setTotal] = useState(0)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function carregar(paginaAtual) {
        setCarregando(true)
        setErro("")

        try {
            const resposta = await listarUsuarios(rota, paginaAtual, token)

            // se excluiu o ultimo da pagina, volta uma pagina
            if (resposta.dados.length === 0 && paginaAtual > 1) {
                setPagina(paginaAtual - 1)
                return
            }

            setUsuarios(resposta.dados)
            setTotalPaginas(resposta.totalPaginas)
            setTotal(resposta.total)
        } catch (erro) {
            setErro(erro.message)
        } finally {
            setCarregando(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            carregar(pagina)
        }, [pagina])
    )

    function confirmarExclusao(item) {
        Alert.alert(
            `Excluir ${nomeTipo}`,
            `Deseja realmente excluir ${item.nome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => excluir(item._id) }
            ]
        )
    }

    async function excluir(id) {
        try {
            await excluirUsuario(rota, id, token)
            carregar(pagina)
        } catch (erro) {
            setErro(erro.message)
        }
    }

    return (
        <View style={styles.container}>
            <Botao
                titulo={`+ Cadastrar ${nomeTipo}`}
                aoPressionar={() => navigation.navigate("FormUsuario", { tipo })}
                estilo={{ marginBottom: 12 }}
            />

            <Text style={styles.total}>{total} cadastrado(s)</Text>

            <MensagemErro mensagem={erro} />

            {carregando ? (
                <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={<Text style={styles.vazio}>Nenhum {nomeTipo} cadastrado.</Text>}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.nome}>{item.nome}</Text>
                            <Text style={styles.email}>{item.email}</Text>

                            <View style={styles.linhaBotoes}>
                                <Botao
                                    titulo="Editar"
                                    aoPressionar={() => navigation.navigate("FormUsuario", { tipo, id: item._id })}
                                    estilo={{ flex: 1 }}
                                />

                                {/* nao deixa o professor logado se excluir */}
                                {item._id !== usuario?.id && (
                                    <Botao
                                        titulo="Excluir"
                                        tipo="perigo"
                                        aoPressionar={() => confirmarExclusao(item)}
                                        estilo={{ flex: 1 }}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                />
            )}

            {/* paginacao */}
            <View style={styles.paginacao}>
                <Botao
                    titulo="Anterior"
                    tipo="secundario"
                    desabilitado={pagina <= 1 || carregando}
                    aoPressionar={() => setPagina(pagina - 1)}
                    estilo={{ flex: 1 }}
                />

                <Text style={styles.textoPagina}>
                    {pagina} / {totalPaginas}
                </Text>

                <Botao
                    titulo="Próxima"
                    tipo="secundario"
                    desabilitado={pagina >= totalPaginas || carregando}
                    aoPressionar={() => setPagina(pagina + 1)}
                    estilo={{ flex: 1 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        padding: 16
    },
    total: {
        color: cores.textoClaro,
        marginBottom: 10
    },
    card: {
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
    },
    nome: {
        fontSize: 17,
        fontWeight: "bold",
        color: cores.escuro
    },
    email: {
        color: cores.textoClaro,
        marginTop: 2
    },
    linhaBotoes: {
        flexDirection: "row",
        gap: 10,
        marginTop: 12
    },
    paginacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingTop: 10
    },
    textoPagina: {
        fontWeight: "bold",
        color: cores.texto
    },
    vazio: {
        textAlign: "center",
        color: cores.textoClaro,
        marginTop: 20
    }
})

export default ListaUsuarios
