import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { colors, radius } from "../theme";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Pesquisar..." }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search
        size={18}
        color={colors.mutedForeground}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChange} 
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  input: {
    height: 44,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingLeft: 40, 
    paddingRight: 16,
    color: colors.foreground,
    fontSize: 16,
  },
});