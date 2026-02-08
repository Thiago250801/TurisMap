import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlansStore } from "../../store/usePlanStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Map, Edit2, Trash2 } from "lucide-react-native";

type PlansStackParamList = {
  Plans: undefined;
  CreatePlan: { id?: string } | undefined;
};

type PlansNavigationProp = NativeStackNavigationProp<
  PlansStackParamList,
  "Plans"
>;

/**
 * PlansScreen
 * - Mostra os roteiros salvos do usuário
 * - Permite navegar para CreatePlanScreen para criar ou editar
 * - Permite deletar um roteiro
 */
export const PlansScreen = ({
  navigation,
}: {
  navigation: PlansNavigationProp;
}) => {
  const { plans, loadPlans, removePlan, isLoading } = usePlansStore();
  const { user } = useAuthStore();

  const isFocused = useIsFocused();
  const [loadingRemote, setLoadingRemote] = useState(false);

  useEffect(() => {
    const doLoad = async () => {
      if (user?.id) {
        setLoadingRemote(true);
        try {
          await loadPlans(user.id);
        } catch (err) {
          console.error("Failed to load plans", err);
          Alert.alert("Erro", "Falha ao carregar roteiros");
        } finally {
          setLoadingRemote(false);
        }
      }
    };

    if (isFocused) {
      doLoad();
    }
  }, [user?.id, isFocused, loadPlans]);

  const handleNewPlan = () => {
    navigation.navigate("CreatePlan", { id: undefined });
  };

  const handleEditPlan = (planId: string) => {
    navigation.navigate("CreatePlan", { id: planId });
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert("Remover roteiro", `Deseja remover "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removePlan(id);
            Alert.alert("Sucesso", "Roteiro removido");
          } catch (error) {
            console.error("Failed to remove plan", error);
            Alert.alert("Erro", "Falha ao remover roteiro");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => {
    const startDate = new Date(item.startDate).toLocaleDateString("pt-BR");
    const endDate = new Date(item.endDate).toLocaleDateString("pt-BR");
    const placesCount = item.places?.length || 0;
    const syncStatus = item.offline ? "Local" : "Sincronizado";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardMetaText}>
                {startDate} — {endDate}
              </Text>
              <Text style={styles.cardMetaDot}>•</Text>
              <Text style={styles.cardMetaText}>
                {placesCount} {placesCount === 1 ? "local" : "locais"}
              </Text>
            </View>
            <View style={styles.syncBadge}>
              <Text style={styles.syncBadgeText}>{syncStatus}</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditPlan(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Edit2 size={18} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => confirmDelete(item.id, item.name)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={18} color={colors.destructive} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.icon}>
              <Map size={18} color={colors.primaryForeground} />
            </View>
            <Text style={styles.title}>Meus Roteiros</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Faça login para ver seus roteiros
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingRemote || isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.icon}>
              <Map size={18} color={colors.primaryForeground} />
            </View>
            <Text style={styles.title}>Meus Roteiros</Text>
          </View>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { marginTop: 12 }]}>
            Carregando roteiros...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.icon}>
            <Map size={18} color={colors.primaryForeground} />
          </View>
          <Text style={styles.title}>Meus Roteiros</Text>
        </View>
        <Button title="Novo" onPress={handleNewPlan} />
      </View>

      {plans.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconContainer}>
            <Map size={48} color={colors.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum roteiro criado</Text>
          <Text style={styles.emptySubtitle}>
            Crie seu primeiro roteiro para explorar Manaus
          </Text>
          <Button 
            title="Criar Primeiro Roteiro"
            onPress={handleNewPlan}
          />
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
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
    fontSize: 18,
    color: colors.foreground,
    fontFamily: fontFamily.bold,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
    fontSize: 16,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardMetaText: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  cardMetaDot: {
    color: colors.mutedForeground,
  },
  syncBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.muted,
    borderRadius: radius.sm,
    marginTop: 4,
  },
  syncBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.medium,
    color: colors.mutedForeground,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: colors.muted,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyText: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    marginBottom: 12,
  },
});