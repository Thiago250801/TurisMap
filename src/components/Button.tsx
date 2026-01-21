import { Pressable, Text, StyleSheet } from "react-native";
import { colors, fontFamily, radius } from "../theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export const Button = ({ title, onPress, disabled }: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
});
