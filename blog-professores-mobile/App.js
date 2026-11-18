import { StatusBar } from "expo-status-bar"

import { AuthProvider } from "./src/context/AuthContext"
import Rotas from "./src/routes/Rotas"

export default function App() {
    return (
        <AuthProvider>
            <StatusBar style="light" />
            <Rotas />
        </AuthProvider>
    )
}
