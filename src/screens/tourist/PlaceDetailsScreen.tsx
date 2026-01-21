import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Clock,
  Plus,
  Store,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { colors, fontFamily, radius } from "../../theme";
import { suggestions, popularPlaces, products } from "../../data/mockData";
import { ProductCard } from "../../components/ProductCard";
import { Button } from "../../components/Button";
import { useFavoritesStore } from "../../store/useFavoriteStore";

type RootStackParamList = {
  Place: { id: string };
  Product: { id: string };
  Home: undefined;
};

type PlaceDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Place"
>;

type PlaceDetailsScreenRouteProp = RouteProp<RootStackParamList, "Place">;

interface Props {
  navigation: PlaceDetailsScreenNavigationProp;
  route: PlaceDetailsScreenRouteProp;
}

export const PlaceDetailsScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();

  const allPlaces = [...suggestions, ...popularPlaces];
  const place = allPlaces.find((p) => p.id === id);

  const relatedProducts = products.slice(0, 2);

  if (!place) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Lugar não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: place.id,
      title: place.title,
      rating: place.rating,
      image: place.image,
    });
  };

  const handleAddToPlan = () => {
    // TODO: Implementar lógica de adicionar ao plano
    navigation.navigate("Home" as never);
  };

  const favoriteStatus = isFavorite(place.id);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <ImageBackground
          source={
            typeof place.image === "string"
              ? { uri: place.image }
              : place.image
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
                  color={favoriteStatus ? colors.destructive : colors.foreground}
                  fill={favoriteStatus ? colors.destructive : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Content */}
        <View style={styles.contentWrapper}>
          {/* Main Info Card */}
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

            {/* Description */}
            <Text style={styles.description}>{place.description}</Text>

            {/* Info Row */}
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

            {/* Seller Info */}
            {place.sellerName && (
              <>
                <View style={styles.infoDivider} />
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
                    <Text style={styles.sellerLabel}>Vendedor parceiro</Text>
                    <Text style={styles.sellerName}>{place.sellerName}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Related Products */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Experiências relacionadas</Text>

            {relatedProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() =>
                  navigation.navigate("Product", {
                    id: product.id,
                  })
                }
                activeOpacity={0.9}
              >
                <ProductCard
                  product={product}
                  showBuyButton={true}
                  onPress={() =>
                    navigation.navigate("Product", {
                      id: product.id,
                    } )
                  }
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Spacing for bottom button */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomButton}>
        <Button
          title="Adicionar ao Plano"
          onPress={handleAddToPlan}
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

  productsSection: {
    gap: 12,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
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