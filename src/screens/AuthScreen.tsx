import {
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { colors, radius, shadow } from "../theme/theme";
import { fontFamily } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../routes/types";

type Step = "select" | "auth";
type UserType = "tourist" | "seller";

type Props = NativeStackScreenProps<AppStackParamList, "Auth">;

export const AuthScreen = ({navigation}: Props) => {
  const [step, setStep] = useState<Step>("select");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  if (step === "select") {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            turis<Text style={styles.logoPrimary}>map</Text>
          </Text>
        </View>

        <Text style={styles.subtitle}>Como você quer usar o Turismap?</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            setUserType("tourist");
            setStep("auth");
          }}
        >
          <View style={styles.iconCardPrimary}>
            <User size={32} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Sou Turista</Text>
            <Text style={styles.cardText}>
              Explore pontos turísticos e experiências incríveis.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            setUserType("seller");
            setStep("auth");
          }}
        >
          <View style={styles.iconCardAccent}>
            <Store size={32} color={colors.accent} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Sou Comerciante</Text>
            <Text style={styles.cardText}>
              Cadastre produtos e experiências para turistas.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep("select")}>
          <ChevronLeft size={24} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {userType === "tourist" ? "Área do Turista" : "Área do Comerciante"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          {userType === "tourist" ? (
            <View style={styles.iconCardPrimary}>
              <User size={36} color={colors.primary} />
            </View>
          ) : (
            <View style={styles.iconCardAccent}>
              <Store size={36} color={colors.accent} />
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, authMode === "login" && styles.tabActive]}
            onPress={() => setAuthMode("login")}
          >
            <Text style={styles.tabText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, authMode === "register" && styles.tabActive]}
            onPress={() => setAuthMode("register")}
          >
            <Text style={styles.tabText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {authMode === "register" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color={colors.mutedForeground} />
                ) : (
                  <Eye size={18} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (userType === "tourist") {
                navigation.replace("TouristTabs");
              }
          
              if (userType === "seller") {
                navigation.replace("SellerTabs");
              }
            }}
          >
            <Text style={styles.buttonText}>
              {authMode === "login" ? "Entrar" : "Continuar"}
            </Text>
            <ArrowRight size={18} color={colors.primaryForeground} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
  },

  logo: {
    fontSize: 32,
    color: colors.foreground,
    fontFamily: fontFamily.bold,
  },

  logoPrimary: {
    color: colors.primary,
  },

  iconCardPrimary: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  iconCardAccent: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  subtitle: {
    textAlign: "center",
    color: colors.mutedForeground,
    marginBottom: 24,
    fontFamily: fontFamily.medium,
  },

  card: {
    flexDirection: "row",
    gap: 16,
    padding: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadow.card,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
  },

  cardText: {
    color: colors.mutedForeground,
    marginTop: 4,
    fontFamily: fontFamily.medium,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 18,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
  },

  content: {
    paddingBottom: 40,
  },

  avatar: {
    alignSelf: "center",
    marginVertical: 20,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.muted,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    margin: 4,
  },

  tabActive: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  tabText: {
    color: colors.secondaryForeground,
    fontFamily: fontFamily.semiBold,
  },

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: fontFamily.medium,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
  },

  input: {
    flex: 1,
    color: colors.foreground,
    fontFamily: fontFamily.regular,
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    marginTop: 12,
    ...shadow.card,
  },

  buttonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
});
