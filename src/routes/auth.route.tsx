import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OnboardingScreen } from "../screens/OnboardingScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { AppStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
