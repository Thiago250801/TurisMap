import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Star, Heart, Trash2, ImageOff } from "lucide-react-native";
import { colors, radius, shadow } from "../theme/theme";
import { fontFamily } from "../theme";

type Props = {
  title: string;
  rating: number;
  image: string | ImageSourcePropType | null; 
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  onPress?: () => void;
};

export const PlaceCard = ({
  title,
  rating,
  image,
  isFavorite = false,
  onToggleFavorite,
  showRemoveButton = false,
  onRemove,
  onPress,
}: Props) => {
  
  let imageSource: ImageSourcePropType | undefined;

  if (typeof image === "string" && image.trim().length > 0) {
    imageSource = { uri: image };
  } else if (typeof image === "number") {
    imageSource = image;
  } else if (typeof image === "object" && image !== null) {
      imageSource = image as ImageSourcePropType;
  }
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
             <ImageOff size={32} color={colors.mutedForeground} />
          </View>
        )}

        {showRemoveButton ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.remove]}
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color={colors.foreground} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onToggleFavorite}
            activeOpacity={0.7}
          >
            <Heart
              size={18}
              color={isFavorite ? colors.destructive : colors.mutedForeground}
              fill={isFavorite ? colors.destructive : "transparent"}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rating}>
          <Star size={14} color={colors.primary} fill={colors.primary} />
          <Text style={styles.ratingText}>
            {typeof rating === "number" ? rating.toFixed(1) : "—"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        overflow: "hidden",
        ...shadow.card,
        marginBottom: 16, 
    },
    image: {
        width: "100%",
        height: 140,
        backgroundColor: colors.muted,
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee'
    },
    actionButton: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    remove: {
        backgroundColor: colors.destructive,
    },
    info: {
        padding: 12,
        gap: 6,
    },
    title: {
        fontSize: 16,
        color: colors.foreground,
        fontFamily: fontFamily.semiBold,
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    ratingText: {
        color: colors.mutedForeground,
        fontFamily: fontFamily.medium,
        fontSize: 14,
    },
});