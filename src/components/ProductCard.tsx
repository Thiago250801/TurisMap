import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { ShoppingBag, Package } from "lucide-react-native";
import { colors, radius, fontFamily } from "../theme";

export type ProductCardData = {
  id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
  sellerName: string;
  available: boolean;
};

type Props = {
  product: ProductCardData;
  onPress?: () => void;
  showBuyButton?: boolean;
};

export const ProductCard = ({
  product,
  onPress,
  showBuyButton = true,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Package size={48} color={colors.mutedForeground} />
          </View>
        )}

        {!product.available && (
          <View style={styles.unavailableOverlay}>
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Indisponível</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>
              R$ {product.price.toFixed(2)}
            </Text>
            <Text style={styles.seller}>{product.sellerName}</Text>
          </View>

          {showBuyButton && product.available && (
            <TouchableOpacity
              style={styles.buyButton}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <ShoppingBag size={16} color={colors.primaryForeground} />
              <Text style={styles.buyButtonText}>Comprar</Text>
            </TouchableOpacity>
          )}
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
    borderWidth: 1,
    borderColor: colors.border,
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },

  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  unavailableBadge: {
    backgroundColor: colors.destructive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.lg,
  },

  unavailableText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },

  info: {
    padding: 12,
    gap: 8,
  },

  title: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  description: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },

  seller: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    marginTop: 2,
  },

  buyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  buyButtonText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },
});