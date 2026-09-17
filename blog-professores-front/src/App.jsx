import { BrowserRouter, Routes, Route } from "react-router-dom"

import { AuthProvider } from "./context/AuthProvider"

import Cabecalho from "./components/Cabecalho"
import RotaPrivada from "./components/RotaPrivada"

import Home from "./pages/Home"
import Post from "./pages/Post"
import Login from "./pages/Login"
import CriarPost from "./pages/CriarPost"
import EditarPost from "./pages/EditarPost"
import Admin from "./pages/Admin"

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Cabecalho />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:id" element={<Post />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/criar-post"
                        element={
                            <RotaPrivada>
                                <CriarPost />
                            </RotaPrivada>
                        }
                    />

                    <Route
                        path="/editar-post/:id"
                        element={
                            <RotaPrivada>
                                <EditarPost />
                            </RotaPrivada>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <RotaPrivada>
                                <Admin />
                            </RotaPrivada>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App