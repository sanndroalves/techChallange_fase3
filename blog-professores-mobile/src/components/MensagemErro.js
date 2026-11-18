import { StyleSheet, Text } from "react-native"

import cores from "../styles/cores"

function MensagemErro({ mensagem }) {
    if (!mensagem) {
        return null
    }

    return (
        <Text style={styles.erro} accessibilityRole="alert">
            {mensagem}
        </Text>
    )
}

const styles = StyleSheet.create({
    erro: {
        color: cores.perigo,
        backgroundColor: cores.erroFundo,
        borderWidth: 1,
        borderColor: cores.erroBorda,
        padding: 10,
        borderRadius: 8,
        marginBottom: 16
    }
})

export default MensagemErro
