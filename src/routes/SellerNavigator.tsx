import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Store, Package, User } from "lucide-react-native";
import { colors } from "../theme";

import { SellerVitrineScreen } from "../screens/seller/SellerVitrineScreen";
import { SellerProductsScreen } from "../screens/seller/SellerProductsScreen";
import { SellerProductFormScreen } from "../screens/seller/SellerProductsFormScreen";
import { SellerAccountScreen } from "../screens/seller/SellerAccountScreen";

import {
  SellerTabsParamList,
  SellerProductsStackParamList,
  SellerStackParamList,
} from "./types";

const Tab = createBottomTabNavigator<SellerTabsParamList>();
const ProductsStack =
  createNativeStackNavigator<SellerProductsStackParamList>();
const Stack = createNativeStackNavigator<SellerStackParamList>();

const SellerProductsStackNavigator = () => (
  <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
    <ProductsStack.Screen
      name="SellerProducts"
      component={SellerProductsScreen}
    />
    <ProductsStack.Screen
      name="SellerProductForm"
      component={SellerProductFormScreen}
    />
  </ProductsStack.Navigator>
);

const SellerTabsNavigator = () => (
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
      name="VitrineTab"
      component={SellerVitrineScreen}
      options={{
        title: "Vitrine",
        tabBarIcon: ({ color, size }) => (
          <Store size={size} color={color} />
        ),
      }}
    />

    <Tab.Screen
      name="ProductsTab"
      component={SellerProductsStackNavigator}
      options={{
        title: "Produtos",
        tabBarIcon: ({ color, size }) => (
          <Package size={size} color={color} />
        ),
      }}
    />

    <Tab.Screen
      name="AccountTab"
      component={SellerAccountScreen}
      options={{
        title: "Conta",
        tabBarIcon: ({ color, size }) => (
          <User size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export const SellerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellerTabs" component={SellerTabsNavigator} />
  </Stack.Navigator>
);
