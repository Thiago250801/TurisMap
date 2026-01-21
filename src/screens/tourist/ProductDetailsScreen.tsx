import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Store,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { colors, fontFamily, radius } from "../../theme";
import { products, suggestions, popularPlaces } from "../../data/mockData";
import { Button } from "../../components/Button";
import { useFavoritesStore } from "../../store/useFavoriteStore";


type RootStackParamList = {
  Product: { id: string };
  Home: undefined;
};

type ProductDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Product"
>;

type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, "Product">;

interface Props {
  navigation: ProductDetailsScreenNavigationProp;
  route: ProductDetailsScreenRouteProp;
}

export const ProductDetailsScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavoritesStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Produto não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const allPlaces = [...suggestions, ...popularPlaces];
  const relatedPlace = allPlaces.find(
    (place) => place.sellerName === product.seller
  );

  const handleToggleFavorite = () => {
    // Encontrar a imagem correta do produto
    const placeImage = relatedPlace?.image || product.image;

    toggleFavorite({
      id: product.id,
      title: product.title,
      rating: 0, // Produtos não têm rating, usar 0
      image: placeImage,
    });
  };

  const handleBuy = () => {
    Alert.alert(
      "Compra",
      `${quantity}x ${product.title}\nTotal: R$ ${(product.price * quantity).toFixed(2)}`,
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        { text: "Confirmar", onPress: () => navigation.navigate("Home" as never) },
      ]
    );
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <ImageBackground
          source={
            typeof product.image === "string"
              ? { uri: product.image }
              : product.image
          }
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color={colors.foreground} />
            </TouchableOpacity>

            <View style={styles.headerRightActions}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Share2 size={20} color={colors.foreground} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleFavorite}
                activeOpacity={0.7}
              >
                <Heart
                  size={20}
                  color={checkIsFavorite(product.id) ? colors.destructive : colors.foreground}
                  fill={checkIsFavorite(product.id) ? colors.destructive : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Unavailable Badge */}
          {!product.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Indisponível</Text>
            </View>
          )}
        </ImageBackground>

        {/* Content */}
        <View style={styles.contentWrapper}>
          {/* Main Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.title}>{product.title}</Text>

            {/* Price */}
            <View style={styles.priceSection}>
              <Text style={styles.price}>
                R$ {product.price.toFixed(2)}
              </Text>
              <View style={styles.priceLabel}>
                <ShoppingBag
                  size={14}
                  color={colors.primary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.priceLabelText}>Preço unitário</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.divider} />
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Sobre o produto</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            {/* Seller Info */}
            <View style={styles.divider} />
            <View style={styles.sellerSection}>
              <View
                style={[
                  styles.sellerIcon,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Store size={18} color={colors.primary} />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerLabel}>Vendedor</Text>
                <Text style={styles.sellerName}>{product.seller}</Text>
              </View>
            </View>

            {/* Quantity Selector */}
            {product.available && (
              <>
                <View style={styles.divider} />
                <View style={styles.quantitySection}>
                  <Text style={styles.sectionTitle}>Quantidade</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(-1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantityText}>{quantity}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      {product.available && (
        <View style={styles.bottomButton}>
          <Button
            title={`Comprar - R$ ${(product.price * quantity).toFixed(2)}`}
            onPress={handleBuy}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  hero: {
    width: "100%",
    height: 320,
    position: "relative",
  },

  heroImage: {
    resizeMode: "cover",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  headerActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerRightActions: {
    flexDirection: "row",
    gap: 8,
  },

  unavailableBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.destructive,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: "center",
  },

  unavailableText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  contentWrapper: {
    paddingHorizontal: 16,
    paddingTop: -32,
    marginTop: -32,
    position: "relative",
    zIndex: 10,
  },

  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  priceSection: {
    marginTop: 16,
    gap: 8,
  },

  price: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },

  priceLabel: {
    flexDirection: "row",
    alignItems: "center",
  },

  priceLabelText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  descriptionSection: {
    gap: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
  },

  sellerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  sellerIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  sellerInfo: {
    flex: 1,
  },

  sellerLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  sellerName: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
    marginTop: 2,
  },

  quantitySection: {
    gap: 12,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  quantityButtonText: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  quantityDisplay: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  bottomSpacing: {
    height: 100,
  },

  bottomButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFoundText: {
    fontSize: 16,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },
});