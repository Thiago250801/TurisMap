import { useFonts } from 'expo-font';
import { AuthScreen } from './src/screens/AuthScreen';

export default function App() {
  const [loaded] = useFonts({
    "PlusJakartaSans-Bold": require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-Medium": require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-SemiBold": require("./assets/fonts/PlusJakartaSans-SemiBold.ttf")
  })
  
  if (!loaded) {
    return null;
  }
  
  return (
      <AuthScreen />
  );
}


