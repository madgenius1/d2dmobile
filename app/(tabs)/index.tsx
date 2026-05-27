import React from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";
import { OrderCard } from "@/components/OrderCard";

const UNREAD_NOTIF_COUNT = 2;

export default function HomeScreen() {
  const colors = useColors();
  const { user, orders } = useAppContext();
  const insets = useSafeAreaInsets();
  const firstName = user.name.split(" ")[0];
  const recentOrders = orders.slice(0, 3);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function nav(path: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path as any);
  }

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Platform.OS === "web" ? 120 : 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.logo, { color: colors.primary }]}>D2D</Text>
        <View style={styles.headerRight}>
          <Pressable
            onPress={() => nav("/notifications")}
            style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
            {UNREAD_NOTIF_COUNT > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
                <Text style={styles.badgeText}>{UNREAD_NOTIF_COUNT}</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={({ pressed }) => [
              styles.avatar,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {firstName}
        </Text>
        <Text style={[styles.subGreeting, { color: colors.mutedForeground }]}>
          Ready to move something today?
        </Text>

        {/* Send Package Hero */}
        <Pressable
          onPress={() => nav("/create-order")}
          style={({ pressed }) => [styles.hero, { opacity: pressed ? 0.9 : 1 }]}
        >
          <Ionicons name="cube" size={36} color="#fff" />
          <Text style={styles.heroTitle}>Send a Package</Text>
          <Text style={styles.heroSub}>Instant pickup and delivery</Text>
          <View style={[styles.heroBtn, { backgroundColor: colors.card }]}>
            <Text style={[styles.heroBtnText, { color: colors.primary }]}>Start Order</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </View>
        </Pressable>

        {/* Create Errand */}
        <Pressable
          onPress={() => nav("/create-errand")}
          style={({ pressed }) => [
            styles.errandRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={[styles.errandIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="bag-outline" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.errandText, { color: colors.foreground }]}>
            Create an Errand
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
        </Pressable>

        {/* Recent Orders */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent Orders
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/orders")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </Pressable>
        </View>

        {recentOrders.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="cube-outline" size={44} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
              No orders yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Tap "Send a Package" to get started
            </Text>
          </View>
        ) : (
          recentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => nav(`/order/${order.id}`)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
  },
  logo: { fontSize: 26, fontWeight: "900", letterSpacing: -1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBtn: { padding: 4, position: "relative" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  body: { padding: 20 },
  greeting: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  subGreeting: { fontSize: 15, fontWeight: "500", marginTop: 4, marginBottom: 20 },
  hero: {
    backgroundColor: "#00880e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    gap: 4,
  },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 8 },
  heroSub: { color: "#d4f7d4", fontSize: 14, fontWeight: "500" },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  heroBtnText: { fontWeight: "700", fontSize: 14 },
  errandRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 24,
    gap: 12,
  },
  errandIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  errandText: { flex: 1, fontSize: 16, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800" },
  seeAll: { fontSize: 14, fontWeight: "700" },
  emptyCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyText: { fontSize: 13, fontWeight: "500", textAlign: "center" },
});
