import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";

export default function TrackScreen() {
  const colors = useColors();
  const { orders } = useAppContext();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const active = orders.filter(
    (o) => o.status === "on-the-way" || o.status === "picked-up"
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Track</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 120 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {active.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="location-outline" size={52} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No active deliveries
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Your in-transit orders will appear here
            </Text>
          </View>
        ) : (
          active.map((order) => (
            <View
              key={order.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              {/* Status */}
              <View style={styles.cardTop}>
                <View>
                  <Text style={[styles.orderId, { color: colors.mutedForeground }]}>
                    {order.id}
                  </Text>
                  <Text style={[styles.recipient, { color: colors.foreground }]}>
                    {order.recipient}
                  </Text>
                </View>
                <StatusBadge status={order.status} />
              </View>

              {/* Route visual */}
              <View style={[styles.routeCard, { backgroundColor: colors.background }]}>
                <View style={styles.routeRow}>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>PICKUP</Text>
                    <Text style={[styles.routeAddr, { color: colors.foreground }]} numberOfLines={1}>
                      {order.pickup}
                    </Text>
                  </View>
                </View>
                <View style={[styles.connector, { borderColor: colors.border }]} />
                <View style={styles.routeRow}>
                  <Ionicons name="location" size={16} color="#8B0000" />
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>DROP-OFF</Text>
                    <Text style={[styles.routeAddr, { color: colors.foreground }]} numberOfLines={1}>
                      {order.dropoff}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ETA */}
              {order.eta && (
                <View style={[styles.etaRow, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={[styles.etaText, { color: colors.primary }]}>
                    Estimated arrival: {order.eta}
                  </Text>
                </View>
              )}

              {/* Courier card */}
              <View style={[styles.courierCard, { borderColor: colors.border }]}>
                <View style={[styles.courierAvatar, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
                <View style={styles.courierInfo}>
                  <Text style={[styles.courierName, { color: colors.foreground }]}>Marcus Johnson</Text>
                  <Text style={[styles.courierSub, { color: colors.mutedForeground }]}>
                    {order.speed} Courier • ⭐ 4.9
                  </Text>
                </View>
                <View style={styles.courierActions}>
                  <View style={[styles.callBtn, { backgroundColor: colors.secondary }]}>
                    <Ionicons name="call-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={[styles.callBtn, { backgroundColor: colors.secondary }]}>
                    <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
  },
  title: { fontSize: 22, fontWeight: "800" },
  content: { padding: 16 },
  empty: { alignItems: "center", gap: 12, paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14, fontWeight: "500", textAlign: "center", paddingHorizontal: 40 },
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  recipient: { fontSize: 17, fontWeight: "700", marginTop: 2 },
  routeCard: { borderRadius: 12, padding: 12, gap: 4 },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  routeInfo: { flex: 1 },
  routeLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  routeAddr: { fontSize: 13, fontWeight: "600", marginTop: 1 },
  connector: {
    borderLeftWidth: 2,
    borderStyle: "dashed",
    height: 16,
    marginLeft: 5,
  },
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  etaText: { fontSize: 13, fontWeight: "700" },
  courierCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    paddingTop: 14,
  },
  courierAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  courierInfo: { flex: 1 },
  courierName: { fontSize: 14, fontWeight: "700" },
  courierSub: { fontSize: 12, fontWeight: "500", marginTop: 1 },
  courierActions: { flexDirection: "row", gap: 8 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
