import { ActivityIndicator, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAuth } from "../context/AuthContext"
import cores from "../styles/cores"

import Home from "../screens/Home"
import Post from "../screens/Post"
import Login from "../screens/Login"
import Admin from "../screens/Admin"
import CriarPost from "../screens/CriarPost"
import EditarPost from "../screens/EditarPost"
import ListaUsuarios from "../screens/ListaUsuarios"
import FormUsuario from "../screens/FormUsuario"

const Stack = createNativeStackNavigator()

function Rotas() {
    const { carregando, ehProfessor } = useAuth()

    // espera ler o AsyncStorage antes de montar as rotas
    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" color={cores.primaria} />
            </View>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: cores.escuro },
                    headerTintColor: cores.branco,
                    headerTitleStyle: { fontWeight: "bold" }
                }}
            >
                {/* telas abertas pra todo mundo */}
                <Stack.Screen name="Home" component={Home} options={{ title: "Blog dos Professores" }} />
                <Stack.Screen name="Post" component={Post} options={{ title: "Post" }} />
                <Stack.Screen name="Login" component={Login} options={{ title: "Login" }} />

                {/* essas telas so existem se for professor logado,
                    entao aluno ou visitante nem consegue navegar pra elas */}
                {ehProfessor && (
                    <>
                        <Stack.Screen name="Admin" component={Admin} options={{ title: "Área do Professor" }} />
                        <Stack.Screen name="CriarPost" component={CriarPost} options={{ title: "Novo Post" }} />
                        <Stack.Screen name="EditarPost" component={EditarPost} options={{ title: "Editar Post" }} />
                        <Stack.Screen
                            name="Professores"
                            component={ListaUsuarios}
                            initialParams={{ tipo: "professor" }}
                            options={{ title: "Professores" }}
                        />
                        <Stack.Screen
                            name="Alunos"
                            component={ListaUsuarios}
                            initialParams={{ tipo: "aluno" }}
                            options={{ title: "Alunos" }}
                        />
                        <Stack.Screen name="FormUsuario" component={FormUsuario} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Rotas
