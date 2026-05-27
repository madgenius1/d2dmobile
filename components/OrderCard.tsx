import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { StatusBadge } from "@/components/StatusBadge";
import type { Order } from "@/context/AppContext";

type Props = { order: Order; onPress: () => void };

export function OrderCard({ order, onPress }: Props) {
  const colors = useColors();

  const statusLine = order.eta
    ? `ETA ${order.eta}`
    : order.delivered
    ? `Delivered ${order.delivered}`
    : order.date
    ? order.date
    : order.reason
    ? order.reason
    : "In progress";

  const statusIcon =
    order.status === "completed"
      ? "checkmark-circle"
      : order.status === "cancelled"
      ? "close-circle"
      : order.status === "scheduled"
      ? "time"
      : "car";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.top}>
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
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.bottom}>
        <View style={styles.statusRow}>
          <Ionicons name={statusIcon as any} size={14} color={colors.mutedForeground} />
          <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
            {statusLine}
          </Text>
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>
          ${order.price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  recipient: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  divider: { height: 1, marginBottom: 12 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: 13, fontWeight: "500" },
  price: { fontSize: 18, fontWeight: "800" },
});
