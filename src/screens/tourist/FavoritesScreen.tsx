import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PlaceCard } from "../../components/PlaceCard";
import { colors, fontFamily, radius } from "../../theme";
import { useFavoritesStore } from "../../store/useFavoriteStore";
import { Heart } from "lucide-react-native";
import { Alert, LayoutAnimation, UIManager, Platform } from "react-native";

export const FavoritesScreen = () => {
    const favorites = useFavoritesStore((state) => state.favorites);
    const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
    const handleRemove = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeFavorite(id);
    };

    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

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
                    <Text style={styles.emptyText}>
                        Nenhum local favoritado ainda 🌿
                    </Text>
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
                            onRemove={() => removeFavorite(place.id)}
                        />
                    ))}
                </ScrollView>
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
});
