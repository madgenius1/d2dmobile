import { Text } from "@/components/Text";
import { useAppContext } from "@/context/AppContext";
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

const TYPES = [
  { id: "grocery", label: "Grocery Run", icon: "bag-outline" as const },
  { id: "pharmacy", label: "Pharmacy", icon: "medkit-outline" as const },
  { id: "document", label: "Document Drop", icon: "document-outline" as const },
  { id: "other", label: "Custom", icon: "ellipsis-horizontal" as const },
];

export default function CreateErrandScreen() {
  const colors = useColors();
  const { pendingErrand, setPendingErrand } = useAppContext();
  const insets = useSafeAreaInsets();

  const [selectedType, setSelectedType] = useState(
    pendingErrand?.type ?? "grocery",
  );
  const [pickupRoute, setPickupRoute] = useState(
    pendingErrand?.pickupRoute ?? "",
  );
  const [pickupLocation, setPickupLocation] = useState(
    pendingErrand?.pickupLocation ?? "",
  );
  const [dropoffRoute, setDropoffRoute] = useState(
    pendingErrand?.dropoffRoute ?? "",
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    pendingErrand?.dropoffLocation ?? "",
  );
  const [deliverToMe, setDeliverToMe] = useState(
    pendingErrand?.deliverToMe ?? false,
  );
  const [pickupTime, setPickupTime] = useState(pendingErrand?.pickupTime ?? "");
  const [instructions, setInstructions] = useState(
    pendingErrand?.instructions ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleDeliverToMe(val: boolean) {
    setDeliverToMe(val);
    if (val) {
      setDropoffLocation("6th Avenue, Hurlingham East");
      setDropoffRoute("");
      setErrors((e) => ({ ...e, dropoffLocation: "" }));
    } else {
      setDropoffLocation("");
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!pickupLocation.trim())
      e.pickupLocation = "Store / pickup location is required";
    if (!deliverToMe && !dropoffLocation.trim())
      e.dropoffLocation = "Drop-off location is required";
    return e;
  }

  function handleReview() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrors(e);
      return;
    }
    setErrors({});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPendingErrand({
      type: selectedType,
      pickupRoute,
      pickupLocation,
      dropoffRoute,
      dropoffLocation,
      deliverToMe,
      pickupTime,
      instructions,
    });
    router.push("/errand-confirmation");
  }

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <View style={styles.errorRow}>
        <Ionicons name="alert-circle" size={13} color={colors.destructive} />
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {errors[field]}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Type */}
        <Text style={[styles.label, { color: colors.foreground }]}>
          ERRAND TYPE
        </Text>
        <View style={styles.typeGrid}>
          {TYPES.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setSelectedType(t.id)}
              style={[
                styles.typeBtn,
                {
                  backgroundColor:
                    selectedType === t.id ? colors.secondary : colors.card,
                  borderColor:
                    selectedType === t.id ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name={t.icon}
                size={18}
                color={
                  selectedType === t.id
                    ? colors.primary
                    : colors.mutedForeground
                }
              />
              <Text
                style={[
                  styles.typeBtnText,
                  {
                    color:
                      selectedType === t.id
                        ? colors.primary
                        : colors.foreground,
                  },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Route card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.routeRow}>
            <View style={styles.connector}>
              <View
                style={[styles.greenDot, { backgroundColor: colors.primary }]}
              />
              <View style={[styles.dash, { borderColor: "#C8E6C9" }]} />
              <Ionicons name="location" size={20} color="#8B0000" />
            </View>

            <View style={styles.inputs}>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>
                PICKUP (STORE)
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: errors.pickupLocation
                      ? colors.destructive
                      : colors.primary,
                    backgroundColor: "#f8fff0",
                  },
                ]}
              >
                <Ionicons
                  name="git-branch-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={pickupRoute}
                  onChangeText={setPickupRoute}
                  placeholder="Pickup route (e.g. Route 5A)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: errors.pickupLocation
                      ? colors.destructive
                      : colors.primary,
                    backgroundColor: "#f8fff0",
                  },
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={pickupLocation}
                  onChangeText={(v) => {
                    setPickupLocation(v);
                    setErrors((e) => ({ ...e, pickupLocation: "" }));
                  }}
                  placeholder="Store name & address (required)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <FieldError field="pickupLocation" />

              <Text
                style={[
                  styles.sectionLabel,
                  { color: "#8B0000", marginTop: 12 },
                ]}
              >
                DROP-OFF
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: errors.dropoffLocation
                      ? colors.destructive
                      : colors.border,
                    opacity: deliverToMe ? 0.4 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="git-branch-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={dropoffRoute}
                  onChangeText={setDropoffRoute}
                  placeholder="Drop-off route (e.g. Route 12B)"
                  placeholderTextColor={colors.mutedForeground}
                  editable={!deliverToMe}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: errors.dropoffLocation
                      ? colors.destructive
                      : deliverToMe
                        ? colors.primary
                        : colors.border,
                    backgroundColor: deliverToMe ? "#f8fff0" : undefined,
                  },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
                <TextInput
                  value={dropoffLocation}
                  onChangeText={(v) => {
                    setDropoffLocation(v);
                    setErrors((e) => ({ ...e, dropoffLocation: "" }));
                  }}
                  placeholder="Drop-off address (required)"
                  placeholderTextColor={colors.mutedForeground}
                  editable={!deliverToMe}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <FieldError field="dropoffLocation" />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            onPress={() => handleDeliverToMe(!deliverToMe)}
            style={styles.toggleRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.foreground }]}>
                Deliver to my address
              </Text>
              <Text
                style={[styles.toggleSub, { color: colors.mutedForeground }]}
              >
                Auto-fill drop-off with saved address
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: deliverToMe ? colors.primary : colors.muted,
                },
              ]}
            >
              <View
                style={[
                  styles.thumb,
                  { transform: [{ translateX: deliverToMe ? 22 : 2 }] },
                ]}
              />
            </View>
          </Pressable>
        </View>

        {/* Schedule & Instructions */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.foreground }]}>
            PICKUP TIME
          </Text>
          <View
            style={[
              styles.inputWrap,
              { borderColor: colors.border, marginBottom: 14 },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={16}
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

          <Text style={[styles.label, { color: colors.foreground }]}>
            SPECIAL INSTRUCTIONS
          </Text>
          <TextInput
            value={instructions}
            onChangeText={setInstructions}
            placeholder="List items or special instructions..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            style={[
              styles.textarea,
              { color: colors.foreground, borderColor: colors.border },
            ]}
          />
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
        <View>
          <Text style={[styles.costLabel, { color: colors.mutedForeground }]}>
            EST. FEE
          </Text>
          <Text style={[styles.cost, { color: colors.primary }]}>
            Ksh. 420.69
          </Text>
        </View>
        <Pressable
          onPress={handleReview}
          style={({ pressed }) => [
            styles.reviewBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.reviewBtnText}>Review Errand</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    width: "47%",
  },
  typeBtnText: { fontSize: 13, fontWeight: "700" },
  card: { borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 14 },
  routeRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
  connector: { alignItems: "center", paddingTop: 26, width: 20 },
  greenDot: { width: 12, height: 12, borderRadius: 6 },
  dash: {
    flex: 1,
    borderLeftWidth: 2,
    borderStyle: "dashed",
    minHeight: 80,
    marginVertical: 4,
  },
  inputs: { flex: 1, gap: 8 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  input: { flex: 1, fontSize: 14, fontWeight: "500" },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  errorText: { fontSize: 12, fontWeight: "600" },
  divider: { height: 1, marginVertical: 14 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleTitle: { fontSize: 15, fontWeight: "700" },
  toggleSub: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  toggle: { width: 46, height: 26, borderRadius: 13, justifyContent: "center" },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "absolute",
  },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontWeight: "500",
    textAlignVertical: "top",
    minHeight: 90,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1.5,
  },
  costLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  cost: { fontSize: 28, fontWeight: "900" },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  reviewBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
