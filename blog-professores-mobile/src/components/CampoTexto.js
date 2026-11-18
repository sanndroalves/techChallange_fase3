import { StyleSheet, Text, TextInput, View } from "react-native"

import cores from "../styles/cores"

function CampoTexto({ label, multilinha = false, ...props }) {
    return (
        <View style={styles.campo}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                style={[styles.input, multilinha && styles.multilinha]}
                multiline={multilinha}
                accessibilityLabel={label}
                placeholderTextColor={cores.textoClaro}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    campo: {
        marginBottom: 16
    },
    label: {
        fontWeight: "bold",
        color: cores.texto,
        marginBottom: 6
    },
    input: {
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: cores.escuro
    },
    multilinha: {
        minHeight: 160,
        textAlignVertical: "top"
    }
})

export default CampoTexto
