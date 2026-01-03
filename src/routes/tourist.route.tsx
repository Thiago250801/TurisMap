import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouristHomeScreen } from "../screens/tourist/TouristHomeScree";
import { AppStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function TouristRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TouristHome" component={TouristHomeScreen} />
    </Stack.Navigator>
  );
}
