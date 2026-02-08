import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Search, Heart, User, Map } from "lucide-react-native";
import { colors } from "../theme";

// Screens
import { SearchScreen } from "../screens/tourist/SearchScreen";
import { FavoritesScreen } from "../screens/tourist/FavoritesScreen";
import { AccountScreen } from "../screens/tourist/AccountScreen";
import { PlaceDetailsScreen } from "../screens/tourist/PlaceDetailsScreen";
import { ProductDetailsScreen } from "../screens/tourist/ProductDetailsScreen";
import { TouristHomeScreen } from "../screens/tourist/TouristHomeScreen";
import { CreatePlanScreen } from "../screens/tourist/CreatePlanScreen";
import { PlansScreen } from "../screens/tourist/PlansScreen";

type TouristTabsParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  PlansTab: undefined;
  FavoritesTab: undefined;
  AccountTab: undefined;
};

type TouristStackParamList = {
  TouristTabs: undefined;
  Place: { id: string };
  Product: { id: string };
  CreatePlan: { id?: string } | undefined;
};

const Tab = createBottomTabNavigator<TouristTabsParamList>();
const Stack = createNativeStackNavigator<TouristStackParamList>();

const TouristTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={TouristHomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PlansTab"
        component={PlansScreen}
        options={{
          title: "Meus Roteiros",
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{
          title: "Conta",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const TouristNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TouristTabs" component={TouristTabsNavigator} />
      
      {/* Place/Product details */}
      <Stack.Screen name="Place" component={PlaceDetailsScreen} />
      <Stack.Screen name="Product" component={ProductDetailsScreen} />
      
      {/* Create/Edit Plan */}
      <Stack.Screen name="CreatePlan" component={CreatePlanScreen} />
    </Stack.Navigator>
  );
};