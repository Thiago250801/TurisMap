import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Store,
  Minus,
  Plus,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import { useFavoritesStore } from "../../store/useFavoriteStore";
import { useAuthStore } from "../../store/useAuthStore";
import { productService } from "../../services/productService";
import { sellerService, Seller } from "../../services/sellerService";

export const ProductDetailsScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavoritesStore();
  const { user } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductAndSeller();
  }, [id]);

  const loadProductAndSeller = async () => {
    setLoading(true);
    try {
      const productData = await productService.getProduct(id);
      if (productData) {
        setProduct(productData);
        
        // Busca as informações da loja/vendedor usando o sellerId do produto
        if (productData.sellerId) {
          const sellerData = await sellerService.getSeller(productData.sellerId);
          setSeller(sellerData);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!user?.id || !product) return;
    toggleFavorite({
      id: product.id,
      title: product.title,
      rating: 0,
      image: product.image,
    });
  };

  const handleBuy = () => {
    navigation.navigate("Checkout", {
      product,
      seller,
      quantity,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Produto não encontrado.</Text>
          <Button 
            title="Voltar" 
            onPress={() => navigation.goBack()} 
            variant="outline"
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Imagem de Capa */}
        <ImageBackground
          source={typeof product.image === "string" ? { uri: product.image } : product.image}
          style={styles.hero}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={22} color={colors.foreground} />
            </TouchableOpacity>

            <View style={styles.headerRightActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={20} color={colors.foreground} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleToggleFavorite}
              >
                <Heart 
                  size={20} 
                  color={checkIsFavorite(product.id) ? colors.destructive : colors.foreground} 
                  fill={checkIsFavorite(product.id) ? colors.destructive : "transparent"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Informações do Produto */}
        <View style={styles.contentWrapper}>
          <View style={styles.infoCard}>
            <Text style={styles.title}>{product.title}</Text>
            
            <View style={styles.priceSection}>
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
              <View style={styles.priceLabel}>
                <ShoppingBag size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.priceLabelText}>Disponível para compra</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            <View style={styles.divider} />

            {/* Seção da Loja - Logo Dinâmico */}
            <View style={styles.sellerSection}>
              <View style={styles.sellerIconContainer}>
                {seller?.storeLogo ? (
                  <Image source={{ uri: seller.storeLogo }} style={styles.storeLogo} />
                ) : (
                  <View style={styles.fallbackIcon}>
                    <Store size={20} color={colors.primary} />
                  </View>
                )}
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerLabel}>Vendido por</Text>
                <Text style={styles.sellerName}>{seller?.storeName || product.sellerName}</Text>
              </View>
            </View>

            {product.available && (
              <>
                <View style={styles.divider} />
                <View style={styles.quantitySection}>
                  <Text style={styles.sectionTitle}>Quantidade</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={20} color={colors.foreground} />
                    </TouchableOpacity>
                    
                    <View style={styles.qtyDisplay}>
                      <Text style={styles.qtyText}>{quantity}</Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={20} color={colors.foreground} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
          {/* Espaçamento para o botão fixo no bottom */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Botão de Rodapé */}
      {product.available && (
        <View style={styles.footer}>
          <Button 
            title={`Comprar • R$ ${(product.price * quantity).toFixed(2)}`} 
            onPress={handleBuy} 
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, color: colors.mutedForeground, fontFamily: fontFamily.medium },
  notFoundText: { fontSize: 16, color: colors.mutedForeground, fontFamily: fontFamily.regular },
  
  hero: { width: "100%", height: 350 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },
  headerActions: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  actionButton: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: "rgba(255,255,255,0.9)", 
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  headerRightActions: { flexDirection: "row", gap: 10 },

  contentWrapper: { paddingHorizontal: 16, marginTop: -40 },
  infoCard: { 
    backgroundColor: colors.card, 
    borderRadius: radius.xl, 
    padding: 24, 
    borderWidth: 1, 
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  title: { fontSize: 26, fontFamily: fontFamily.bold, color: colors.foreground },
  priceSection: { marginTop: 12, gap: 4 },
  price: { fontSize: 30, fontFamily: fontFamily.bold, color: colors.primary },
  priceLabel: { flexDirection: "row", alignItems: "center" },
  priceLabelText: { fontSize: 13, color: colors.mutedForeground, fontFamily: fontFamily.medium },
  
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
  
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: fontFamily.semiBold, color: colors.foreground },
  description: { fontSize: 15, color: colors.mutedForeground, lineHeight: 22, fontFamily: fontFamily.regular },

  sellerSection: { flexDirection: "row", alignItems: "center", gap: 14 },
  sellerIconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: radius.md, 
    backgroundColor: colors.muted,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border
  },
  storeLogo: { width: '100%', height: '100%', resizeMode: 'cover' },
  fallbackIcon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sellerInfo: { flex: 1 },
  sellerLabel: { fontSize: 12, color: colors.mutedForeground, fontFamily: fontFamily.regular },
  sellerName: { fontSize: 16, color: colors.foreground, fontFamily: fontFamily.semiBold },

  quantitySection: { gap: 16 },
  quantityControls: { flexDirection: "row", alignItems: "center", gap: 15 },
  qtyBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: radius.md, 
    backgroundColor: colors.muted, 
    alignItems: "center", 
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  qtyDisplay: { 
    flex: 1, 
    height: 48, 
    borderRadius: radius.md, 
    borderWidth: 1, 
    borderColor: colors.border, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  qtyText: { fontSize: 18, fontFamily: fontFamily.bold, color: colors.foreground },

  footer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: colors.card, 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: colors.border,
    paddingBottom: 40
  }
});