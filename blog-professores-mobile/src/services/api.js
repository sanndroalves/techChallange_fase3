const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000"

// funcao pra nao ficar repetindo o fetch em todo lugar
async function requisicao(caminho, metodo = "GET", corpo = null, token = null) {
    const headers = {
        "Content-Type": "application/json"
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const opcoes = {
        method: metodo,
        headers
    }

    if (corpo) {
        opcoes.body = JSON.stringify(corpo)
    }

    let resposta

    try {
        resposta = await fetch(`${API_URL}${caminho}`, opcoes)
    } catch (erro) {
        throw new Error("Não foi possível conectar com o servidor.")
    }

    // o delete devolve 204 sem corpo
    if (resposta.status === 204) {
        return null
    }

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro na requisição")
    }

    return dados
}

// ---------- LOGIN ----------

export function fazerLogin(email, senha) {
    return requisicao("/login", "POST", { email, senha })
}

// ---------- POSTS ----------

export function buscarPosts() {
    return requisicao("/posts")
}

export function pesquisarPosts(texto) {
    return requisicao(`/posts/busca?texto=${encodeURIComponent(texto)}`)
}

export function buscarPost(id) {
    return requisicao(`/posts/${id}`)
}

export function criarPost(post, token) {
    return requisicao("/posts", "POST", post, token)
}

export function atualizarPost(id, post, token) {
    return requisicao(`/posts/${id}`, "PUT", post, token)
}

export function excluirPost(id, token) {
    return requisicao(`/posts/${id}`, "DELETE", null, token)
}

// ---------- PROFESSORES E ALUNOS ----------
// rota = "professores" ou "alunos"

export function listarUsuarios(rota, pagina, token) {
    return requisicao(`/${rota}?pagina=${pagina}&limite=10`, "GET", null, token)
}

export function buscarUsuario(rota, id, token) {
    return requisicao(`/${rota}/${id}`, "GET", null, token)
}

export function criarUsuario(rota, usuario, token) {
    return requisicao(`/${rota}`, "POST", usuario, token)
}

export function atualizarUsuario(rota, id, usuario, token) {
    return requisicao(`/${rota}/${id}`, "PUT", usuario, token)
}

export function excluirUsuario(rota, id, token) {
    return requisicao(`/${rota}/${id}`, "DELETE", null, token)
}
