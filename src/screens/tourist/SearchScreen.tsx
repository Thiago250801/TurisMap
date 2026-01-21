import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { Search, MapPin } from "lucide-react-native";
import { colors, fontFamily, radius } from "../../theme";
import { suggestions, popularPlaces, products } from "../../data/mockData";
import { PlaceCard } from "../../components/PlaceCard";
import { ProductCard } from "../../components/ProductCard";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  Place: { id: string };
  Product: { id: string };
};

export const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"places" | "products">("places");

  const allPlaces = [...suggestions, ...popularPlaces];

  const filteredPlaces = allPlaces.filter(
    (place) =>
      place.title.toLowerCase().includes(search.toLowerCase()) ||
      place.location.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePlacePress = (placeId: string) => {
    navigation.navigate("Place", { id: placeId });
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate("Product", { id: productId });
  };

  return (
    <View style={styles.screen}>
      {/* Header com SearchBar */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>

        <View style={styles.searchContainer}>
          <Search size={18} color={colors.mutedForeground} />
          <TextInput
            style={styles.input}
            placeholder="Buscar lugares, produtos..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === "places" && styles.tabActive]}
          onPress={() => setActiveTab("places")}
        >
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

      {/* Content */}
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
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleProductPress(item.id)}>
              <ProductCard
                product={item}
                onPress={() => handleProductPress(item.id)}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          }
        />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
    marginBottom: 12,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },

  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
    alignItems: "center",
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
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.mutedForeground,
  },
});
