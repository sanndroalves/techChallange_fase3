const API_URL = "http://localhost:3000"

export async function buscarPosts() {
    const resposta = await fetch(`${API_URL}/posts`)

    if (!resposta.ok) {
        throw new Error("Erro ao buscar posts")
    }

    return resposta.json()
}

export async function buscarPost(id) {
    const resposta = await fetch(`${API_URL}/posts/${id}`)

    if (!resposta.ok) {
        throw new Error("Erro ao buscar post")
    }

    return resposta.json()
}

export async function fazerLogin(email, senha) {
    const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            senha
        })
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao fazer login")
    }

    return dados
}

export async function criarPost(post, token) {
    const resposta = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(post)
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao criar post")
    }

    return dados
}

export async function atualizarPost(id, post, token) {
    const resposta = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(post)
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao atualizar post")
    }

    return dados
}

export async function excluirPost(id, token) {
    const resposta = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao excluir post")
    }

    return dados
}