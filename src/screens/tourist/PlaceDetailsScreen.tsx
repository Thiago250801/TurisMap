import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Clock,
  Store,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../routes/types";
import { colors, fontFamily, radius } from "../../theme";
import { suggestions, popularPlaces } from "../../data/mockData";
import { ProductCard, ProductCardData } from "../../components/ProductCard";
import { Button } from "../../components/Button";
import { useFavoritesStore } from "../../store/useFavoriteStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useProductsStore } from "../../store/useProductsStore";
import { SafeAreaView } from "react-native-safe-area-context";

type PlaceDetailsScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "Place"
>;

type PlaceDetailsScreenRouteProp = RouteProp<AppStackParamList, "Place">;

interface Props {
  navigation: PlaceDetailsScreenNavigationProp;
  route: PlaceDetailsScreenRouteProp;
}

export const PlaceDetailsScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const { products, loadProductsByPlace, isLoading } = useProductsStore();

  const allPlaces = [...suggestions, ...popularPlaces];
  const place = allPlaces.find((p) => p.id === id);

  useEffect(() => {
    if (id) {
      loadProductsByPlace(id);
    }
  }, [id, loadProductsByPlace]);

  const relatedProducts = products.slice(0, 3);

  if (!place) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Lugar não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = async () => {
    if (!user?.id) return;

    // toggleFavorite accepts a FavoritePlace object; user id is not required
    toggleFavorite({
      id: place.id,
      title: place.title,
      rating: place.rating,
      image: place.image,
    });
  };

  const handleAddToPlan = () => {
    navigation.navigate("Home" as any);
  };

  const favoriteStatus = isFavorite(place.id);

  const productCardData = (product: any): ProductCardData => ({
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    image: product.image,
    sellerName: product.sellerName,
    available: product.available,
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        <ImageBackground
          source={
            typeof place.image === "string" ? { uri: place.image } : place.image
          }
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

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
                  color={
                    favoriteStatus ? colors.destructive : colors.foreground
                  }
                  fill={favoriteStatus ? colors.destructive : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentWrapper}>
          <View style={styles.infoCard}>
            <View style={styles.titleSection}>
              <View style={styles.titleContent}>
                <Text style={styles.title}>{place.title}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={colors.mutedForeground} />
                  <Text style={styles.location}>{place.location}</Text>
                </View>
              </View>

              <View style={styles.ratingBadge}>
                <Star
                  size={16}
                  color="#F59E0B"
                  fill="#F59E0B"
                  style={styles.starIcon}
                />
                <Text style={styles.ratingText}>{place.rating}</Text>
              </View>
            </View>

            <Text style={styles.description}>{place.description}</Text>

            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.mutedForeground} />
                <Text style={styles.infoText}>Aberto 24h</Text>
              </View>
              <View style={styles.infoItem}>
                <MapPin size={16} color={colors.mutedForeground} />
                <Text style={styles.infoText}>2.5 km</Text>
              </View>
            </View>
          </View>

          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Produtos disponíveis</Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : relatedProducts.length > 0 ? (
              relatedProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() =>
                    navigation.navigate(
                      "Product" as any,
                      { id: product.id } as any,
                    )
                  }
                  activeOpacity={0.9}
                >
                  <ProductCard
                    product={productCardData(product)}
                    showBuyButton={true}
                    onPress={() =>
                      navigation.navigate(
                        "Product" as any,
                        { id: product.id } as any,
                      )
                    }
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyProducts}>
                <Store size={32} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>
                  Nenhum produto cadastrado ainda
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <Button title="Adicionar ao Plano" onPress={() => Alert.alert("Em desenvolvimento", "Esta funcionalidade será implementada em breve")} />
      </View>
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
    height: 280,
    position: "relative",
  },

  heroImage: {
    resizeMode: "cover",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
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

  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  titleContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  location: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.muted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.lg,
  },

  starIcon: {
    marginRight: 2,
  },

  ratingText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.foreground,
  },

  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
    marginTop: 16,
  },

  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: "row",
    gap: 24,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  productsSection: {
    gap: 12,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  emptyProducts: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  loadingContainer: {
    paddingVertical: 32,
    alignItems: "center",
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
    paddingBottom: 40,
    paddingTop: 16,
    paddingHorizontal: 16,
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
