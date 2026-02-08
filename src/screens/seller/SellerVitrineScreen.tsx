import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { Store, Package, Plus, Edit, Settings } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSellerStore } from "../../store/userSellerStore";
import { useAuthStore } from "../../store/useAuthStore";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  SellerProductsStackParamList,
  SellerTabsParamList,
} from "../../routes/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

type SellerVirineNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<SellerTabsParamList, "VitrineTab">,
  NativeStackNavigationProp<SellerProductsStackParamList>
>;

interface Props {
  navigation: SellerVirineNavigationProp;
}

export const SellerVitrineScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { products, updateProduct, loadProducts, isLoading, setStoreInfo, setStoreLogo } = useSellerStore();

  // Estados para dados da loja do Firebase
  const [storeName, setStoreName] = useState("Sua Loja");
  const [storeDescription, setStoreDescription] = useState("Clique em ⚙️ para adicionar descrição");
  const [storeLogo, setStoreLogoState] = useState<string | null>(null);
  const [loadingStore, setLoadingStore] = useState(false);
  
  // Usar ref para armazenar função de unsubscribe
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Se não tem usuário, para o listener e retorna
    if (!user?.id) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    // Se tem usuário, carrega produtos e setup listener
    loadProducts(user.id);
    setupRealtimeListener();

    // Cleanup ao desmontar
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user?.id]);

  // Listener em tempo real do Firebase
  const setupRealtimeListener = () => {
    // Verificação adicional
    if (!user?.id) return;

    setLoadingStore(true);

    try {
      // Subscribe para atualizações em tempo real
      const unsubFunc = onSnapshot(
        doc(db, "sellers", user.id),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const seller = docSnapshot.data();

            setStoreName(seller.storeName || "Sua Loja");
            setStoreDescription(seller.storeDescription || "Clique em ⚙️ para adicionar descrição");
            setStoreLogoState(seller.storeLogo || null);

            // Sincronizar com Zustand
            setStoreInfo(seller.storeName, seller.storeOwner, seller.storeDescription);
            if (seller.storeLogo) {
              setStoreLogo(seller.storeLogo);
            }
          }
          setLoadingStore(false);
        },
        (error) => {
          // Ignorar erro de permissão se usuário fez logout
          if (error.code === "permission-denied") {
            console.log("Usuário desautenticado - listener parado");
            return;
          }
          console.error("Erro ao escutar mudanças:", error);
          setLoadingStore(false);
        }
      );

      // Salvar função de unsubscribe
      unsubscribeRef.current = unsubFunc;
    } catch (error) {
      console.error("Erro ao setup listener:", error);
      setLoadingStore(false);
    }
  };

  const toggleAvailability = async (id: string, available: boolean) => {
    try {
      await updateProduct(id, { available: !available });
    } catch (error) {
      console.error(error);
    }
  };

  const activeProducts = products.filter((p) => p.available).length;

  const handleEditProduct = (productId: string) => {
    navigation.navigate("ProductsTab" as any, {
      screen: "SellerProductForm",
      params: { id: productId },
    });
  };

  const isLoadingProducts = isLoading && products.length === 0;

  if (isLoadingProducts || loadingStore) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando vitrine...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoIcon}>
            <Store size={18} color={colors.primaryForeground} />
          </View>
          <Text style={styles.logo}>
            turis<Text style={styles.logoPrimary}>map</Text>
          </Text>
        </View>

        <Button
          title="Adicionar"
          onPress={() =>
            navigation.navigate("ProductsTab" as any, {
              screen: "SellerProductForm",
              params: { id: undefined },
            })
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Store Header Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeAvatarContainer}>
            {storeLogo ? (
              <Image
                source={{ uri: storeLogo }}
                style={styles.storeAvatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.storeAvatar}>
                <Store size={32} color={colors.primaryForeground} />
              </View>
            )}

            <TouchableOpacity
              style={styles.settingsButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("StoreSettings")}
            >
              <Settings size={14} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <Text style={styles.storeName} numberOfLines={1}>
            {storeName}
          </Text>
          <Text style={styles.storeOwner}>
            {user?.name || "Vendedor"}
          </Text>
          <Text style={styles.storeDescription} numberOfLines={2}>
            {storeDescription}
          </Text>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtos disponíveis</Text>
            <Text style={styles.activeCount}>{activeProducts} ativos</Text>
          </View>

          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Package size={48} color={colors.mutedForeground} />
              </View>
              <Text style={styles.emptyText}>Nenhum produto ainda</Text>

              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() =>
                  navigation.navigate("ProductsTab" as any, {
                    screen: "SellerProductForm",
                  })
                }
              >
                <Text style={styles.emptyButtonText}>
                  Adicionar primeiro produto
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <View
                  key={product.id}
                  style={[
                    styles.productCard,
                    !product.available && styles.productCardDisabled,
                  ]}
                >
                  {/* Image */}
                  <View style={styles.productImageContainer}>
                    {product.image ? (
                      <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.productImage,
                          {
                            backgroundColor: colors.muted,
                            justifyContent: "center",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Package size={32} color={colors.mutedForeground} />
                      </View>
                    )}

                    {/* Edit Button */}
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditProduct(product.id)}
                      activeOpacity={0.7}
                    >
                      <Edit size={14} color={colors.foreground} />
                    </TouchableOpacity>
                  </View>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {product.title}
                    </Text>

                    <Text style={styles.productPrice}>
                      R$ {product.price.toFixed(2)}
                    </Text>

                    {/* Availability Toggle */}
                    <View style={styles.availabilityRow}>
                      <Text style={styles.availabilityText}>
                        {product.available ? "Disponível" : "Indisponível"}
                      </Text>
                      <Switch
                        value={product.available}
                        onValueChange={() =>
                          toggleAvailability(product.id, product.available)
                        }
                        trackColor={{
                          false: colors.border,
                          true: colors.primary,
                        }}
                        thumbColor={
                          Platform.OS === "android" ? "#fff" : undefined
                        }
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logoIcon: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  logoPrimary: {
    color: colors.primary,
  },

  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
    paddingBottom: 100,
  },

  storeCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  storeAvatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
    marginBottom: 16,
  },

  storeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.primary,
  },

  storeAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  settingsButton: {
    position: "absolute",
    top: 2,
    right: -2,
    backgroundColor: `${colors.card}cc`,
    borderColor: colors.foreground,
    borderWidth: 1,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  storeName: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  storeOwner: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    marginTop: 4,
  },

  storeDescription: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    marginTop: 8,
    textAlign: "center",
  },

  section: {
    gap: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  activeCount: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyIcon: {
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
    marginBottom: 16,
  },

  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
  },

  emptyButtonText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  productCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  productCardDisabled: {
    opacity: 0.6,
  },

  productImageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.card}cc`,
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: {
    padding: 12,
    gap: 8,
  },

  productTitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  productPrice: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },

  availabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  availabilityText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
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