import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MapPin, ShoppingBag } from "lucide-react-native";
import { colors, fontFamily, radius } from "../../theme";
import { suggestions } from "../../data/mockData";
import { PlaceCard } from "../../components/PlaceCard";
import { ProductCard, ProductCardData } from "../../components/ProductCard";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SearchBar } from "../../components/SearchBar";
import { useProductsStore } from "../../store/useProductsStore";

type RootStackParamList = {
  Place: { id: string };
  Product: { id: string };
};

export const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"places" | "products">("places");

  const { products, loadAvailableProducts, isLoading } = useProductsStore();

  useEffect(() => {
    loadAvailableProducts();
  }, []);

  const allPlaces = [...suggestions];

  const filteredPlaces = allPlaces.filter(
    (place) =>
      place.title.toLowerCase().includes(search.toLowerCase()) ||
      place.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlacePress = (placeId: string) => {
    navigation.navigate("Place", { id: placeId });
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate("Product", { id: productId });
  };

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
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar lugares, produtos..."
        />
      </View>

      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === "places" && styles.tabActive]}
          onPress={() => setActiveTab("places")}
        >
          <MapPin
            size={16}
            color={
              activeTab === "places"
                ? colors.primaryForeground
                : colors.mutedForeground
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "places" && styles.tabTextActive,
            ]}
          >
            Lugares
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === "products" && styles.tabActive]}
          onPress={() => setActiveTab("products")}
        >
          <ShoppingBag
            size={16}
            color={
              activeTab === "products"
                ? colors.primaryForeground
                : colors.mutedForeground
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "products" && styles.tabTextActive,
            ]}
          >
            Produtos
          </Text>
        </Pressable>
      </View>

      {activeTab === "places" ? (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePlacePress(item.id)}>
              <PlaceCard
                title={item.title}
                rating={item.rating}
                image={item.image}
                onPress={() => handlePlacePress(item.id)}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>Nenhum lugar encontrado</Text>
            </View>
          }
        />
      ) : (
        <>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Carregando produtos...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleProductPress(item.id)}>
                  <ProductCard
                    product={productCardData(item)}
                    onPress={() => handleProductPress(item.id)}
                  />
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <ShoppingBag size={48} color={colors.mutedForeground} />
                  <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
                  <Text style={styles.emptySubtext}>
                    Os comerciantes ainda não cadastraram produtos
                  </Text>
                </View>
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
    marginBottom: 12,
  },

  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
  },

  tabActive: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.mutedForeground,
  },

  tabTextActive: {
    color: colors.primaryForeground,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    paddingBottom: 100,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },

  emptyText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.foreground,
  },

  emptySubtext: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
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