import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { AppNavigator } from "./src/routes/AppNavigator";
import { useAuthStore } from "./src/store/useAuthStore";
import { colors } from "./src/theme";

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loaded] = useFonts({
    "PlusJakartaSans-Bold": require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-Medium": require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-SemiBold": require("./assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const { isAuthenticated, user, isLoading } = useAuthStore();
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Inicializar listener de autenticação
    initAuthListener();
    
    // Marcar que a inicialização foi feita
    const timer = setTimeout(() => {
      setAuthInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initAuthListener]);

  // Esperar fontes carregarem
  if (!loaded) {
    return null;
  }

  // Esperar autenticação inicializar
  if (!authInitialized || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated && user ? (
        // ✅ USUÁRIO AUTENTICADO - Mostrar aplicativo
        <AppNavigator />
      ) : (
        // ❌ USUÁRIO NÃO AUTENTICADO - Mostrar onboarding/auth
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}