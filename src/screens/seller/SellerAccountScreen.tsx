import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  User,
  Store,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Key,
} from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontFamily, radius } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";

type RootStackParamList = {
  SellerAccount: undefined;
  SellerVitrine: undefined;
  SellerProducts: undefined;
  Auth: undefined;
};

type SellerAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SellerAccount"
>;

interface Props {
  navigation: SellerAccountScreenNavigationProp;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onPress: () => void;
  color: string;
}

export const SellerAccountScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { logout, isLoading, user } = useAuthStore();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "store",
        icon: <Store size={20} color={colors.primary} />,
        label: "Minha Loja",
        description: "Configurações da loja",
        onPress: () => navigation.navigate("StoreSettings" as never),
        color: colors.primary,
      },
      {
        id: "products",
        icon: <Package size={20} color={colors.primary} />,
        label: "Produtos",
        description: "Gerenciar catálogo",
        onPress: () => navigation.navigate("ProductsTab" as never),
        color: colors.primary,
      },
      {
        id: "password",
        icon: <Key size={20} color={colors.mutedForeground} />,
        label: "Alterar Senha",
        description: "Segurança da conta",
        onPress: () => {
          Alert.alert(
            "Em desenvolvimento",
            "Esta funcionalidade será implementada em breve"
          );
        },
        color: colors.mutedForeground,
      },
      {
        id: "settings",
        icon: <Settings size={20} color={colors.mutedForeground} />,
        label: "Configurações",
        description: "Preferências do app",
        onPress: () => {
          Alert.alert(
            "Em desenvolvimento",
            "Esta funcionalidade será implementada em breve"
          );
        },
        color: colors.mutedForeground,
      },
      {
        id: "help",
        icon: <HelpCircle size={20} color={colors.mutedForeground} />,
        label: "Ajuda",
        description: "Suporte e FAQ",
        onPress: () => {
          Alert.alert(
            "Em desenvolvimento",
            "Esta funcionalidade será implementada em breve"
          );
        },
        color: colors.mutedForeground,
      },
    ],
    [navigation]
  );

  const handleLogout = async () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Erro", "Falha ao fazer logout");
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Conta</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatar}>
              <User size={32} color={colors.primaryForeground} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Vendedor"}</Text>
              <Text style={styles.profileEmail}>{user?.email || "vendedor@turismap.com"}</Text>

              <View style={styles.typeTag}>
                <Store size={12} color={colors.primary} />
                <Text style={styles.typeText}>Comerciante</Text>
              </View>
            </View>
          </View>
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
              disabled={isLoading}
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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

  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  typeText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.primary,
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