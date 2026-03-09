import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image as RNImage,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  ImageIcon,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSellerStore } from "../../store/userSellerStore";
import { useAuthStore } from "../../store/useAuthStore";
import { imageService } from "../../services/imageService";
import { sellerService } from "../../services/sellerService";

type RootStackParamList = {
  SellerVitrine: undefined;
  StoreSettings: undefined;
};

type StoreSettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StoreSettings"
>;

interface Props {
  navigation: StoreSettingsScreenNavigationProp;
}

export const StoreSettingsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const {
    storeName,
    storeDescription,
    storeLogo,
    pixKey,
    pixKeyType,
    setStoreInfo,
    setStoreLogo,
    setPixInfo,
  } = useSellerStore();

  // Form state
  const [name, setName] = useState(storeName || "");
  const [description, setDescription] = useState(storeDescription || "");
  const [logoUri, setLogoUri] = useState<string | null>(storeLogo || null);
  const [newPixKey, setNewPixKey] = useState(pixKey || "");
  const [newPixKeyType, setNewPixKeyType] = useState<
    "cpf" | "cnpj" | "email" | "phone" | "random"
  >(pixKeyType || "cpf");
  const [showPixKey, setShowPixKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Carregar dados do Firebase ao abrir
  useEffect(() => {
    loadStoreDataFromFirebase();
  }, [user?.id]);

  const loadStoreDataFromFirebase = async () => {
    if (!user?.id) {
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    try {
      const seller = await sellerService.getSeller(user.id);

      if (seller) {
        // Preencher formulário com dados salvos
        setName(seller.storeName || "");
        setDescription(seller.storeDescription || "");
        setLogoUri(seller.storeLogo || null);
        setNewPixKey(seller.pixKey || "");
        setNewPixKeyType(seller.pixKeyType || "cpf");

        // Sincronizar com Zustand
        setStoreInfo(seller.storeName, seller.storeOwner, seller.storeDescription);
        if (seller.storeLogo) {
          setStoreLogo(seller.storeLogo);
        }
        if (seller.pixKey) {
          setPixInfo(seller.pixKey, seller.pixKeyType);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePickLogo = async () => {
    try {
      const result = await imageService.pickImage();

      if (result) {
        if (!imageService.validateImageSize(result.fileSize, 5)) {
          Alert.alert("Erro", "A imagem deve ter no máximo 5MB");
          return;
        }

        setLogoUri(result.base64);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar imagem");
      console.error(error);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validação", "Preencha o nome da loja");
      return false;
    }

    if (!description.trim()) {
      Alert.alert("Validação", "Preencha a descrição da loja");
      return false;
    }

    if (!newPixKey.trim()) {
      Alert.alert("Validação", "Preencha a chave PIX");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    setIsLoading(true);

    try {
      // Salvar no Zustand (store local)
      setStoreInfo(name.trim(), user.name || "Vendedor", description.trim());
      setStoreLogo(logoUri);
      setPixInfo(newPixKey.trim(), newPixKeyType);

      // Salvar no Firebase usando sellerService
      await sellerService.setSeller(user.id, {
        storeName: name.trim(),
        storeDescription: description.trim(),
        storeOwner: user.name || "Vendedor",
        storeLogo: logoUri || undefined,
        pixKey: newPixKey.trim(),
        pixKeyType: newPixKeyType,
      });

      Alert.alert("Sucesso", "Configurações da loja atualizadas!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar configurações");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    Alert.alert("Copiar", `Chave PIX copiada!\n\n${text}`);
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando configurações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Configurações da Loja</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 120 + insets.bottom },
        ]}
      >
        {/* Logo Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logo da Loja</Text>

          <View style={styles.logoUploadContainer}>
            {logoUri ? (
              <View style={styles.logoPreviewContainer}>
                <RNImage
                  source={{ uri: logoUri }}
                  style={styles.logoPreview}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.logoPlaceholder}>
                <ImageIcon size={48} color={colors.mutedForeground} />
              </View>
            )}

            <TouchableOpacity
              style={styles.uploadButton}
              activeOpacity={0.8}
              onPress={handlePickLogo}
            >
              <Text style={styles.uploadButtonText}>
                {logoUri ? "Mudar logo" : "Escolher logo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Store Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nome da Loja</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Bijuteria Indígena"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            maxLength={100}
            editable={!isLoading}
          />
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição da Loja</Text>

          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Descreva sua loja e produtos..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        {/* PIX Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chave PIX</Text>

          {/* PIX Type Selector */}
          <View style={styles.pixTypeContainer}>
            {(
              [
                { label: "CPF", value: "cpf" as const },
                { label: "CNPJ", value: "cnpj" as const },
                { label: "Email", value: "email" as const },
                { label: "Telefone", value: "phone" as const },
                { label: "Aleatória", value: "random" as const },
              ] as const
            ).map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.pixTypeButton,
                  newPixKeyType === type.value && styles.pixTypeButtonActive,
                ]}
                onPress={() => setNewPixKeyType(type.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pixTypeButtonText,
                    newPixKeyType === type.value &&
                      styles.pixTypeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PIX Key Input */}
          <View style={styles.pixKeyContainer}>
            <TextInput
              style={[styles.input, styles.pixKeyInput]}
              placeholder={
                newPixKeyType === "cpf"
                  ? "123.456.789-00"
                  : newPixKeyType === "cnpj"
                    ? "12.345.678/0001-90"
                    : newPixKeyType === "email"
                      ? "seu@email.com"
                      : newPixKeyType === "phone"
                        ? "(11) 99999-9999"
                        : "Sua chave aleatória"
              }
              placeholderTextColor={colors.mutedForeground}
              value={newPixKey}
              onChangeText={setNewPixKey}
              secureTextEntry={!showPixKey}
              editable={!isLoading}
            />

            {newPixKey && (
              <TouchableOpacity
                onPress={() => setShowPixKey(!showPixKey)}
                activeOpacity={0.7}
                style={styles.pixVisibilityButton}
              >
                {showPixKey ? (
                  <EyeOff size={18} color={colors.mutedForeground} />
                ) : (
                  <Eye size={18} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Copy Button */}
          {newPixKey && (
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(newPixKey)}
              activeOpacity={0.7}
            >
              <Copy size={16} color={colors.primaryForeground} />
              <Text style={styles.copyButtonText}>Copiar chave PIX</Text>
            </TouchableOpacity>
          )}

          {/* PIX Info */}
          <View style={styles.pixInfoContainer}>
            <Text style={styles.pixInfoTitle}>Dica de PIX</Text>
            <Text style={styles.pixInfoText}>
              • CPF: Use seu CPF (formato: 123.456.789-00){"\n"}
              • CNPJ: Use o CNPJ da sua empresa{"\n"}
              • Email: Use um email cadastrado no PIX{"\n"}
              • Telefone: Use seu telefone cadastrado no PIX{"\n"}
              • Aleatória: Use sua chave aleatória do PIX
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Button
          title="Salvar Configurações"
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

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
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
  },

  section: {
    gap: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  // Logo Styles
  logoUploadContainer: {
    gap: 12,
  },

  logoPreviewContainer: {
    width: "100%",
    height: 160,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.primary,
  },

  logoPreview: {
    width: "100%",
    height: "100%",
  },

  logoPlaceholder: {
    width: "100%",
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },

  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: "center",
  },

  uploadButtonText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fontFamily.regular,
    color: colors.foreground,
    fontSize: 14,
    backgroundColor: colors.card,
  },

  textarea: {
    height: 100,
    textAlignVertical: "top",
  },

  // PIX Styles
  pixTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  pixTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pixTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  pixTypeButtonText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.mutedForeground,
  },

  pixTypeButtonTextActive: {
    color: colors.primaryForeground,
  },

  pixKeyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pixKeyInput: {
    flex: 1,
  },

  pixVisibilityButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },

  copyButtonText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  pixInfoContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  pixInfoTitle: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
    marginBottom: 8,
  },

  pixInfoText: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.mutedForeground,
    lineHeight: 18,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.border,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
  },
});