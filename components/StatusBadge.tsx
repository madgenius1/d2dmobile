import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/Text";
import type { OrderStatus, ErrandStatus } from "@/context/AppContext";

type Status = OrderStatus | ErrandStatus;

const CONFIG: Record<string, { bg: string; text: string; dot?: string; label: string }> = {
  "on-the-way":  { bg: "#e8f5e9", text: "#099D15", dot: "#099D15", label: "On the Way" },
  "picked-up":   { bg: "#e8f5e9", text: "#099D15", dot: "#099D15", label: "Picked Up" },
  completed:     { bg: "#099D15", text: "#ffffff", label: "Completed" },
  scheduled:     { bg: "#f5f5f5", text: "#737373", label: "Scheduled" },
  cancelled:     { bg: "#fce8e8", text: "#8B0000", label: "Cancelled" },
};

export function StatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? { bg: "#f5f5f5", text: "#737373", label: status };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      {cfg.dot && (
        <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      )}
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
