import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Image as RNImage,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Plus,
  Package,
  Edit,
  Trash2,
  ImageIcon,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSellerStore } from "../../store/userSellerStore";
import { useAuthStore } from "../../store/useAuthStore";
import { imageService } from "../../services/imageService";

type RootStackParamList = {
  SellerProducts: undefined;
  SellerProductForm: { id?: string };
};

type SellerProductsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SellerProducts"
>;

type SellerProductsScreenRouteProp = RouteProp<
  RootStackParamList,
  "SellerProducts"
>;

interface Props {
  navigation: SellerProductsScreenNavigationProp;
  route?: SellerProductsScreenRouteProp;
}

export const SellerProductsScreen = ({
  navigation,
  route,
}: Props) => {
  const { products, addProduct, updateProduct, deleteProduct, loadProducts, isLoading: storeLoading } =
    useSellerStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      loadProducts(user.id);
    }
  }, [user?.id, loadProducts]);

  const handleDelete = async (productId: string, productTitle: string) => {
    Alert.alert(
      "Remover produto",
      `Tem certeza que deseja remover "${productTitle}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert("Sucesso", "Produto removido!");
            } catch (error) {
              Alert.alert("Erro", "Falha ao remover produto");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  // List View
  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Meus Produtos</Text>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate("SellerProductForm", { id: undefined })}
          activeOpacity={0.7}
        >
          <Plus size={18} color={colors.primaryForeground} />
          <Text style={styles.newButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {storeLoading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Package size={48} color={colors.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum produto</Text>
          <Text style={styles.emptyDescription}>
            Adicione seu primeiro produto para começar a vender
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("SellerProductForm", { id: undefined })}
          >
            <Plus size={18} color={colors.primaryForeground} />
            <Text style={styles.emptyButtonText}>Adicionar Produto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.productItem,
                !item.available && styles.productItemDisabled,
              ]}
            >
              {/* Image */}
              <View style={styles.productItemImage}>
                {item.image ? (
                  <RNImage
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: colors.muted,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Package size={32} color={colors.mutedForeground} />
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={styles.productItemContent}>
                <View style={styles.productItemTop}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={styles.productItemTitle}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.productItemPrice}>
                      R$ {item.price.toFixed(2)}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.productItemActions}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("SellerProductForm", {
                          id: item.id,
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Edit size={18} color={colors.mutedForeground} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleDelete(item.id, item.title)
                      }
                      activeOpacity={0.7}
                    >
                      <Trash2 size={18} color={colors.destructive} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Availability */}
                <Text style={styles.productItemAvailability}>
                  {item.available ? "Disponível" : "Indisponível"}
                </Text>
              </View>
            </View>
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // List View Styles
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  listTitle: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  newButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.lg,
  },

  newButtonText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  emptyIcon: {
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  emptyDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    textAlign: "center",
    maxWidth: 280,
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    marginTop: 12,
  },

  emptyButtonText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    paddingBottom: 24,
  },

  productItem: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  productItemDisabled: {
    opacity: 0.6,
  },

  productItemImage: {
    width: 96,
    height: 96,
  },

  productItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },

  productItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  productItemTitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  productItemPrice: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.primary,
    marginTop: 4,
  },

  productItemActions: {
    flexDirection: "row",
    gap: 8,
  },

  productItemAvailability: {
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