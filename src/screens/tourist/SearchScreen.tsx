import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { MapPin } from "lucide-react-native";
import { colors, fontFamily, radius } from "../../theme";
import { popularPlaces, suggestions } from "../../data/mockData";
import { PlaceCard } from "../../components/PlaceCard";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SearchBar } from "../../components/SearchBar";

type RootStackParamList = {
  Place: { id: string };
};

export const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState("");

  // Consolida todos os lugares removendo duplicatas por ID
  const allPlaces = [...suggestions, ...popularPlaces].filter((place, index, self) =>
    index === self.findIndex((p) => p.id === place.id)
  );

  // Filtra os lugares com base no texto da busca
  const filteredPlaces = allPlaces.filter(
    (place) =>
      place.title.toLowerCase().includes(search.toLowerCase()) ||
      place.location.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlacePress = (placeId: string) => {
    navigation.navigate("Place", { id: placeId });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Lugares</Text>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Para onde você quer ir?"
        />
      </View>

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PlaceCard
            title={item.title}
            rating={item.rating}
            image={item.image}
            onPress={() => handlePlacePress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MapPin size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>Nenhum lugar encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente buscar por outro nome ou localização.
            </Text>
          </View>
        }
      />
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
    paddingBottom: 20,
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16, // Aumentado um pouco para melhor respiro visual
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
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
    paddingHorizontal: 40,
  },
});