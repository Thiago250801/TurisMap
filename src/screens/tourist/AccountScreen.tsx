import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import {
  User,
  Heart,
  History,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontFamily, radius } from "../../theme";
import { useFavoritesStore } from "../../store/useFavoriteStore";
import { useAuthStore } from "../../store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlacesStore } from "../../store/usePlacesStore";

type RootStackParamList = {
  Account: undefined;
  Favorites: undefined;
  History: undefined;
  Home: undefined;
  Auth: undefined;
};

type AccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Account"
>;

interface Props {
  navigation: AccountScreenNavigationProp;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onPress: () => void;
  color: string;
}

export const AccountScreen = ({ navigation }: Props) => {
  const { favorites } = useFavoritesStore();
  const { all } = usePlacesStore();
  const { user, logout, isLoading } = useAuthStore();

  const stats = [
    { label: "Lugares", value: all.length.toString() },
    { label: "Favoritos", value: favorites.length.toString() },
  ];

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "favorites",
        icon: <Heart size={20} color={colors.destructive} />,
        label: "Favoritos",
        description: `${favorites.length} lugares salvos`,
        onPress: () => navigation.navigate("FavoritesTab" as never),
        color: colors.destructive,
      },
      {
        id: "history",
        icon: <History size={20} color={colors.primary} />,
        label: "Histórico",
        description: "Lugares visitados",
        onPress: () => { Alert.alert("Em desenvolvimento", "Esta funcionalidade será implementada em breve");},
        color: colors.primary,
      },
      {
        id: "settings",
        icon: <Settings size={20} color={colors.mutedForeground} />,
        label: "Configurações",
        description: "Preferências do app",
        onPress: () => {
          Alert.alert("Em desenvolvimento", "Esta funcionalidade será implementada em breve");
        },
        color: colors.mutedForeground,
      },
      {
        id: "help",
        icon: <HelpCircle size={20} color={colors.mutedForeground} />,
        label: "Ajuda",
        description: "Suporte e FAQ",
        onPress: () => {
          Alert.alert("Em desenvolvimento", "Esta funcionalidade será implementada em breve");
        },
        color: colors.mutedForeground,
      },
    ],
    [favorites.length, navigation]
  );

  const handleLogout = async () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Erro", "Falha ao fazer logout");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Conta</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatar}>
              <User size={32} color={colors.primaryForeground} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Viajante"}</Text>
              <Text style={styles.profileEmail}>{user?.email || "viajante@turismap.com"}</Text>

              <View style={styles.locationTag}>
                <MapPin size={12} color={colors.primary} />
                <Text style={styles.locationText}>Manaus, AM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemContent}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  {item.icon}
                </View>

                <View style={styles.menuItemText}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>

              <ChevronRight size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <LogOut size={20} color={colors.destructive} />
          <Text style={styles.logoutText}>
            {isLoading ? "Saindo..." : "Sair da conta"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 120,
    gap: 24,
  },

  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
    gap: 4,
  },

  profileName: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  profileEmail: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  locationText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.primary,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  statValue: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },

  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
    marginTop: 8,
  },

  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  menuItemText: {
    flex: 1,
    gap: 2,
  },

  menuLabel: {
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },

  menuDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: fontFamily.regular,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.xl,
    backgroundColor: `${colors.destructive}15`,
    gap: 8,
    marginTop: 12,
  },

  logoutButtonDisabled: {
    opacity: 0.6,
  },

  logoutText: {
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
    color: colors.destructive,
  },
});