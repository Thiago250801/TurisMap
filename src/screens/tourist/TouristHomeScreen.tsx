import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MapPin, Bell } from "lucide-react-native";
import { useState, useEffect } from "react";

import { colors, fontFamily, radius } from "../../theme";
import { SearchBar } from "../../components/SearchBar";
import { PlaceCard } from "../../components/PlaceCard";

import { useFavoritesStore } from "../../store/useFavoriteStore";
import { usePlacesStore } from "../../store/usePlacesStore";
import { useAuthStore } from "../../store/useAuthStore";

export const TouristHomeScreen = () => {
  const [search, setSearch] = useState("");

  const { popular, suggestions } = usePlacesStore();
  const { user } = useAuthStore();

  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addFavoriteRemote = useFavoritesStore(
    (state) => state.addFavoriteRemote,
  );
  const removeFavoriteRemote = useFavoritesStore(
    (state) => state.removeFavoriteRemote,
  );

  const checkIsFavorite = (id: string) =>
    favorites.some((item) => item.id === id);

  const handleToggleFavorite = async (place: any) => {
    try {
      // If user not authenticated, toggle local-only store
      if (!user?.id) {
        toggleFavorite(place);
        return;
      }

      const exists = favorites.some((f) => f.id === place.id);

      if (exists) {
        // remove from Firestore and update local list
        await removeFavoriteRemote(user.id, place.id);
      } else {
        // add to Firestore and update local list
        const img = typeof place.image === "string" ? place.image : "";
        await addFavoriteRemote(user.id, {
          id: place.id,
          title: place.title,
          rating: place.rating,
          image: img,
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const filterBySearch = (title: string) =>
    title.toLowerCase().includes(search.toLowerCase());

  const filteredPopular = popular.filter((p) => filterBySearch(p.title));

  const filteredSuggestions = suggestions.filter((p) =>
    filterBySearch(p.title),
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <MapPin size={18} color={colors.primaryForeground} />
            </View>
            <Text style={styles.logoText}>
              turis<Text style={styles.logoPrimary}>map</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.notification}>
            <Bell size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar lugares, experiências..."
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* POPULAR */}
        <Text style={styles.sectionTitle}>Popular entre os usuários</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {filteredPopular.map((place) => (
            <PlaceCard
              key={place.id}
              {...place}
              isFavorite={checkIsFavorite(place.id)}
              onToggleFavorite={() => handleToggleFavorite(place)}
            />
          ))}
        </ScrollView>

        {/* SUGESTÕES */}
        <Text style={styles.sectionTitle}>Sugestões do Turismap</Text>

        {filteredSuggestions.map((place) => (
          <PlaceCard
            key={place.id}
            {...place}
            isFavorite={checkIsFavorite(place.id)}
            onToggleFavorite={() => handleToggleFavorite(place)}
          />
        ))}

        {filteredPopular.length === 0 && filteredSuggestions.length === 0 && (
          <Text style={styles.emptyState}>Nenhum lugar encontrado</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  logo: {
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

  logoText: {
    fontSize: 20,
    color: colors.foreground,
    fontFamily: fontFamily.bold,
  },

  logoPrimary: {
    color: colors.primary,
  },

  notification: {
    position: "relative",
  },

  content: {
    padding: 24,
    gap: 24,
  },

  sectionTitle: {
    fontSize: 18,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
  },

  horizontalList: {
    paddingVertical: 8,
    gap: 16,
  },

  emptyState: {
    textAlign: "center",
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    paddingVertical: 24,
  },
});
