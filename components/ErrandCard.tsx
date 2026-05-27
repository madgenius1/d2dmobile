import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { StatusBadge } from "@/components/StatusBadge";
import type { Errand, ErrandType } from "@/context/AppContext";

const TYPE_ICONS: Record<ErrandType, keyof typeof Ionicons.glyphMap> = {
  grocery: "bag-outline",
  pharmacy: "medkit-outline",
  document: "document-outline",
  other: "ellipsis-horizontal",
};

type Props = { errand: Errand; onPress: () => void };

export function ErrandCard({ errand, onPress }: Props) {
  const colors = useColors();
  const icon = TYPE_ICONS[errand.type] ?? "ellipsis-horizontal";

  const sub = errand.courier
    ? `Courier: ${errand.courier}`
    : errand.time
    ? errand.time
    : errand.delivered
    ? `Delivered ${errand.delivered}`
    : errand.note ?? "";

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
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.foreground }]}>{errand.name}</Text>
          <Text style={[styles.store, { color: colors.mutedForeground }]} numberOfLines={1}>
            {errand.store}
          </Text>
          {!!sub && (
            <Text style={[styles.sub, { color: colors.mutedForeground }]} numberOfLines={1}>
              {sub}
            </Text>
          )}
        </View>
        <StatusBadge status={errand.status} />
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
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  store: { fontSize: 13, fontWeight: "500", marginTop: 2 },
  sub: { fontSize: 12, fontWeight: "500", marginTop: 1 },
});
