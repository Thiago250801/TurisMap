import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { colors, fontFamily, radius } from "../theme";

type Props = {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
};

export const FormInput = ({ control, name, label, placeholder }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.input,
                error && { borderColor: colors.destructive },
              ]}
            />

            {error && (
              <Text style={styles.error}>{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  label: {
    fontFamily: fontFamily.medium,
    color: colors.foreground,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    color: colors.foreground,
    fontFamily: fontFamily.regular,
  },

  error: {
    color: colors.destructive,
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
});
