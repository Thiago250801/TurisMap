import { View, TouchableOpacity, StyleSheet, ImageSourcePropType, ImageBackground } from "react-native";
import { ArrowLeft, Heart, Share2 } from "lucide-react-native";
import { colors, radius } from "../theme";

interface DetailsHeaderProps {
  image: ImageSourcePropType | string;
  onBackPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
  showBadge?: boolean;
  badgeContent?: React.ReactNode;
}

export const DetailsHeader = ({
  image,
  onBackPress,
  onFavoritePress,
  isFavorite,
  showBadge = false,
  badgeContent,
}: DetailsHeaderProps) => {
  return (
    <ImageBackground
      source={typeof image === "string" ? { uri: image } : image}
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      <View style={styles.heroOverlay} />

      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onBackPress}
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
            onPress={onFavoritePress}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isFavorite ? colors.destructive : colors.foreground}
              fill={isFavorite ? colors.destructive : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional Badge */}
      {showBadge && badgeContent && (
        <View style={styles.badgeContainer}>
          {badgeContent}
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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

  badgeContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
});