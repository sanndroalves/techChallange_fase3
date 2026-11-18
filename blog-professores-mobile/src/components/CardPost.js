import { Pressable, StyleSheet, Text } from "react-native"

import cores from "../styles/cores"

function CardPost({ post, aoPressionar }) {
    // mostra so um pedaco do conteudo na lista
    const resumo = post.conteudo.length > 120
        ? post.conteudo.substring(0, 120) + "..."
        : post.conteudo

    return (
        <Pressable
            onPress={aoPressionar}
            accessibilityRole="button"
            accessibilityHint="Abre o post completo"
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
        >
            <Text style={styles.titulo}>{post.titulo}</Text>
            <Text style={styles.autor}>Por {post.autor}</Text>
            <Text style={styles.resumo}>{resumo}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.branco,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: cores.borda
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.escuro,
        marginBottom: 4
    },
    autor: {
        color: cores.primaria,
        fontWeight: "bold",
        fontSize: 13,
        marginBottom: 8
    },
    resumo: {
        color: cores.textoClaro,
        lineHeight: 20
    }
})

export default CardPost
