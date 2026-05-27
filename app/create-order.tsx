import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Text } from "@/components/Text";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useAppContext } from "@/context/AppContext";

const SIZES = ["Small", "Medium", "Large"] as const;

export default function CreateOrderScreen() {
  const colors = useColors();
  const { pendingOrder, setPendingOrder } = useAppContext();
  const insets = useSafeAreaInsets();

  const [pickupRoute, setPickupRoute] = useState(pendingOrder?.pickupRoute ?? "");
  const [pickupLocation, setPickupLocation] = useState(pendingOrder?.pickupLocation ?? "");
  const [dropoffRoute, setDropoffRoute] = useState(pendingOrder?.dropoffRoute ?? "");
  const [dropoffLocation, setDropoffLocation] = useState(pendingOrder?.dropoffLocation ?? "");
  const [recipientName, setRecipientName] = useState(pendingOrder?.recipientName ?? "");
  const [recipientPhone, setRecipientPhone] = useState(pendingOrder?.recipientPhone ?? "");
  const [size, setSize] = useState<string>(pendingOrder?.size ?? "Small");
  const [express, setExpress] = useState(pendingOrder?.express ?? false);
  const [notes, setNotes] = useState(pendingOrder?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cost = express ? 23.5 : 18.5;

  function validate() {
    const e: Record<string, string> = {};
    if (!pickupLocation.trim()) e.pickupLocation = "Pickup location is required";
    if (!dropoffLocation.trim()) e.dropoffLocation = "Drop-off location is required";
    if (!recipientName.trim()) e.recipientName = "Recipient name is required";
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
    setPendingOrder({
      pickupRoute, pickupLocation, dropoffRoute, dropoffLocation,
      recipientName, recipientPhone, size, express, notes,
    });
    router.push("/order-confirmation");
  }

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <View style={styles.errorRow}>
        <Ionicons name="alert-circle" size={13} color={colors.destructive} />
        <Text style={[styles.errorText, { color: colors.destructive }]}>{errors[field]}</Text>
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
        {/* Route card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.routeRow}>
            {/* Connector */}
            <View style={styles.connector}>
              <View style={[styles.greenDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.dash, { borderColor: "#C8E6C9" }]} />
              <Ionicons name="location" size={20} color="#8B0000" />
            </View>

            {/* Inputs */}
            <View style={styles.inputs}>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>PICKUP</Text>
              <View style={[styles.inputWrap, { borderColor: errors.pickupLocation ? colors.destructive : colors.primary, backgroundColor: "#f8fff0" }]}>
                <Ionicons name="git-branch-outline" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={pickupRoute}
                  onChangeText={setPickupRoute}
                  placeholder="Pickup route (e.g. Route 5A)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View style={[styles.inputWrap, { borderColor: errors.pickupLocation ? colors.destructive : colors.primary, backgroundColor: "#f8fff0" }]}>
                <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={pickupLocation}
                  onChangeText={(v) => { setPickupLocation(v); setErrors((e) => ({ ...e, pickupLocation: "" })); }}
                  placeholder="Pickup address (required)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <FieldError field="pickupLocation" />

              <Text style={[styles.sectionLabel, { color: "#8B0000", marginTop: 12 }]}>DROP-OFF</Text>
              <View style={[styles.inputWrap, { borderColor: errors.dropoffLocation ? colors.destructive : colors.border }]}>
                <Ionicons name="git-branch-outline" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={dropoffRoute}
                  onChangeText={setDropoffRoute}
                  placeholder="Drop-off route (e.g. Route 12B)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View style={[styles.inputWrap, { borderColor: errors.dropoffLocation ? colors.destructive : colors.border }]}>
                <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={dropoffLocation}
                  onChangeText={(v) => { setDropoffLocation(v); setErrors((e) => ({ ...e, dropoffLocation: "" })); }}
                  placeholder="Drop-off address (required)"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <FieldError field="dropoffLocation" />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.label, { color: colors.foreground }]}>RECIPIENT INFO</Text>
          <View style={[styles.inputWrap, { borderColor: errors.recipientName ? colors.destructive : colors.border }]}>
            <Ionicons name="person-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              value={recipientName}
              onChangeText={(v) => { setRecipientName(v); setErrors((e) => ({ ...e, recipientName: "" })); }}
              placeholder="Recipient name (required)"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
          <FieldError field="recipientName" />
          <View style={[styles.inputWrap, { borderColor: colors.border, marginTop: 8 }]}>
            <Ionicons name="call-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              placeholder="Phone number"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
        </View>

        {/* Package size */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.foreground }]}>PACKAGE SIZE</Text>
          <View style={styles.sizeRow}>
            {SIZES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSize(s)}
                style={[
                  styles.sizeBtn,
                  {
                    backgroundColor: size === s ? colors.secondary : colors.background,
                    borderColor: size === s ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.sizeBtnText, { color: size === s ? colors.primary : colors.mutedForeground }]}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable onPress={() => setExpress(!express)} style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.foreground }]}>Express Delivery</Text>
              <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>+$5.00 · Under 1 hour</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: express ? colors.primary : colors.muted }]}>
              <View style={[styles.thumb, { transform: [{ translateX: express ? 22 : 2 }] }]} />
            </View>
          </Pressable>
        </View>

        {/* Notes */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.foreground }]}>DELIVERY NOTES (OPTIONAL)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special instructions..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            style={[styles.textarea, { color: colors.foreground, borderColor: colors.border }]}
          />
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={[styles.actionBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <View>
          <Text style={[styles.costLabel, { color: colors.mutedForeground }]}>EST. COST</Text>
          <Text style={[styles.cost, { color: colors.primary }]}>${cost.toFixed(2)}</Text>
        </View>
        <Pressable
          onPress={handleReview}
          style={({ pressed }) => [styles.reviewBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.reviewBtnText}>Review Order</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 14 },
  routeRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
  connector: { alignItems: "center", paddingTop: 26, width: 20 },
  greenDot: { width: 12, height: 12, borderRadius: 6 },
  dash: { flex: 1, borderLeftWidth: 2, borderStyle: "dashed", minHeight: 80, marginVertical: 4 },
  inputs: { flex: 1, gap: 8 },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginBottom: 4 },
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
  errorRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  errorText: { fontSize: 12, fontWeight: "600" },
  divider: { height: 1, marginVertical: 14 },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, marginBottom: 10 },
  sizeRow: { flexDirection: "row", gap: 8 },
  sizeBtn: { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, alignItems: "center" },
  sizeBtnText: { fontSize: 14, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 4 },
  toggleTitle: { fontSize: 15, fontWeight: "700" },
  toggleSub: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  toggle: { width: 46, height: 26, borderRadius: 13, justifyContent: "center" },
  thumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", position: "absolute" },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontWeight: "500",
    textAlignVertical: "top",
    minHeight: 80,
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
