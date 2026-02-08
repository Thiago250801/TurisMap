import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Copy, CheckCircle2, Info } from "lucide-react-native";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";

export const CheckoutScreen = ({ route, navigation }: any) => {
    const { product, seller, quantity } = route.params;
    const total = product.price * quantity;

    const handleCopyPix = () => {
        Alert.alert("Sucesso", "Chave PIX copiada para a área de transferência!");
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color={colors.foreground} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Revisão do Pedido</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Simulação de Venda / Info */}
                <View style={styles.simulationAlert}>
                    <Info size={20} color={colors.primary} />
                    <Text style={styles.simulationText}>
                        Esta é uma <Text style={{ fontFamily: fontFamily.bold }}>simulação de venda</Text>. O pagamento deve ser feito via PIX direto para o vendedor.
                    </Text>
                </View>

                {/* Produto */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Produto</Text>
                    <View style={styles.productRow}>
                        <Image source={typeof product.image === "string" ? { uri: product.image } : product.image} style={styles.productImg} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.productTitle}>{product.title}</Text>
                            <Text style={styles.productSubtitle}>{quantity} unidade(s)</Text>
                            <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Loja e Vendedor */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Vendedor</Text>
                    <View style={styles.sellerRow}>
                        <View style={styles.logoContainer}>
                            {seller?.storeLogo ? (
                                <Image source={{ uri: seller.storeLogo }} style={styles.logoImg} />
                            ) : (
                                <Text style={styles.logoInitial}>{seller?.storeName?.charAt(0)}</Text>
                            )}
                        </View>
                        <View>
                            <Text style={styles.storeName}>{seller?.storeName}</Text>
                            <Text style={styles.ownerName}>Proprietário: {seller?.storeOwner}</Text>
                        </View>
                    </View>
                </View>

                {/* Pagamento PIX */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Pagamento</Text>
                    <View style={styles.pixBox}>
                        <Text style={styles.pixLabel}>Chave PIX ({seller?.pixKeyType})</Text>
                        <View style={styles.pixKeyRow}>
                            <Text style={styles.pixKey}>{seller?.pixKey || "Chave não registrada"}</Text>
                            <TouchableOpacity onPress={handleCopyPix}>
                                <Copy size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Resumo Financeiro */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>R$ {total.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, { marginTop: 8 }]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Confirmar Pedido"
                    onPress={() => {
                        Alert.alert("Pedido Confirmado", "Obrigado pela sua compra! Lembre-se de realizar o pagamento via PIX para concluir a transação.");
                        navigation.navigate("TouristTabs", { screen: "HomeTab" });
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: colors.border },
    headerTitle: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.foreground },
    container: { padding: 20 },
    simulationAlert: { flexDirection: 'row', gap: 10, backgroundColor: `${colors.primary}15`, padding: 12, borderRadius: radius.md, marginBottom: 20, alignItems: 'center' },
    simulationText: { flex: 1, fontSize: 13, color: colors.foreground, lineHeight: 18 },
    card: { backgroundColor: colors.card, padding: 16, borderRadius: radius.lg, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    sectionTitle: { fontSize: 12, fontFamily: fontFamily.bold, color: colors.mutedForeground, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
    productRow: { flexDirection: 'row', gap: 12 },
    productImg: { width: 70, height: 70, borderRadius: radius.md },
    productTitle: { fontFamily: fontFamily.semiBold, fontSize: 16, color: colors.foreground },
    productSubtitle: { fontSize: 13, color: colors.mutedForeground },
    productPrice: { fontFamily: fontFamily.bold, color: colors.primary, marginTop: 4 },
    sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    logoImg: { width: '100%', height: '100%' },
    logoInitial: { fontFamily: fontFamily.bold, color: colors.primary },
    storeName: { fontFamily: fontFamily.semiBold, color: colors.foreground },
    ownerName: { fontSize: 12, color: colors.mutedForeground },
    pixBox: { backgroundColor: colors.background, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
    pixLabel: { fontSize: 11, color: colors.mutedForeground, marginBottom: 4 },
    pixKeyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pixKey: { fontFamily: fontFamily.medium, color: colors.foreground },
    summary: { marginTop: 10, paddingHorizontal: 4 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { color: colors.mutedForeground },
    summaryValue: { color: colors.foreground },
    totalLabel: { fontSize: 18, fontFamily: fontFamily.bold, color: colors.foreground },
    totalValue: { fontSize: 22, fontFamily: fontFamily.bold, color: colors.primary },
    footer: { padding: 20, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.card }
});