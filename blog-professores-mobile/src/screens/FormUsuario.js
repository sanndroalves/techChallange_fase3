import { useEffect, useLayoutEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native"

import Botao from "../components/Botao"
import CampoTexto from "../components/CampoTexto"
import MensagemErro from "../components/MensagemErro"
import { atualizarUsuario, buscarUsuario, criarUsuario } from "../services/api"
import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

// tela de cadastro e edicao de professor/aluno
// se vier um id nos params e edicao, senao e cadastro
function FormUsuario({ route, navigation }) {
    const { tipo, id } = route.params
    const { token } = useAuth()

    const rota = tipo === "professor" ? "professores" : "alunos"
    const editando = !!id

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(editando)
    const [salvando, setSalvando] = useState(false)

    useLayoutEffect(() => {
        const nomeTipo = tipo === "professor" ? "professor" : "aluno"

        navigation.setOptions({
            title: editando ? `Editar ${nomeTipo}` : `Cadastrar ${nomeTipo}`
        })
    }, [navigation, editando, tipo])

    useEffect(() => {
        if (!editando) {
            return
        }

        buscarUsuario(rota, id, token)
            .then((dados) => {
                setNome(dados.nome)
                setEmail(dados.email)
            })
            .catch((erro) => setErro(erro.message))
            .finally(() => setCarregando(false))
    }, [id])

    async function salvar() {
        if (nome.trim().length < 3) {
            setErro("O nome precisa ter pelo menos 3 caracteres.")
            return
        }

        if (!email.includes("@")) {
            setErro("Informe um e-mail válido.")
            return
        }

        // no cadastro a senha e obrigatoria, na edicao so se quiser trocar
        if ((!editando || senha) && senha.length < 6) {
            setErro("A senha precisa ter pelo menos 6 caracteres.")
            return
        }

        setErro("")
        setSalvando(true)

        const dados = {
            nome: nome.trim(),
            email: email.trim(),
            senha
        }

        try {
            if (editando) {
                await atualizarUsuario(rota, id, dados, token)
            } else {
                await criarUsuario(rota, dados, token)
            }

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
            <CampoTexto label="Nome" value={nome} onChangeText={setNome} maxLength={80} />

            <CampoTexto
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <CampoTexto
                label={editando ? "Nova senha" : "Senha"}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                placeholder={editando ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
            />

            {editando && (
                <Text style={styles.dica}>
                    Só preencha a senha se quiser trocar.
                </Text>
            )}

            <MensagemErro mensagem={erro} />

            <Botao
                titulo={editando ? "Salvar alterações" : "Cadastrar"}
                aoPressionar={salvar}
                carregando={salvando}
            />

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
    },
    dica: {
        color: cores.textoClaro,
        fontSize: 13,
        marginTop: -8,
        marginBottom: 16
    }
})

export default FormUsuario
