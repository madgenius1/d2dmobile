import React from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Text";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import type { ErrandType } from "@/context/AppContext";

const TYPE_ICONS: Record<ErrandType, keyof typeof Ionicons.glyphMap> = {
  grocery: "bag-outline",
  pharmacy: "medkit-outline",
  document: "document-outline",
  other: "ellipsis-horizontal",
};

const TYPE_LABELS: Record<ErrandType, string> = {
  grocery: "Grocery Run",
  pharmacy: "Pharmacy",
  document: "Document Drop",
  other: "Custom",
};

export default function ErrandDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { errands } = useAppContext();
  const errand = errands.find((e) => e.id === id);

  if (!errand) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Ionicons name="bag-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Errand not found
        </Text>
      </View>
    );
  }

  const icon = TYPE_ICONS[errand.type] ?? "ellipsis-horizontal";
  const typeLabel = TYPE_LABELS[errand.type] ?? "Errand";

  const steps = [
    { label: "Errand Scheduled", done: true, icon: "checkmark-circle" as const },
    {
      label: "Courier En Route to Store",
      done: errand.status !== "scheduled",
      icon: "car" as const,
    },
    {
      label: "Items Collected",
      done: errand.status === "on-the-way" || errand.status === "completed",
      icon: "bag" as const,
    },
    {
      label: "Delivered",
      done: errand.status === "completed",
      icon: "location" as const,
    },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: Platform.OS === "web" ? 60 : 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header card */}
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.cardTop}>
          <View style={[styles.typeIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name={icon} size={24} color={colors.primary} />
          </View>
          <StatusBadge status={errand.status} />
        </View>
        <Text style={[styles.errandId, { color: colors.mutedForeground }]}>
          {errand.id}
        </Text>
        <Text style={[styles.errandName, { color: colors.foreground }]}>
          {errand.name}
        </Text>
        <Text style={[styles.errandType, { color: colors.mutedForeground }]}>
          {typeLabel}
        </Text>
      </View>

      {/* Store info */}
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.label, { color: colors.mutedForeground }]}>STORE / PICKUP</Text>
        <View style={styles.infoRow}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            {errand.store}
          </Text>
        </View>
        {errand.note && (
          <View
            style={[styles.noteBox, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <Ionicons name="information-circle-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
              {errand.note}
            </Text>
          </View>
        )}
      </View>

      {/* Courier */}
      {errand.courier && (
        <View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.label, { color: colors.mutedForeground }]}>COURIER</Text>
          <View style={styles.courierRow}>
            <View style={[styles.courierAvatar, { backgroundColor: colors.secondary }]}>
              <Ionicons name="person" size={22} color={colors.primary} />
            </View>
            <View style={styles.courierInfo}>
              <Text style={[styles.courierName, { color: colors.foreground }]}>
                {errand.courier}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={[styles.rating, { color: colors.mutedForeground }]}>
                  4.9 · Standard Courier
                </Text>
              </View>
            </View>
            <View style={styles.courierBtns}>
              <View style={[styles.courierBtn, { backgroundColor: colors.secondary }]}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
              </View>
              <View style={[styles.courierBtn, { backgroundColor: colors.secondary }]}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Timeline */}
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.label, { color: colors.mutedForeground }]}>STATUS TIMELINE</Text>
        {steps.map((step, i) => (
          <View key={step.label} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor: step.done ? colors.primary : colors.muted,
                    borderColor: step.done ? colors.primary : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={step.icon}
                  size={12}
                  color={step.done ? "#fff" : colors.mutedForeground}
                />
              </View>
              {i < steps.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: step.done ? colors.primary : colors.border },
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.timelineLabel,
                {
                  color: step.done ? colors.foreground : colors.mutedForeground,
                  fontWeight: step.done ? "700" : "500",
                },
              ]}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Details */}
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.label, { color: colors.mutedForeground }]}>DETAILS</Text>
        {[
          { label: "Errand Type", value: typeLabel },
          { label: "Fee", value: "$12.00" },
          errand.time ? { label: "Pickup Time", value: errand.time } : null,
          errand.delivered ? { label: "Delivered At", value: errand.delivered } : null,
        ]
          .filter(Boolean)
          .map((row) => (
            <View
              key={row!.label}
              style={[styles.detailRow, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
                {row!.label}
              </Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {row!.value}
              </Text>
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
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  typeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  errandId: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  errandName: { fontSize: 22, fontWeight: "800", marginTop: 4 },
  errandType: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  infoText: { fontSize: 15, fontWeight: "700", flex: 1 },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginTop: 12,
  },
  noteText: { flex: 1, fontSize: 13, fontWeight: "500" },
  courierRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  courierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  courierInfo: { flex: 1 },
  courierName: { fontSize: 15, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  rating: { fontSize: 12, fontWeight: "500" },
  courierBtns: { flexDirection: "row", gap: 8 },
  courierBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    minHeight: 36,
  },
  timelineLeft: { alignItems: "center", width: 28 },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: { width: 2, flex: 1, minHeight: 16, marginTop: 4 },
  timelineLabel: { fontSize: 14, paddingTop: 5 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: 13, fontWeight: "500" },
  detailValue: { fontSize: 13, fontWeight: "700" },
});
