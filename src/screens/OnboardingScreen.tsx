import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MapPin, Compass, Sparkles } from "lucide-react-native";
import heroAmazon from "../assets/hero-amazon2.jpg";
import { colors, radius, shadow } from "../theme/theme";
import { fontFamily } from "../theme";

type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ImageBackground source={heroAmazon} style={styles.background}>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,0.5)",
            colors.foreground,
          ]}
          style={styles.gradient}
        />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <MapPin size={22} color={colors.primaryForeground} />
          </View>
          <Text style={styles.logoText}>
            turis<Text style={styles.logoPrimary}>map</Text>
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.textGroup}>
            <Text style={styles.title}>
              Descubra a{"\n"}
              <Text style={styles.titlePrimary}>Amazônia</Text>
            </Text>

            <Text style={styles.subtitle}>
              Explore os encantos do Amazonas, desde Manaus até os rios mais
              remotos da floresta.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureBadge}>
              <Compass size={16} color={colors.primary} />
              <Text style={styles.featureText}>Roteiros</Text>
            </View>

            <View style={styles.featureBadge}>
              <Sparkles size={16} color={colors.accent} />
              <Text style={styles.featureText}>Experiências</Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Auth")}
          >
            <Text style={styles.buttonText}>Começar Exploração</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  background: {
    flex: 1,
    justifyContent: "flex-end",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  logoContainer: {
    position: "absolute",
    top: 60,
    left: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },

  logoText: {
    fontSize: 24,
    color: colors.primaryForeground,
    fontFamily: fontFamily.bold,
  },

  logoPrimary: {
    color: colors.primary,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 24,
  },

  textGroup: {
    gap: 12,
  },

  title: {
    fontSize: 36,
    color: colors.primaryForeground,
    fontFamily: fontFamily.bold,
    lineHeight: 42,
  },

  titlePrimary: {
    color: colors.primary,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontFamily: fontFamily.medium,
  },

  features: {
    flexDirection: "row",
    gap: 12,
  },

  featureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  featureText: {
    fontSize: 14,
    color: colors.primaryForeground,
    fontFamily: fontFamily.medium,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: "center",
    ...shadow.card,
  },

  buttonText: {
    fontSize: 16,
    color: colors.primaryForeground,
    fontFamily: fontFamily.semiBold,
  },
});
