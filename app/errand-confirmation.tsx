import { Text } from "@/components/Text";
import { ErrandType, PendingErrand, useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TYPE_LABELS: Record<string, string> = {
  grocery: "Grocery Run",
  pharmacy: "Pharmacy",
  document: "Document Drop",
  other: "Custom",
};

export default function ErrandConfirmationScreen() {
  const colors = useColors();
  const { pendingErrand, setPendingErrand, clearPendingErrand, addErrand } =
    useAppContext();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState<
    "pickup" | "dropoff" | "schedule" | null
  >(null);

  const draft: PendingErrand = pendingErrand ?? {
    type: "grocery",
    pickupRoute: "",
    pickupLocation: "Whole Foods Market, 5th Ave",
    dropoffRoute: "",
    dropoffLocation: "244 Oak St, North District",
    deliverToMe: true,
    pickupTime: "",
    instructions: "",
  };

  const [pickupRoute, setPickupRoute] = useState(draft.pickupRoute);
  const [pickupLocation, setPickupLocation] = useState(draft.pickupLocation);
  const [dropoffRoute, setDropoffRoute] = useState(draft.dropoffRoute);
  const [dropoffLocation, setDropoffLocation] = useState(draft.dropoffLocation);
  const [pickupTime, setPickupTime] = useState(draft.pickupTime);
  const [instructions, setInstructions] = useState(draft.instructions);

  function saveSection() {
    setPendingErrand({
      ...draft,
      pickupRoute,
      pickupLocation,
      dropoffRoute,
      dropoffLocation,
      pickupTime,
      instructions,
    });
    setEditing(null);
  }

  function handleConfirm() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const id = `E-${Math.floor(100 + Math.random() * 900)}`;
    addErrand({
      id,
      name: TYPE_LABELS[draft.type] ?? "Errand",
      type: draft.type as ErrandType,
      status: "scheduled",
      store: pickupLocation || "TBD",
      note: instructions || undefined,
      time: pickupTime || "Today",
    });
    clearPendingErrand();
    router.dismissAll();
    router.push("/(tabs)/errands");
  }

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>
            ESTIMATED TOTAL
          </Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            Ksh. 420.69
          </Text>
          <View
            style={[
              styles.speedBadge,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.speedText, { color: colors.foreground }]}>
              {TYPE_LABELS[draft.type] ?? "Errand"}
            </Text>
          </View>
        </View>

        {/* Route card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Pickup */}
          <View style={styles.sectionHeader}>
            <View style={styles.dotLabel}>
              <View
                style={[styles.greenDot, { backgroundColor: colors.primary }]}
              />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                PICKUP (STORE)
              </Text>
            </View>
            <Pressable
              onPress={() => setEditing(editing === "pickup" ? null : "pickup")}
              style={[
                styles.editBtn,
                {
                  backgroundColor:
                    editing === "pickup" ? colors.primary : colors.secondary,
                  borderColor: "#C8E6C9",
                },
              ]}
            >
              <Ionicons
                name={editing === "pickup" ? "checkmark" : "pencil"}
                size={13}
                color={editing === "pickup" ? "#fff" : colors.primary}
              />
              <Text
                style={[
                  styles.editBtnText,
                  { color: editing === "pickup" ? "#fff" : colors.primary },
                ]}
              >
                {editing === "pickup" ? "Done" : "Edit"}
              </Text>
            </Pressable>
          </View>
          {editing === "pickup" ? (
            <View style={styles.editArea}>
              <View
                style={[
                  styles.inputWrap,
                  { borderColor: colors.primary, backgroundColor: "#f8fff0" },
                ]}
              >
                <Ionicons
                  name="git-branch-outline"
                  size={14}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={pickupRoute}
                  onChangeText={setPickupRoute}
                  placeholder="Route"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View
                style={[
                  styles.inputWrap,
                  { borderColor: colors.primary, backgroundColor: "#f8fff0" },
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={14}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={pickupLocation}
                  onChangeText={setPickupLocation}
                  placeholder="Store & address"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <Pressable
                onPress={saveSection}
                style={[
                  styles.saveSectionBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.saveSectionText}>Save Pickup</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {!!pickupRoute && (
                <Text
                  style={[
                    styles.summaryRoute,
                    { color: colors.mutedForeground },
                  ]}
                >
                  ↗ {pickupRoute}
                </Text>
              )}
              <Text style={[styles.summaryAddr, { color: colors.foreground }]}>
                {pickupLocation || "Not set"}
              </Text>
            </View>
          )}

          <View style={styles.connectorRow}>
            <View style={[styles.dashLine, { borderColor: "#C8E6C9" }]} />
            <Text
              style={[styles.connectorLabel, { color: colors.mutedForeground }]}
            >
              COURIER ROUTE
            </Text>
          </View>

          {/* Drop-off */}
          <View
            style={[
              styles.sectionHeader,
              {
                borderTopWidth: 1,
                borderTopColor: colors.border,
                paddingTop: 14,
              },
            ]}
          >
            <View style={styles.dotLabel}>
              <Ionicons name="location" size={16} color="#8B0000" />
              <Text style={[styles.sectionTitle, { color: "#8B0000" }]}>
                DROP-OFF
              </Text>
            </View>
            <Pressable
              onPress={() =>
                setEditing(editing === "dropoff" ? null : "dropoff")
              }
              style={[
                styles.editBtn,
                {
                  backgroundColor:
                    editing === "dropoff" ? "#8B0000" : "#fce8e8",
                  borderColor: "#f5b8b8",
                },
              ]}
            >
              <Ionicons
                name={editing === "dropoff" ? "checkmark" : "pencil"}
                size={13}
                color={editing === "dropoff" ? "#fff" : "#8B0000"}
              />
              <Text
                style={[
                  styles.editBtnText,
                  { color: editing === "dropoff" ? "#fff" : "#8B0000" },
                ]}
              >
                {editing === "dropoff" ? "Done" : "Edit"}
              </Text>
            </Pressable>
          </View>
          {editing === "dropoff" ? (
            <View style={styles.editArea}>
              <View style={[styles.inputWrap, { borderColor: colors.border }]}>
                <Ionicons
                  name="git-branch-outline"
                  size={14}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={dropoffRoute}
                  onChangeText={setDropoffRoute}
                  placeholder="Route"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View style={[styles.inputWrap, { borderColor: colors.border }]}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={dropoffLocation}
                  onChangeText={setDropoffLocation}
                  placeholder="Location"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <Pressable
                onPress={saveSection}
                style={[styles.saveSectionBtn, { backgroundColor: "#8B0000" }]}
              >
                <Text style={styles.saveSectionText}>Save Drop-off</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {!!dropoffRoute && (
                <Text
                  style={[
                    styles.summaryRoute,
                    { color: colors.mutedForeground },
                  ]}
                >
                  ↗ {dropoffRoute}
                </Text>
              )}
              <Text style={[styles.summaryAddr, { color: colors.foreground }]}>
                {dropoffLocation || "Not set"}
              </Text>
            </View>
          )}
        </View>

        {/* Schedule */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
              SCHEDULE & INSTRUCTIONS
            </Text>
            <Pressable
              onPress={() =>
                setEditing(editing === "schedule" ? null : "schedule")
              }
              style={[
                styles.editBtn,
                {
                  backgroundColor:
                    editing === "schedule" ? colors.primary : colors.secondary,
                  borderColor: "#C8E6C9",
                },
              ]}
            >
              <Ionicons
                name={editing === "schedule" ? "checkmark" : "pencil"}
                size={13}
                color={editing === "schedule" ? "#fff" : colors.primary}
              />
              <Text
                style={[
                  styles.editBtnText,
                  { color: editing === "schedule" ? "#fff" : colors.primary },
                ]}
              >
                {editing === "schedule" ? "Done" : "Edit"}
              </Text>
            </Pressable>
          </View>
          {editing === "schedule" ? (
            <View style={styles.editArea}>
              <View
                style={[
                  styles.inputWrap,
                  { borderColor: colors.primary, backgroundColor: "#f8fff0" },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={pickupTime}
                  onChangeText={setPickupTime}
                  placeholder="e.g. Today, 5:00 PM"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <TextInput
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Instructions..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                style={[
                  styles.textarea,
                  {
                    color: colors.foreground,
                    borderColor: colors.primary,
                    backgroundColor: "#f8fff0",
                  },
                ]}
              />
              <Pressable
                onPress={saveSection}
                style={[
                  styles.saveSectionBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.saveSectionText}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 6 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.summaryAddr,
                    { color: colors.foreground, fontSize: 14 },
                  ]}
                >
                  {pickupTime || "ASAP"}
                </Text>
              </View>
              {!!instructions && (
                <Text
                  style={[
                    styles.summaryRoute,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.background,
                      padding: 10,
                      borderRadius: 8,
                    },
                  ]}
                >
                  {instructions}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Payment */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={styles.visaBadge}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
            <Text
              style={[
                styles.summaryAddr,
                { color: colors.foreground, fontSize: 14 },
              ]}
            >
              •••• 4242
            </Text>
            <Pressable style={{ marginLeft: "auto" }}>
              <Text style={[styles.editBtnText, { color: colors.primary }]}>
                CHANGE
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.actionBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 12,
          },
        ]}
      >
        <Pressable
          onPress={handleConfirm}
          disabled={!!editing}
          style={({ pressed }) => [
            styles.confirmBtn,
            {
              backgroundColor: editing ? colors.muted : colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.confirmBtnText,
              { color: editing ? colors.mutedForeground : "#fff" },
            ]}
          >
            Confirm & Schedule
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.backBtnText, { color: colors.primary }]}>
            ← Back to Form
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  totalSection: { alignItems: "center", paddingVertical: 20, gap: 6 },
  totalLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6 },
  totalAmount: { fontSize: 52, fontWeight: "900", letterSpacing: -2 },
  speedBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  speedText: { fontSize: 13, fontWeight: "700" },
  card: { borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dotLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  greenDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  editBtnText: { fontSize: 12, fontWeight: "700" },
  editArea: { gap: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  input: { flex: 1, fontSize: 14, fontWeight: "500" },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    fontWeight: "500",
    textAlignVertical: "top",
    minHeight: 80,
  },
  saveSectionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  saveSectionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  summaryRoute: { fontSize: 13, fontWeight: "500" },
  summaryAddr: { fontSize: 15, fontWeight: "700" },
  connectorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  dashLine: {
    borderLeftWidth: 2,
    borderStyle: "dashed",
    height: 20,
    marginLeft: 4,
  },
  connectorLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  cardLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  visaBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  visaText: { color: "#1e40af", fontWeight: "800", fontSize: 12 },
  actionBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1.5,
    gap: 10,
  },
  confirmBtn: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  confirmBtnText: { fontSize: 16, fontWeight: "700" },
  backBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
  },
  backBtnText: { fontSize: 15, fontWeight: "700" },
});
