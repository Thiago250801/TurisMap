import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PlaceCard } from "../../components/PlaceCard";
import { colors, fontFamily, radius } from "../../theme";
import { useFavoritesStore } from "../../store/useFavoriteStore";
import { Heart } from "lucide-react-native";
import { Alert, LayoutAnimation, UIManager, Platform } from "react-native";
import { useState } from "react";

export const FavoritesScreen = () => {
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<any>(null);
  let undoTimeout: NodeJS.Timeout;

  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const restoreFavorite = useFavoritesStore((state) => state.restoreFavorite);

  const handleRemove = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const removed = removeFavorite(id);

    if (!removed) return;

    setLastRemoved(removed);
    setSnackBarVisible(true);

    undoTimeout = setTimeout(() => {
      setSnackBarVisible(false);
      setLastRemoved(null);
    }, 4000);
  };

  const handleUndo = () => {
    if (!lastRemoved) return;

    restoreFavorite(lastRemoved);
    setLastRemoved(null);
    setSnackBarVisible(false);

    clearTimeout(undoTimeout);
  };


  const confirmRemove = (id: string) => {
    Alert.alert(
      "Remover favorito",
      "Deseja remover este local dos favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => handleRemove(id),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.icon}>
            <Heart size={18} color={colors.primaryForeground} />
          </View>
          <Text style={styles.title}>Favoritos</Text>
        </View>
      </View>

      {/* CONTENT */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum local favoritado ainda 🌿</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {favorites.map((place) => (
            <PlaceCard
              key={place.id}
              title={place.title}
              rating={place.rating}
              image={place.image}
              showRemoveButton
              onRemove={() => confirmRemove(place.id)}
            />
          ))}
        </ScrollView>
      )}
      {snackBarVisible && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>Removido dos favoritos</Text>

          <TouchableOpacity onPress={handleUndo}>
            <Text style={styles.undo}>DESFAZER</Text>
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  icon: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
  },

  container: {
    padding: 24,
    gap: 24,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
    fontSize: 16,
  },

  snackbar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
  },

  snackbarText: {
    color: colors.foreground,
    fontFamily: fontFamily.medium,
  },

  undo: {
    color: colors.primary,
    fontFamily: fontFamily.semiBold,
  },
});
