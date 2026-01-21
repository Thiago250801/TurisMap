import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
  Switch,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Check, WifiOff, AlertCircle, Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, fontFamily, radius } from "../../theme";
import { suggestions, popularPlaces } from "../../data/mockData";
import { Button } from "../../components/Button";
import { usePlansStore } from "../../store/usePlanStore";

type FormData = {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  offline: boolean;
};

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const isDateAfter = (start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return true;
  return start <= end;
};

export const CreatePlanScreen = () => {
  const { addPlan } = usePlansStore();
  const [loading, setLoading] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      startDate: null,
      endDate: null,
      offline: false,
    },
    mode: "onBlur",
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const allPlaces = [...suggestions, ...popularPlaces];

  const togglePlace = (id: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleStartDateChange = (
    event: any,
    selectedDate?: Date,
    fieldChange?: (value: Date | null) => void
  ) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }
    if (selectedDate && fieldChange) {
      fieldChange(selectedDate);
    }
  };

  const handleEndDateChange = (
    event: any,
    selectedDate?: Date,
    fieldChange?: (value: Date | null) => void
  ) => {
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }
    if (selectedDate && fieldChange) {
      fieldChange(selectedDate);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.startDate || !data.endDate) {
      Alert.alert(
        "Datas obrigatórias",
        "Informe as datas de início e fim do roteiro"
      );
      return;
    }

    if (selectedPlaces.length === 0) {
      Alert.alert(
        "Selecione um local",
        "Escolha pelo menos um lugar para o roteiro"
      );
      return;
    }

    if (!isDateAfter(data.startDate, data.endDate)) {
      Alert.alert(
        "Datas inválidas",
        "A data de fim deve ser depois da data de início"
      );
      return;
    }

    setLoading(true);
    try {
      addPlan({
        id: `plan-${Date.now()}`,
        name: data.name.trim(),
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        offline: data.offline,
        places: selectedPlaces,
      });

      Alert.alert("Sucesso!", "Seu roteiro foi salvo com sucesso", [
        { text: "OK", onPress: () => {} },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar o roteiro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.icon}>
            <Check size={18} color={colors.primaryForeground} />
          </View>
          <Text style={styles.title}>Criar Roteiro</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Nome */}
        <View style={styles.field}>
          <Text style={styles.label}>Nome do roteiro</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Informe o nome do roteiro",
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "Máximo 50 caracteres",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Ex: Fim de semana em Manaus"
                value={value}
                onChangeText={onChange}
                maxLength={50}
                placeholderTextColor={colors.mutedForeground}
              />
            )}
          />
          {errors.name && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.destructive} />
              <Text style={styles.error}>{errors.name.message}</Text>
            </View>
          )}
        </View>

        {/* Datas */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Data início</Text>
            <Controller
              control={control}
              name="startDate"
              rules={{
                required: "Obrigatório",
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    style={[
                      styles.dateInput,
                      errors.startDate && styles.inputError,
                    ]}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Calendar
                      size={18}
                      color={value ? colors.foreground : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.dateText,
                        !value && styles.dateTextPlaceholder,
                      ]}
                    >
                      {value ? formatDate(value) : "Selecionar data"}
                    </Text>
                  </Pressable>

                  {showStartDatePicker && (
                    <DateTimePicker
                      accentColor={colors.primary}
                      textColor={colors.foreground}
                      value={value || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) =>
                        handleStartDateChange(event, selectedDate, onChange)
                      
                      }
                      locale="pt-BR"
                    />
                  )}

                  {Platform.OS === "ios" && showStartDatePicker && (
                    <Pressable
                      style={styles.datePickerDone}
                      onPress={() => setShowStartDatePicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Pronto</Text>
                    </Pressable>
                  )}

                  {errors.startDate && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={14} color={colors.destructive} />
                      <Text style={styles.error}>
                        {errors.startDate.message}
                      </Text>
                    </View>
                  )}
                </>
              )}
            />
          </View>

          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Data fim</Text>
            <Controller
              control={control}
              name="endDate"
              rules={{
                required: "Obrigatório",
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    style={[
                      styles.dateInput,
                      errors.endDate && styles.inputError,
                    ]}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Calendar
                      size={18}
                      color={value ? colors.foreground : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.dateText,
                        !value && styles.dateTextPlaceholder,
                      ]}
                    >
                      {value ? formatDate(value) : "Selecionar data"}
                    </Text>
                  </Pressable>

                  {showEndDatePicker && (
                    <DateTimePicker
                      value={value || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) =>
                        handleEndDateChange(event, selectedDate, onChange)
                      }
                      locale="pt-BR"
                    />
                  )}

                  {Platform.OS === "ios" && showEndDatePicker && (
                    <Pressable
                      style={styles.datePickerDone}
                      onPress={() => setShowEndDatePicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Pronto</Text>
                    </Pressable>
                  )}

                  {errors.endDate && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={14} color={colors.destructive} />
                      <Text style={styles.error}>
                        {errors.endDate.message}
                      </Text>
                    </View>
                  )}
                </>
              )}
            />
          </View>
        </View>

        {/* Validação de intervalo de datas */}
        {startDate &&
          endDate &&
          !isDateAfter(startDate, endDate) && (
            <View style={styles.warningContainer}>
              <AlertCircle size={16} color={colors.destructive} />
              <Text style={styles.warningText}>
                Data de fim deve ser após a data de início
              </Text>
            </View>
          )}

        {/* Offline */}
        <Controller
          control={control}
          name="offline"
          render={({ field: { value, onChange } }) => (
            <Pressable
              style={styles.offlineCard}
              onPress={() => onChange(!value)}
            >
              <View style={styles.offlineInfo}>
                <WifiOff size={20} color={colors.primary} />
                <View>
                  <Text style={styles.offlineTitle}>Salvar offline</Text>
                  <Text style={styles.offlineSubtitle}>
                    Acesse sem internet
                  </Text>
                </View>
              </View>

              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                accessible={true}
                accessibilityLabel="Ativar modo offline"
              />
            </Pressable>
          )}
        />

        {/* Lugares */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selecione os lugares</Text>
            <Text style={styles.selectedCount}>
              {selectedPlaces.length} selecionado{selectedPlaces.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={styles.grid}>
            {allPlaces.map((place) => {
              const selected = selectedPlaces.includes(place.id);
              return (
                <Pressable
                  key={place.id}
                  onPress={() => togglePlace(place.id)}
                  style={[styles.card, selected && styles.cardSelected]}
                  accessible={true}
                  accessibilityLabel={`${place.title}, ${selected ? "selecionado" : "não selecionado"}`}
                  accessibilityRole="checkbox"
                >
                  <Image
                    source={place.image}
                    style={styles.image}
                    accessibilityIgnoresInvertColors
                  />
                  <View style={styles.overlay} />

                  {selected && (
                    <View style={styles.check}>
                      <Check size={14} color="#fff" />
                    </View>
                  )}

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {place.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {allPlaces.length === 0 && (
            <Text style={styles.emptyState}>
              Nenhum local disponível
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Botão */}
      <View style={styles.footer}>
        <Button
          title={loading ? "Criando..." : "Criar Roteiro"}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator
            color={colors.primary}
            style={styles.loader}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
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
    fontSize: 20,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
  },

  container: {
    padding: 24,
    paddingBottom: 120,
    gap: 24,
  },

  field: {
    gap: 6,
  },

  label: {
    fontFamily: fontFamily.medium,
    color: colors.foreground,
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontFamily: fontFamily.regular,
    color: colors.foreground,
    fontSize: 14,
  },

  inputError: {
    borderColor: colors.destructive,
    backgroundColor: `${colors.destructive}10`,
  },

  errorContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 4,
  },

  error: {
    fontSize: 12,
    color: colors.destructive,
    fontFamily: fontFamily.medium,
  },

  warningContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: `${colors.destructive}10`,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.destructive,
    alignItems: "center",
  },

  warningText: {
    flex: 1,
    color: colors.destructive,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  offlineCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  offlineInfo: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },

  offlineTitle: {
    fontFamily: fontFamily.medium,
    color: colors.foreground,
    fontSize: 14,
  },

  offlineSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.foreground,
  },

  selectedCount: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },

  card: {
    width: "48%",
    height: 120,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },

  cardSelected: {
    borderColor: colors.primary,
  },

  image: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  check: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 4,
  },

  cardTitle: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    color: "#fff",
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },

  emptyState: {
    textAlign: "center",
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    paddingVertical: 20,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.border,
  },

  loader: {
    marginTop: 8,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dateText: {
    fontFamily: fontFamily.regular,
    color: colors.foreground,
    fontSize: 14,
    flex: 1,
  },

  dateTextPlaceholder: {
    color: colors.mutedForeground,
  },

  datePickerDone: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: 8,
  },

  datePickerDoneText: {
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
});