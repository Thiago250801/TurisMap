import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, radius } from "../../theme";
import { Button } from "../../components/Button";
import { usePlansStore } from "../../store/usePlanStore";
import { useAuthStore } from "../../store/useAuthStore";
import { suggestions, popularPlaces } from "../../data/mockData";
import { getPlaceImage } from "../../hooks/usePlace";
import { ArrowLeft, MapPin, Calendar, Zap } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type RootStackParamList = {
  CreatePlan: { id?: string } | undefined;
};

type CreatePlanNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePlan"
>;

type CreatePlanRouteProp = RouteProp<RootStackParamList, "CreatePlan">;

export const CreatePlanScreen = ({
  navigation,
  route,
}: {
  navigation: CreatePlanNavigationProp;
  route: CreatePlanRouteProp;
}) => {
  const planId = route.params?.id;
  const isEditing = !!planId;

  const { plans, addPlan, updatePlan, loadPlans } = usePlansStore();
  const { user } = useAuthStore();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 86400000)); // Próximo dia
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [syncOnline, setSyncOnline] = useState(true);
  const [saving, setSaving] = useState(false);

  // DateTimePicker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Combina suggestions e popularPlaces
  const allPlaces = [...suggestions, ...popularPlaces].filter((place, index, self) =>
    index === self.findIndex((p) => p.id === place.id)
  );

  // Função para formatar data em pt-BR
  const formatDatePtBR = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Handler para DateTimePicker (funciona em iOS e Android)
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  useEffect(() => {
    // Se está editando, carrega os dados do plano
    if (isEditing && planId) {
      const plan = plans.find((p) => p.id === planId);
      if (plan) {
        setName(plan.name);
        setStartDate(new Date(plan.startDate));
        setEndDate(new Date(plan.endDate));
        setSelectedPlaces(plan.places || []);
        setSyncOnline(!plan.offline);
      }
    }
  }, [isEditing, planId, plans]);

  const validateDates = () => {
    return endDate >= startDate;
  };

  const togglePlace = (id: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Validação", "Informe um nome para o roteiro");
      return;
    }

    if (!validateDates()) {
      Alert.alert("Validação", "A data final não pode ser antes da data inicial");
      return;
    }

    if (selectedPlaces.length === 0) {
      Alert.alert("Validação", "Selecione ao menos um lugar");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        offline: !syncOnline,
        places: selectedPlaces,
      };

      if (isEditing && planId) {
        await updatePlan(planId, payload);
        Alert.alert("Sucesso", "Roteiro atualizado");
      } else {
        await addPlan(user.id, payload);
        Alert.alert("Sucesso", "Roteiro criado");
      }

      // Recarrega e volta
      await loadPlans(user.id);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save plan", error);
      Alert.alert("Erro", "Falha ao salvar roteiro");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar Roteiro" : "Criar Roteiro"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Nome do Roteiro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nome do roteiro *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Roteiro cultural Manaus"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Datas com DateTimePicker */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Data início *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Calendar size={18} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {formatDatePtBR(startDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Data fim *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Calendar size={18} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {formatDatePtBR(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sincronização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sincronização</Text>

          <TouchableOpacity
            style={[
              styles.syncCard,
              syncOnline && styles.syncCardActive,
            ]}
            onPress={() => setSyncOnline(true)}
          >
            <View style={styles.syncCardContent}>
              <View
                style={[
                  styles.syncIcon,
                  syncOnline && styles.syncIconActive,
                ]}
              >
                <Zap size={20} color={syncOnline ? colors.primary : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.syncTitle}>Sincronizar online</Text>
                <Text style={styles.syncSubtitle}>
                  Acesse seu roteiro em qualquer dispositivo
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  syncOnline && styles.radioButtonSelected,
                ]}
              >
                {syncOnline && <View style={styles.radioButtonDot} />}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.syncCard,
              !syncOnline && styles.syncCardActive,
            ]}
            onPress={() => setSyncOnline(false)}
          >
            <View style={styles.syncCardContent}>
              <View
                style={[
                  styles.syncIcon,
                  !syncOnline && styles.syncIconActive,
                ]}
              >
                <MapPin size={20} color={!syncOnline ? colors.primary : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.syncTitle}>Apenas offline</Text>
                <Text style={styles.syncSubtitle}>
                  Salvo apenas neste dispositivo
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  !syncOnline && styles.radioButtonSelected,
                ]}
              >
                {!syncOnline && <View style={styles.radioButtonDot} />}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Lugares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locais do Roteiro *</Text>
          <Text style={styles.sectionSubtitle}>
            Selecione {selectedPlaces.length > 0 ? `(${selectedPlaces.length}) ` : ""}os locais
          </Text>

          <View style={styles.grid}>
            {allPlaces.map((place) => {
              const selected = selectedPlaces.includes(place.id);
              const placeImage = getPlaceImage(place.id);

              return (
                <TouchableOpacity
                  key={place.id}
                  style={[
                    styles.placeCard,
                    selected && styles.placeCardSelected,
                  ]}
                  onPress={() => togglePlace(place.id)}
                  activeOpacity={0.7}
                >
                  {placeImage ? (
                    <Image
                      source={placeImage}
                      style={styles.placeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeImagePlaceholder}>
                      <MapPin size={24} color={colors.mutedForeground} />
                    </View>
                  )}

                  <View style={styles.placeCardOverlay}>
                    <Text style={styles.placeCardTitle}>{place.title}</Text>
                  </View>

                  {selected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <Button
            title={saving ? "Salvando..." : isEditing ? "Atualizar Roteiro" : "Criar Roteiro"}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </ScrollView>

      {/* DateTimePicker - Data Início */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
          locale="pt-BR"
        />
      )}

      {/* DateTimePicker - Data Fim */}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
          locale="pt-BR"
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
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  container: {
    padding: 24,
    paddingBottom: 100,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: colors.mutedForeground,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.foreground,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontFamily: fontFamily.regular,
    color: colors.foreground,
    backgroundColor: colors.card,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.card,
    gap: 10,
  },
  dateButtonText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    color: colors.foreground,
    fontSize: 14,
  },
  syncCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  syncCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.muted,
  },
  syncCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  syncIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  syncIconActive: {
    backgroundColor: colors.primary,
  },
  syncTitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },
  syncSubtitle: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  placeCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.border,
  },
  placeCardSelected: {
    borderColor: colors.primary,
  },
  placeImage: {
    width: "100%",
    height: "100%",
  },
  placeImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  placeCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  placeCardTitle: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: colors.primaryForeground,
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadgeText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.primaryForeground,
  },
  footer: {
    gap: 12,
    marginTop: 8,
  },
});