import React, { useState } from "react";
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
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

export default function ProfileScreen() {
  const colors = useColors();
  const { user, orders, errands } = useAppContext();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [notificationsOn, setNotificationsOn] = useState(true);

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const completedErrands = errands.filter((e) => e.status === "completed").length;

  type RowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    sub?: string;
    onPress?: () => void;
    danger?: boolean;
    rightEl?: React.ReactNode;
  };

  function Row({ icon, label, sub, onPress, danger, rightEl }: RowProps) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.destructive : colors.mutedForeground}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.rowLabel,
              { color: danger ? colors.destructive : colors.foreground },
            ]}
          >
            {label}
          </Text>
          {!!sub && (
            <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
              {sub}
            </Text>
          )}
        </View>
        {rightEl ?? (
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        )}
      </Pressable>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 120 : 100 }}
      showsVerticalScrollIndicator={false}
    >
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
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
      </View>

      {/* Avatar & Info */}
      <View style={styles.profileSection}>
        <Pressable onPress={() => router.push("/edit-profile")}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View
            style={[
              styles.editBadge,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="pencil" size={12} color={colors.primary} />
          </View>
        </Pressable>
        <Text style={[styles.name, { color: colors.foreground }]}>{user.name}</Text>
        <Text style={[styles.contactLine, { color: colors.mutedForeground }]}>
          {user.phone}
        </Text>
        <Text style={[styles.contactLine, { color: colors.mutedForeground }]}>
          {user.email}
        </Text>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={[styles.stat, { backgroundColor: "#00880e" }]}>
            <Text style={styles.statNum}>{completedOrders}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View
            style={[
              styles.stat,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1.5,
              },
            ]}
          >
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {completedErrands}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Errands
            </Text>
          </View>
          <View
            style={[
              styles.stat,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1.5,
              },
            ]}
          >
            <Text style={[styles.statNum, { color: colors.foreground }]}>4.9</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Ionicons name="star" size={10} color="#f59e0b" />
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Rating
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {/* Account */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          ACCOUNT
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Row
            icon="person-outline"
            label="Edit Profile"
            onPress={() => router.push("/edit-profile")}
          />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <Row
            icon="wallet-outline"
            label="Wallet & Payments"
            sub="Balance: $83.30"
            onPress={() => router.push("/wallet")}
          />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <Row icon="location-outline" label="Saved Addresses" />
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          PREFERENCES
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Row
            icon="notifications-outline"
            label="Notifications"
            rightEl={
              <Pressable
                onPress={() => setNotificationsOn((v) => !v)}
                style={[
                  styles.toggle,
                  {
                    backgroundColor: notificationsOn
                      ? colors.primary
                      : colors.muted,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [
                        { translateX: notificationsOn ? 22 : 2 },
                      ],
                    },
                  ]}
                />
              </Pressable>
            }
          />
        </View>

        {/* Support */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          SUPPORT
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Row icon="help-circle-outline" label="Help Center" />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <Row icon="chatbubble-outline" label="Contact Support" />
        </View>

        {/* Danger */}
        <Text style={[styles.sectionLabel, { color: colors.destructive }]}>
          DANGER ZONE
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Row icon="log-out-outline" label="Log Out" onPress={() => {}} danger />
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          D2D v1.0.0
        </Text>
      </View>
    </ScrollView>
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
  profileSection: { alignItems: "center", padding: 24, gap: 4 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "900" },
  editBadge: {
    position: "absolute",
    bottom: 6,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 22, fontWeight: "800", marginTop: 8 },
  contactLine: { fontSize: 13, fontWeight: "500" },
  stats: { flexDirection: "row", gap: 10, marginTop: 16, width: "100%" },
  stat: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 2,
  },
  statNum: { fontSize: 22, fontWeight: "900", color: "#fff" },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  section: { borderRadius: 14, borderWidth: 1.5, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  rowLabel: { fontSize: 15, fontWeight: "600" },
  rowSub: { fontSize: 12, fontWeight: "500", marginTop: 1 },
  rowDivider: { height: 1, marginHorizontal: 16 },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "absolute",
  },
  version: { fontSize: 12, fontWeight: "500", textAlign: "center", paddingVertical: 8 },
});
