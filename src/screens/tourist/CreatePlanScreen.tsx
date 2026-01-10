import { StyleSheet, Text, View } from "react-native";

export const CreatePlanScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Create Plan Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});