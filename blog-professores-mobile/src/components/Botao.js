import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native"

import cores from "../styles/cores"

// tipo: "primario", "perigo" ou "secundario"
function Botao({ titulo, aoPressionar, tipo = "primario", carregando = false, desabilitado = false, estilo }) {
    let corFundo = cores.primaria

    if (tipo === "perigo") {
        corFundo = cores.perigo
    } else if (tipo === "secundario") {
        corFundo = cores.cinza
    }

    const bloqueado = desabilitado || carregando

    return (
        <Pressable
            onPress={aoPressionar}
            disabled={bloqueado}
            accessibilityRole="button"
            accessibilityLabel={titulo}
            style={({ pressed }) => [
                styles.botao,
                { backgroundColor: corFundo },
                pressed && { opacity: 0.8 },
                bloqueado && { opacity: 0.6 },
                estilo
            ]}
        >
            {carregando ? (
                <ActivityIndicator color={cores.branco} />
            ) : (
                <Text style={styles.texto}>{titulo}</Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    botao: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    texto: {
        color: cores.branco,
        fontWeight: "bold",
        fontSize: 15
    }
})

export default Botao
