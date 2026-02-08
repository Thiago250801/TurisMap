import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Animated,
} from "react-native";
import { PlaceCard } from "../../components/PlaceCard";
import { colors, fontFamily, radius } from "../../theme";
import { useFavoritesStore } from "../../store/useFavoriteStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getPlaceImage } from "../../hooks/usePlace";
import { Heart, Undo2 } from "lucide-react-native";

interface RemovedFavorite {
  id: string;
  title: string;
  rating: number;
}

export const FavoritesScreen = () => {
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastRemoved, setLastRemoved] = useState<RemovedFavorite | null>(null);
  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const { user } = useAuthStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavoriteRemote = useFavoritesStore(
    (state) => state.removeFavoriteRemote,
  );
  const addFavoriteRemote = useFavoritesStore(
    (state) => state.addFavoriteRemote,
  );
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    if (user?.id) {
      loadFavorites(user.id);
    }
  }, [user?.id]);

  // Limpa timeout ao desmontar
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const handleRemove = async (id: string) => {
    if (!user?.id) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Encontra o lugar que vai ser removido
    const place = favorites.find((p) => p.id === id);
    if (!place) return;

    // Salva para undo
    setLastRemoved({
      id: place.id,
      title: place.title,
      rating: place.rating,
    });

    // Limpa timeout anterior se existir
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    setSnackBarVisible(true);

    // Define timeout de 5 segundos para remover definitivamente
    undoTimeoutRef.current = setTimeout(async () => {
      try {
        await removeFavoriteRemote(user.id, id);
        setSnackBarVisible(false);
        setLastRemoved(null);
      } catch (error) {
        Alert.alert("Erro", "Falha ao remover favorito");
      }
    }, 5000);
  };

  const handleUndo = async () => {
    if (!user?.id || !lastRemoved) return;

    // Limpa timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    // Recoloca o favorito
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    try {
      const localImage = getPlaceImage(lastRemoved.id);
      await addFavoriteRemote(user.id, {
        id: lastRemoved.id,
        title: lastRemoved.title,
        rating: lastRemoved.rating,
        image: localImage || "",
      });
      setSnackBarVisible(false);
      setLastRemoved(null);
    } catch (error) {
      Alert.alert("Erro", "Falha ao restaurar favorito");
    }
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
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.icon}>
            <Heart size={18} color={colors.primaryForeground} />
          </View>
          <Text style={styles.title}>Favoritos</Text>
        </View>
        <Text style={styles.count}>{favorites.length} salvos</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Heart size={48} color={colors.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptyText}>
            Explore lugares e produtos e adicione aos favoritos
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {favorites.map((place) => {
            const localImage = getPlaceImage(place.id);

            return (
              <PlaceCard
                key={place.id}
                title={place.title}
                rating={place.rating}
                image={localImage}
                showRemoveButton
                onRemove={() => confirmRemove(place.id)}
              />
            );
          })}
        </ScrollView>
      )}

      {/* Snackbar de undo */}
      {snackBarVisible && lastRemoved && (
        <View style={styles.snackBar}>
          <View style={styles.snackBarContent}>
            <Text style={styles.snackBarText}>
              {lastRemoved.title} removido
            </Text>
            <TouchableOpacity
              onPress={handleUndo}
              style={styles.undoButton}
              activeOpacity={0.7}
            >
              <Undo2 size={16} color={colors.primary} />
              <Text style={styles.undoButtonText}>Desfazer</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  count: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
  },

  container: {
    padding: 24,
    gap: 16,
    paddingBottom: 100,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },

  emptyIcon: {
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  emptyText: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    textAlign: "center",
  },

  snackBar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  snackBarContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  snackBarText: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: fontFamily.medium,
    flex: 1,
  },

  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
  },

  undoButtonText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fontFamily.semiBold,
  },
});