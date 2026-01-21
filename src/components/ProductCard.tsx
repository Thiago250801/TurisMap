import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { colors, radius, fontFamily } from "../theme";
import { Product } from "../data/mockData";

type Props = {
  product: Product;
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
      {/* Imagem */}
      <View style={styles.imageContainer}>
        <Image
          source={typeof product.image === "string" ? { uri: product.image } : product.image}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Overlay - Indisponível */}
        {!product.available && (
          <View style={styles.unavailableOverlay}>
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Indisponível</Text>
            </View>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        {/* Título */}
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>

        {/* Descrição */}
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Footer: Preço + Botão */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>
              R$ {product.price.toFixed(2)}
            </Text>
            <Text style={styles.seller}>{product.seller}</Text>
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