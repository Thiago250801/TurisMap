import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, radius, fontFamily } from "../theme";
import { useAuthStore, UserType } from "../store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

type Step = "select" | "auth";
type AuthMode = "login" | "register";

export const AuthScreen = ({ navigation }: Props) => {
  const { login, register, isLoading } = useAuthStore();

  // Form State
  const [step, setStep] = useState<Step>("select");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setStep("auth");
    resetForm();
  };

  const handleSubmit = async () => {
    if (!userType) {
      Alert.alert("Erro", "Selecione o tipo de usuário");
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert("Validação", "Preencha email e senha");
      return;
    }

    if (authMode === "register" && !name.trim()) {
      Alert.alert("Validação", "Preencha seu nome completo");
      return;
    }

    try {
      if (authMode === "login") {
        await login(email, password, userType);
      } else {
        await register(email, password, name, userType);
      }

      // ✅ NÃO NAVEGUE AQUI!
      // O App.tsx vai detectar isAuthenticated = true e mudar a navegação automaticamente
      // Apenas aguarde um momento para o App.tsx reagir
      
      // Opcional: Mostrar mensagem de sucesso
      // Alert.alert("Sucesso", "Bem-vindo ao TurisMap!");
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  };

  const handleGoBack = () => {
    resetForm();
    setStep("select");
    setUserType(null);
  };

  // Step 1: User Type Selection
  if (step === "select") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            turis<Text style={styles.logoPrimary}>map</Text>
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Como você quer usar o Turismap?
        </Text>

        {/* Tourist Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectUserType("tourist")}
          activeOpacity={0.8}
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

        {/* Seller Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectUserType("seller")}
          activeOpacity={0.8}
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
      </SafeAreaView>
    );
  }

  // Step 2: Login/Register Form
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {userType === "tourist" ? "Área do Turista" : "Área do Comerciante"}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Avatar */}
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
            style={[
              styles.tab,
              authMode === "login" && styles.tabActive,
            ]}
            onPress={() => {
              setAuthMode("login");
              resetForm();
            }}
          >
            <Text style={styles.tabText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              authMode === "register" && styles.tabActive,
            ]}
            onPress={() => {
              setAuthMode("register");
              resetForm();
            }}
          >
            <Text style={styles.tabText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Field (Register Only) */}
          {authMode === "register" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color={colors.mutedForeground} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor={colors.mutedForeground}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>
            </View>
          )}

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={18} color={colors.mutedForeground} />
                ) : (
                  <Eye size={18} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {authMode === "login" ? "Entrar" : "Continuar"}
                </Text>
                <ArrowRight size={18} color={colors.primaryForeground} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Step 1: Select
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

  subtitle: {
    textAlign: "center",
    color: colors.mutedForeground,
    marginHorizontal: 24,
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
    marginHorizontal: 24,
    marginBottom: 16,
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
    fontSize: 14,
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

  // Step 2: Auth
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
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
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.muted,
    gap: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  tabText: {
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  form: {
    paddingHorizontal: 24,
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
    fontSize: 14,
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
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
});