import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, radius } from "../../theme";
import { ArrowLeft, Calendar, MapPin } from "lucide-react-native";
import { usePlansStore } from "../../store/usePlanStore";
import { suggestions, popularPlaces } from "../../data/mockData";
import { getPlaceImage } from "../../hooks/usePlace";

type RootStackParamList = {
  ViewPlan: { id: string };
  Place: { id: string };
};

type ViewPlanNavigationProp = NativeStackNavigationProp<RootStackParamList, "ViewPlan">;
type ViewPlanRouteProp = RouteProp<RootStackParamList, "ViewPlan">;

export const ViewPlanScreen = ({
  navigation,
  route,
}: {
  navigation: ViewPlanNavigationProp;
  route: ViewPlanRouteProp;
}) => {
  const { plans } = usePlansStore();
  const plan = plans.find((p) => p.id === route.params.id);

  const allPlaces = useMemo(() => {
    return [...suggestions, ...popularPlaces].filter(
      (p, i, arr) => i === arr.findIndex((x) => x.id === p.id),
    );
  }, []);

  if (!plan) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.error}>Roteiro não encontrado</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Roteiro</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Info */}
        <View style={styles.card}>
          <Text style={styles.planName}>{plan.name}</Text>

          <View style={styles.metaRow}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.metaText}>
              {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.metaText}>
              {plan.places.length} locais selecionados
            </Text>
          </View>
        </View>

        {/* Locais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locais do roteiro</Text>

          <View style={styles.grid}>
            {plan.places.map((placeId) => {
              const place = allPlaces.find((p) => p.id === placeId);
              const image = getPlaceImage(placeId);

              if (!place) return null;

              return (
                <TouchableOpacity
                  key={place.id}
                  style={styles.placeCard}
                  onPress={() =>
                    navigation.navigate("Place", { id: place.id })
                  }
                >
                  {image ? (
                    <Image source={image} style={styles.image} />
                  ) : (
                    <View style={styles.placeholder} />
                  )}

                  <View style={styles.overlay}>
                    <Text style={styles.placeTitle}>{place.title}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  container: {
    padding: 24,
    gap: 24,
  },

  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },

  planName: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  metaText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
  },

  section: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  placeCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    backgroundColor: colors.muted,
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  placeTitle: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: colors.primaryForeground,
  },

  error: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
