import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { colors, radius, shadow } from "../theme/theme";
import { fontFamily } from "../theme";

type Props = {
  title: string;
  category: string;
  image: string;
  onPress?: () => void;
};

export const PlaceCard = ({ title, category, image, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.category}>
          <MapPin size={14} color={colors.primary} />
          <Text style={styles.categoryText}>{category}</Text>
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

  category: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  categoryText: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
});
