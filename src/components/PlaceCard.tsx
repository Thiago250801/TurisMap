import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import { colors, radius, shadow } from "../theme/theme";
import { fontFamily } from "../theme";

type Props = {
  title: string;
  rating: number; // ⭐ novo campo
  image: string | any;
  onPress?: () => void;
};

export const PlaceCard = ({ title, rating, image, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.rating}>
          <Star size={14} color={colors.primary} fill={colors.primary} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
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
  },

  image: {
    width: "100%",
    height: 140,
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
