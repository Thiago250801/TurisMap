import { StyleSheet, Text, View } from "react-native";

export const TouristHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Tourist Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
