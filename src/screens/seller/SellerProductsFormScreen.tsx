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
import { ArrowLeft, ImageIcon, Camera, Trash2, MapPin } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSellerStore } from "../../store/userSellerStore";
import { useAuthStore } from "../../store/useAuthStore";
import { imageService } from "../../services/imageService";
import { SellerProductsStackParamList } from "../../routes/types";
import { suggestions, popularPlaces } from "../../data/mockData";

type NavigationProp = NativeStackNavigationProp<
  SellerProductsStackParamList,
  "SellerProductForm"
>;

type ScreenRouteProp = RouteProp<
  SellerProductsStackParamList,
  "SellerProductForm"
>;

interface Props {
  navigation: NavigationProp;
  route: ScreenRouteProp;
}

export const SellerProductFormScreen = ({ navigation, route }: Props) => {
  const { id: productId } = route.params || {};
  const isEditing = !!productId;

  const { user } = useAuthStore();
  const { products, addProduct, updateProduct, deleteProduct, isLoading } =
    useSellerStore();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(
    route.params?.placeId || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar lugares únicos para a lista de vinculação
  const allPlaces = [...suggestions, ...popularPlaces].filter((p, i, self) =>
    i === self.findIndex((x) => x.id === p.id),
  );

  useEffect(() => {
    if (isEditing && productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setTitle(product.title);
        setPrice(product.price.toString());
        setDescription(product.description);
        setImageUri(product.image || null);
        // Preenche o lugar vinculado se existir
        setPlaceId(
          (product as any).placeIds && (product as any).placeIds.length > 0
            ? (product as any).placeIds[0]
            : null,
        );
      }
    }
  }, [productId, products, isEditing]);

  const handlePickImage = async () => {
    try {
      const result = await imageService.pickImage();
      if (result) {
        if (!imageService.validateImageSize(result.fileSize, 5)) {
          Alert.alert("Erro", "A imagem deve ter no máximo 5MB");
          return;
        }
        setImageUri(result.base64);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar imagem");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await imageService.takePhoto();
      if (result) {
        if (!imageService.validateImageSize(result.fileSize, 5)) {
          Alert.alert("Erro", "A imagem deve ter no máximo 5MB");
          return;
        }
        setImageUri(result.base64);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao tirar foto");
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
    if (!user?.id || !user?.name) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    // Validações Obrigatórias
    if (!title.trim()) {
      Alert.alert("Validação", "Preencha o nome do produto");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Validação", "Preencha o preço");
      return;
    }

    const priceNum = parseFloat(price.replace(",", "."));
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Validação", "Preço deve ser um número válido maior que zero");
      return;
    }

    // NOVA VALIDAÇÃO OBRIGATÓRIA: Lugar
    if (!placeId) {
      Alert.alert("Validação", "Você deve vincular este produto a um lugar/ponto turístico.");
      return;
    }

    setIsSubmitting(true);

    try {
      const linkedPlaceIds = [placeId]; // Agora sempre terá um ID

      if (isEditing && productId) {
        await updateProduct(productId, {
          title: title.trim(),
          price: priceNum,
          description: description.trim(),
          image: imageUri || undefined,
          placeIds: linkedPlaceIds,
        });
        Alert.alert("Sucesso", "Produto atualizado!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await addProduct(user.id, user.name, {
          title: title.trim(),
          price: priceNum,
          description: description.trim(),
          image: imageUri || undefined,
          available: true,
          placeIds: linkedPlaceIds,
        });
        Alert.alert("Sucesso", "Produto cadastrado!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!productId) return;
    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert("Sucesso", "Produto excluído!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Erro", "Falha ao excluir produto");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar Produto" : "Novo Produto"}
        </Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
            <Trash2 size={22} color={colors.destructive} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Imagem */}
        <View style={styles.imageSection}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <RNImage source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                <Trash2 size={18} color={colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImageIcon size={48} color={colors.mutedForeground} />
              <Text style={styles.imagePlaceholderText}>Adicione uma imagem</Text>
            </View>
          )}

          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage} activeOpacity={0.8}>
              <ImageIcon size={18} color={colors.primaryForeground} />
              <Text style={styles.imageButtonText}>Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.imageButton, styles.imageButtonOutline]} onPress={handleTakePhoto} activeOpacity={0.8}>
              <Camera size={18} color={colors.primary} />
              <Text style={[styles.imageButtonText, styles.imageButtonTextOutline]}>Câmera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nome do Produto */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do produto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Colar artesanal Dessana"
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Preço */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Preço (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="89,90"
            placeholderTextColor={colors.mutedForeground}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Descrição */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Descreva seu produto..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Vincular ao Lugar - OBRIGATÓRIO */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
             <Text style={styles.label}>Vincular ao lugar *</Text>
             {placeId && <Text style={styles.selectedBadge}>Selecionado</Text>}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesList}
          >
            {allPlaces.map((p) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                onPress={() => setPlaceId(p.id)} // Removido toggle (clicar de novo não desmarca, apenas muda)
                style={[
                  styles.placeItem,
                  placeId === p.id ? styles.placeItemSelected : null,
                ]}
              >
                <MapPin size={14} color={placeId === p.id ? colors.primaryForeground : colors.mutedForeground} style={{marginRight: 4}} />
                <Text
                  style={[
                    styles.placeItemText,
                    placeId === p.id ? styles.placeItemTextSelected : null,
                  ]}
                >
                  {p.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={
            isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar Alterações"
                : "Cadastrar Produto"
          }
          onPress={handleSubmit}
          disabled={isSubmitting || isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontFamily: fontFamily.semiBold, color: colors.foreground },
  content: { paddingHorizontal: 16, paddingVertical: 16, gap: 20, paddingBottom: 120 },
  imageSection: { gap: 12 },
  imagePreviewContainer: { position: "relative" },
  imagePreview: { width: "100%", height: 200, borderRadius: radius.xl, backgroundColor: colors.muted },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.destructive,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: radius.xl,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  imagePlaceholderText: { fontSize: 14, color: colors.mutedForeground, fontFamily: fontFamily.medium },
  imageButtons: { flexDirection: "row", gap: 12 },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
  },
  imageButtonOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.primary },
  imageButtonText: { color: colors.primaryForeground, fontFamily: fontFamily.semiBold, fontSize: 14 },
  imageButtonTextOutline: { color: colors.primary },
  formGroup: { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, fontFamily: fontFamily.medium, color: colors.foreground },
  selectedBadge: { fontSize: 11, color: colors.primary, fontFamily: fontFamily.bold },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: fontFamily.regular,
    color: colors.foreground,
    fontSize: 14,
    backgroundColor: colors.card,
  },
  textarea: { height: 120, textAlignVertical: "top" },
  charCount: { fontSize: 12, color: colors.mutedForeground, fontFamily: fontFamily.regular, textAlign: "right", marginTop: 4 },
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
  placesList: { paddingVertical: 8, gap: 8 },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  placeItemSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  placeItemText: { fontSize: 14, color: colors.foreground, fontFamily: fontFamily.regular },
  placeItemTextSelected: { color: colors.primaryForeground, fontFamily: fontFamily.semiBold },
});