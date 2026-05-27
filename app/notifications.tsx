import React from "react";
import { View, FlatList, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const NOTIFICATIONS = [
  { id: "1", title: "Package Picked Up", body: "Your order D2D-89021 has been picked up by Marcus J.", time: "2m ago", icon: "cube" as const, read: false },
  { id: "2", title: "On the Way", body: "Your delivery to Alex Thompson is on its way!", time: "15m ago", icon: "car" as const, read: false },
  { id: "3", title: "Order Delivered", body: "Order D2D-88210 was successfully delivered.", time: "Yesterday", icon: "checkmark-circle" as const, read: true },
  { id: "4", title: "Errand Scheduled", body: "Your grocery errand at Whole Foods is confirmed for today.", time: "Yesterday", icon: "bag" as const, read: true },
  { id: "5", title: "Courier Assigned", body: "Marcus Johnson will handle your next order.", time: "2 days ago", icon: "person" as const, read: true },
];

export default function NotificationsScreen() {
  const colors = useColors();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(n) => n.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 60 : 40 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.notif,
              {
                backgroundColor: item.read ? colors.card : colors.secondary,
                borderColor: item.read ? colors.border : "#C8E6C9",
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.read ? colors.muted : colors.primary }]}>
              <Ionicons name={item.icon} size={20} color={item.read ? colors.mutedForeground : "#fff"} />
            </View>
            <View style={styles.notifBody}>
              <View style={styles.notifTop}>
                <Text style={[styles.notifTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{item.time}</Text>
              </View>
              <Text style={[styles.notifText, { color: colors.mutedForeground }]}>{item.body}</Text>
            </View>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 16, gap: 10 },
  notif: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  iconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  notifBody: { flex: 1 },
  notifTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: "700", flex: 1 },
  notifTime: { fontSize: 11, fontWeight: "500" },
  notifText: { fontSize: 13, fontWeight: "500", lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
});
