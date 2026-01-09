import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { OnboardingScreen } from "../screens/OnboardingScreen";
import { AuthScreen } from "../screens/AuthScreen";

import { AppStackParamList } from "./types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors } from "../theme";
import { Heart, MapPin, Search, User } from "lucide-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { TouristHomeScreen } from "../screens/tourist/TouristHomeScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="TouristTabs" component={TouristTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator<AppStackParamList>();

export const TouristTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="TouristTabs"
        component={TouristHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MapPin color={focused ? colors.primary : colors.mutedForeground} />
          ),
        }}
      />

      <Tab.Screen
        name="SearchScreen"
        component={Dummy}
        options={{
          tabBarIcon: ({ focused }) => (
            <Search color={focused ? colors.primary : colors.mutedForeground} />
          ),
        }}
      />

      <Tab.Screen
        name="FavoritesScreen"
        component={Dummy}
        options={{
          tabBarIcon: ({ focused }) => (
            <Heart color={focused ? colors.primary : colors.mutedForeground} />
          ),
        }}
      />

      <Tab.Screen
        name="AccountScreen"
        component={Dummy}
        options={{
          tabBarIcon: ({ focused }) => (
            <User color={focused ? colors.primary : colors.mutedForeground} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Dummy = () => null;