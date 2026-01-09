import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MapPin, Bell } from "lucide-react-native";
import { colors, fontFamily, radius } from "../../theme";
import { SearchBar } from "../../components/SearchBar";
import { useState } from "react";
import { PlaceCard } from "../../components/PlaceCard";
import teatroAmazonas from "../../assets/Teatro_Amazonas.jpg"

export const TouristHomeScreen = () => {

  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      {/* HEADER */}
<View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <MapPin size={18} color={colors.primaryForeground} />
            </View>
            <Text style={styles.logoText}>
              turis<Text style={styles.logoPrimary}>map</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.notification}>
            <Bell size={22} color={colors.foreground} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* SearchBar inserida aqui */}
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Buscar lugares, experiências..." 
        />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Popular entre os usuários</Text>
        <PlaceCard title="Teatro Amazonas" rating={4.5} image={teatroAmazonas} />
        <Text style={styles.sectionTitle}>Sugestões do Turismap</Text>
        <Text style={styles.placeholder}>Cards virão aqui 👇</Text>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16, 
  },


  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logoIcon: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 20,
    color: colors.foreground,
    fontFamily: fontFamily.bold,
  },

  logoPrimary: {
    color: colors.primary,
  },

  notification: {
    position: "relative",
  },

  badge: {
    width: 8,
    height: 8,
    backgroundColor: colors.destructive,
    borderRadius: 4,
    position: "absolute",
    top: 0,
    right: 0,
  },

  content: {
    padding: 24,
    gap: 24,
  },

  sectionTitle: {
    fontSize: 18,
    color: colors.foreground,
    fontFamily: fontFamily.semiBold,
  },

  placeholder: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.medium,
  },
});
