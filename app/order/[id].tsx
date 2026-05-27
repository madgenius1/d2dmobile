import React from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Text";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";

export default function OrderDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useAppContext();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Ionicons name="cube-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Order not found</Text>
      </View>
    );
  }

  const steps = [
    { label: "Order Placed", done: true, icon: "checkmark-circle" as const },
    { label: "Picked Up", done: order.status !== "scheduled", icon: "cube" as const },
    { label: "On the Way", done: order.status === "on-the-way" || order.status === "completed", icon: "car" as const },
    { label: "Delivered", done: order.status === "completed", icon: "location" as const },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 60 : 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardTop}>
          <View>
            <Text style={[styles.orderId, { color: colors.mutedForeground }]}>{order.id}</Text>
            <Text style={[styles.recipient, { color: colors.foreground }]}>{order.recipient}</Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>${order.price.toFixed(2)}</Text>
      </View>

      {/* Route */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>ROUTE</Text>
        <View style={styles.routeRow}>
          <View style={styles.routeConnector}>
            <View style={[styles.greenDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dash, { borderColor: "#C8E6C9" }]} />
            <Ionicons name="location" size={18} color="#8B0000" />
          </View>
          <View style={styles.routeAddresses}>
            <View>
              <Text style={[styles.addrLabel, { color: colors.primary }]}>PICKUP</Text>
              <Text style={[styles.addr, { color: colors.foreground }]}>{order.pickup}</Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.addrLabel, { color: "#8B0000" }]}>DROP-OFF</Text>
              <Text style={[styles.addr, { color: colors.foreground }]}>{order.dropoff}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>STATUS TIMELINE</Text>
        {steps.map((step, i) => (
          <View key={step.label} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: step.done ? colors.primary : colors.muted, borderColor: step.done ? colors.primary : colors.border }]}>
                <Ionicons name={step.icon} size={12} color={step.done ? "#fff" : colors.mutedForeground} />
              </View>
              {i < steps.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: step.done ? colors.primary : colors.border }]} />
              )}
            </View>
            <Text style={[styles.timelineLabel, { color: step.done ? colors.foreground : colors.mutedForeground, fontWeight: step.done ? "700" : "500" }]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Details */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>DETAILS</Text>
        {[
          { label: "Package Size", value: order.size },
          { label: "Speed", value: order.speed },
          { label: "Price", value: `$${order.price.toFixed(2)}` },
          order.eta ? { label: "ETA", value: order.eta } : null,
          order.reason ? { label: "Note", value: order.reason } : null,
        ].filter(Boolean).map((row) => (
          <View key={row!.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{row!.label}</Text>
            <Text style={[styles.detailValue, { color: colors.foreground }]}>{row!.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 16, fontWeight: "600" },
  card: { borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  orderId: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  recipient: { fontSize: 20, fontWeight: "800", marginTop: 2 },
  price: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, marginBottom: 14 },
  routeRow: { flexDirection: "row", gap: 14 },
  routeConnector: { alignItems: "center", paddingTop: 4, width: 20 },
  greenDot: { width: 12, height: 12, borderRadius: 6 },
  dash: { flex: 1, borderLeftWidth: 2, borderStyle: "dashed", minHeight: 40, marginVertical: 4 },
  routeAddresses: { flex: 1 },
  addrLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 2 },
  addr: { fontSize: 14, fontWeight: "600" },
  timelineRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, minHeight: 36 },
  timelineLeft: { alignItems: "center", width: 28 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, flex: 1, minHeight: 16, marginTop: 4 },
  timelineLabel: { fontSize: 14, paddingTop: 5 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1 },
  detailLabel: { fontSize: 13, fontWeight: "500" },
  detailValue: { fontSize: 13, fontWeight: "700" },
});
