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
import { useAppContext, PendingOrder } from "@/context/AppContext";

type Section = "pickup" | "dropoff" | "recipient" | "package" | null;

export default function OrderConfirmationScreen() {
  const colors = useColors();
  const { pendingOrder, setPendingOrder, clearPendingOrder, addOrder } = useAppContext();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState<Section>(null);

  const draft: PendingOrder = pendingOrder ?? {
    pickupRoute: "", pickupLocation: "244 Oak St, North District",
    dropoffRoute: "", dropoffLocation: "89 Maple Ave, West Side",
    recipientName: "Alex Thompson", recipientPhone: "+1 555 000 1234",
    size: "Small", express: false, notes: "",
  };

  const [pickupRoute, setPickupRoute] = useState(draft.pickupRoute);
  const [pickupLocation, setPickupLocation] = useState(draft.pickupLocation);
  const [dropoffRoute, setDropoffRoute] = useState(draft.dropoffRoute);
  const [dropoffLocation, setDropoffLocation] = useState(draft.dropoffLocation);
  const [recipientName, setRecipientName] = useState(draft.recipientName);
  const [recipientPhone, setRecipientPhone] = useState(draft.recipientPhone);
  const [size, setSize] = useState(draft.size);
  const [express, setExpress] = useState(draft.express);

  const cost = express ? 23.5 : 18.5;

  function saveSection() {
    setPendingOrder({ ...draft, pickupRoute, pickupLocation, dropoffRoute, dropoffLocation, recipientName, recipientPhone, size, express });
    setEditing(null);
  }

  function handleConfirm() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const id = `D2D-${Math.floor(10000 + Math.random() * 90000)}`;
    addOrder({
      id,
      recipient: recipientName || "Unknown",
      status: "scheduled",
      pickup: [pickupRoute, pickupLocation].filter(Boolean).join(" — ") || "TBD",
      dropoff: [dropoffRoute, dropoffLocation].filter(Boolean).join(" — ") || "TBD",
      price: cost,
      size,
      speed: express ? "Express" : "Standard",
      date: "Today",
    });
    clearPendingOrder();
    router.dismissAll();
    router.push("/(tabs)/orders");
  }

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function EditBtn({ section }: { section: Section }) {
    const isActive = editing === section;
    return (
      <Pressable
        onPress={() => setEditing(isActive ? null : section)}
        style={[styles.editBtn, { backgroundColor: isActive ? colors.primary : colors.secondary, borderColor: isActive ? colors.primary : "#C8E6C9" }]}
      >
        <Ionicons name={isActive ? "checkmark" : "pencil"} size={13} color={isActive ? "#fff" : colors.primary} />
        <Text style={[styles.editBtnText, { color: isActive ? "#fff" : colors.primary }]}>
          {isActive ? "Done" : "Edit"}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>ORDER TOTAL</Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>${cost.toFixed(2)}</Text>
          <View style={[styles.speedBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.speedText, { color: colors.foreground }]}>
              {size} • {express ? "Express" : "Standard"} Delivery
            </Text>
          </View>
        </View>

        {/* Route card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Pickup */}
          <View style={styles.sectionHeader}>
            <View style={styles.dotLabel}>
              <View style={[styles.greenDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>PICKUP</Text>
            </View>
            <EditBtn section="pickup" />
          </View>
          {editing === "pickup" ? (
            <View style={styles.editArea}>
              <View style={[styles.inputWrap, { borderColor: colors.primary, backgroundColor: "#f8fff0" }]}>
                <Ionicons name="git-branch-outline" size={14} color={colors.mutedForeground} />
                <TextInput value={pickupRoute} onChangeText={setPickupRoute} placeholder="Route" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
              </View>
              <View style={[styles.inputWrap, { borderColor: colors.primary, backgroundColor: "#f8fff0" }]}>
                <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
                <TextInput value={pickupLocation} onChangeText={setPickupLocation} placeholder="Location" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
              </View>
              <Pressable onPress={saveSection} style={[styles.saveSectionBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.saveSectionText}>Save Pickup</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.summary}>
              {!!pickupRoute && <Text style={[styles.summaryRoute, { color: colors.mutedForeground }]}>↗ {pickupRoute}</Text>}
              <Text style={[styles.summaryAddr, { color: colors.foreground }]}>{pickupLocation || "Not set"}</Text>
            </View>
          )}

          {/* Dashed connector */}
          <View style={styles.connectorRow}>
            <View style={[styles.dashLine, { borderColor: "#C8E6C9" }]} />
            <Text style={[styles.connectorLabel, { color: colors.mutedForeground }]}>3.2 MILES • 15 MIN</Text>
          </View>

          {/* Dropoff */}
          <View style={[styles.sectionHeader, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }]}>
            <View style={styles.dotLabel}>
              <Ionicons name="location" size={16} color="#8B0000" />
              <Text style={[styles.sectionTitle, { color: "#8B0000" }]}>DROP-OFF</Text>
            </View>
            <Pressable
              onPress={() => setEditing(editing === "dropoff" ? null : "dropoff")}
              style={[styles.editBtn, { backgroundColor: editing === "dropoff" ? "#8B0000" : "#fce8e8", borderColor: "#f5b8b8" }]}
            >
              <Ionicons name={editing === "dropoff" ? "checkmark" : "pencil"} size={13} color={editing === "dropoff" ? "#fff" : "#8B0000"} />
              <Text style={[styles.editBtnText, { color: editing === "dropoff" ? "#fff" : "#8B0000" }]}>{editing === "dropoff" ? "Done" : "Edit"}</Text>
            </Pressable>
          </View>
          {editing === "dropoff" ? (
            <View style={styles.editArea}>
              <View style={[styles.inputWrap, { borderColor: colors.border }]}>
                <Ionicons name="git-branch-outline" size={14} color={colors.mutedForeground} />
                <TextInput value={dropoffRoute} onChangeText={setDropoffRoute} placeholder="Route" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
              </View>
              <View style={[styles.inputWrap, { borderColor: colors.border }]}>
                <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
                <TextInput value={dropoffLocation} onChangeText={setDropoffLocation} placeholder="Location" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
              </View>
              <Pressable onPress={saveSection} style={[styles.saveSectionBtn, { backgroundColor: "#8B0000" }]}>
                <Text style={styles.saveSectionText}>Save Drop-off</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.summary}>
              {!!dropoffRoute && <Text style={[styles.summaryRoute, { color: colors.mutedForeground }]}>↗ {dropoffRoute}</Text>}
              <Text style={[styles.summaryAddr, { color: colors.foreground }]}>{dropoffLocation || "Not set"}</Text>
            </View>
          )}
        </View>

        {/* Recipient */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>RECIPIENT</Text>
            <EditBtn section="recipient" />
          </View>
          {editing === "recipient" ? (
            <View style={styles.editArea}>
              <View style={[styles.inputWrap, { borderColor: colors.primary, backgroundColor: "#f8fff0" }]}>
                <Ionicons name="person-outline" size={14} color={colors.mutedForeground} />
                <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Name" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
              </View>
              <View style={[styles.inputWrap, { borderColor: colors.primary, backgroundColor: "#f8fff0" }]}>
                <Ionicons name="call-outline" size={14} color={colors.mutedForeground} />
                <TextInput value={recipientPhone} onChangeText={setRecipientPhone} placeholder="Phone" placeholderTextColor={colors.mutedForeground} keyboardType="phone-pad" style={[styles.input, { color: colors.foreground }]} />
              </View>
              <Pressable onPress={saveSection} style={[styles.saveSectionBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.saveSectionText}>Save Recipient</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text style={[styles.summaryAddr, { color: colors.foreground }]}>{recipientName || "Not set"}</Text>
              {!!recipientPhone && <Text style={[styles.summaryRoute, { color: colors.mutedForeground }]}>{recipientPhone}</Text>}
            </View>
          )}
        </View>

        {/* Package */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>PACKAGE</Text>
            <EditBtn section="package" />
          </View>
          {editing === "package" ? (
            <View style={styles.editArea}>
              <View style={styles.sizeRow}>
                {["Small", "Medium", "Large"].map((s) => (
                  <Pressable key={s} onPress={() => setSize(s)} style={[styles.sizeBtn, { backgroundColor: size === s ? colors.secondary : colors.background, borderColor: size === s ? colors.primary : colors.border }]}>
                    <Text style={[styles.sizeBtnText, { color: size === s ? colors.primary : colors.mutedForeground }]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable onPress={() => setExpress(!express)} style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleTitle, { color: colors.foreground }]}>Express Delivery</Text>
                  <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>+$5.00</Text>
                </View>
                <View style={[styles.toggle, { backgroundColor: express ? colors.primary : colors.muted }]}>
                  <View style={[styles.thumb, { transform: [{ translateX: express ? 22 : 2 }] }]} />
                </View>
              </Pressable>
              <Pressable onPress={saveSection} style={[styles.saveSectionBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.saveSectionText}>Save Package</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={[styles.chip, { backgroundColor: colors.secondary, borderColor: "#C8E6C9" }]}>
                <Text style={[styles.chipText, { color: colors.primary }]}>{size}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{express ? "Express" : "Standard"}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.payRow}>
            <View style={styles.visaBadge}><Text style={styles.visaText}>VISA</Text></View>
            <Text style={[styles.cardNum, { color: colors.foreground }]}>•••• 4242</Text>
            <Pressable style={{ marginLeft: "auto" }}>
              <Text style={[styles.changeText, { color: colors.primary }]}>CHANGE</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <Pressable
          onPress={handleConfirm}
          disabled={!!editing}
          style={({ pressed }) => [styles.confirmBtn, { backgroundColor: editing ? colors.muted : colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={[styles.confirmBtnText, { color: editing ? colors.mutedForeground : "#fff" }]}>
            Confirm & Send
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back to Form</Text>
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
  speedBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  speedText: { fontSize: 13, fontWeight: "700" },
  card: { borderRadius: 14, borderWidth: 1.5, padding: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  dotLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  greenDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  editBtnText: { fontSize: 12, fontWeight: "700" },
  editArea: { gap: 8 },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, height: 42 },
  input: { flex: 1, fontSize: 14, fontWeight: "500" },
  saveSectionBtn: { paddingVertical: 10, borderRadius: 10, alignItems: "center", marginTop: 4 },
  saveSectionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  summary: { gap: 2 },
  summaryRoute: { fontSize: 13, fontWeight: "500" },
  summaryAddr: { fontSize: 15, fontWeight: "700" },
  connectorRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  dashLine: { borderLeftWidth: 2, borderStyle: "dashed", height: 20, marginLeft: 4 },
  connectorLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  cardLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  sizeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  sizeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, alignItems: "center" },
  sizeBtnText: { fontSize: 13, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleTitle: { fontSize: 14, fontWeight: "700" },
  toggleSub: { fontSize: 12, fontWeight: "500" },
  toggle: { width: 46, height: 26, borderRadius: 13, justifyContent: "center" },
  thumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", position: "absolute" },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "700" },
  payRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  visaBadge: { backgroundColor: "#dbeafe", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  visaText: { color: "#1e40af", fontWeight: "800", fontSize: 12 },
  cardNum: { fontSize: 14, fontWeight: "600" },
  changeText: { fontSize: 12, fontWeight: "700" },
  actionBar: { paddingHorizontal: 16, paddingTop: 14, borderTopWidth: 1.5, gap: 10 },
  confirmBtn: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  confirmBtnText: { fontSize: 16, fontWeight: "700" },
  backBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1.5 },
  backBtnText: { fontSize: 15, fontWeight: "700" },
});
