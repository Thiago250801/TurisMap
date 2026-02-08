import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/useAuthStore";
import { TouristNavigator } from "./TouristNavigator";
import { SellerNavigator } from "./SellerNavigator";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { AuthScreen } from "../screens/AuthScreen";

type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = useAuthStore((state) => state.userType);

  // IMPORTANT: Do not include a NavigationContainer here.
  // The root `App.tsx` already provides a single `NavigationContainer`.
  // Return navigators/screens directly so we don't nest containers.

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    );
  }

  if (userType === "tourist") {
    return <TouristNavigator />;
  }

  if (userType === "seller") {
    return <SellerNavigator />;
  }

  return null;
};
