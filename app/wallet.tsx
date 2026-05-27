import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
} from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

type Transaction = {
  id: string;
  label: string;
  sub: string;
  amount: number;
  type: "credit" | "debit";
  icon: keyof typeof Ionicons.glyphMap;
  date: string;
};

type Card = {
  id: string;
  last4: string;
  brand: "VISA" | "MC";
  expiry: string;
  isDefault: boolean;
};

const TRANSACTIONS: Transaction[] = [
  { id: "t1", label: "Delivery — D2D-89021", sub: "To Alex Thompson", amount: -18.5, type: "debit", icon: "cube-outline", date: "Today, 2:14 PM" },
  { id: "t2", label: "Top-up", sub: "From Visa •••• 4242", amount: 50.0, type: "credit", icon: "add-circle-outline", date: "Today, 10:00 AM" },
  { id: "t3", label: "Delivery — D2D-88210", sub: "Gourmet Food Box", amount: -24.0, type: "debit", icon: "cube-outline", date: "Yesterday, 3:45 PM" },
  { id: "t4", label: "Errand — E-003", sub: "Contract Signature", amount: -12.0, type: "debit", icon: "bag-outline", date: "Yesterday, 2:15 PM" },
  { id: "t5", label: "Top-up", sub: "From Mastercard •••• 8901", amount: 100.0, type: "credit", icon: "add-circle-outline", date: "Mon, 28 Oct" },
  { id: "t6", label: "Delivery — D2D-77312", sub: "To Michael Chen", amount: -12.2, type: "debit", icon: "cube-outline", date: "Mon, 28 Oct" },
  { id: "t7", label: "Errand — Grocery", sub: "Whole Foods Market", amount: -12.0, type: "debit", icon: "bag-outline", date: "Sun, 27 Oct" },
  { id: "t8", label: "Top-up", sub: "From Visa •••• 4242", amount: 30.0, type: "credit", icon: "add-circle-outline", date: "Sat, 26 Oct" },
];

const INITIAL_CARDS: Card[] = [
  { id: "c1", last4: "4242", brand: "VISA", expiry: "09/27", isDefault: true },
  { id: "c2", last4: "8901", brand: "MC", expiry: "12/26", isDefault: false },
];

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [newCardNum, setNewCardNum] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCVV, setNewCardCVV] = useState("");
  const [balance, setBalance] = useState(83.3);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = TRANSACTIONS.filter(
    (t) => filter === "all" || t.type === filter
  );

  function handleTopUp() {
    const amt = parseFloat(topUpAmount);
    if (!isNaN(amt) && amt > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBalance((b) => b + amt);
      setShowTopUp(false);
      setTopUpAmount("");
    }
  }

  function handleAddCard() {
    if (newCardNum.length >= 4 && newCardExpiry.length >= 4) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const last4 = newCardNum.slice(-4);
      setCards((prev) => [
        ...prev,
        { id: `c${Date.now()}`, last4, brand: "VISA", expiry: newCardExpiry, isDefault: false },
      ]);
      setShowAddCard(false);
      setNewCardNum("");
      setNewCardExpiry("");
      setNewCardCVV("");
    }
  }

  function setDefault(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 80 : 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance hero */}
        <View style={[styles.hero, { backgroundColor: "#00880e" }]}>
          <Text style={styles.heroLabel}>WALLET BALANCE</Text>
          <Text style={styles.heroBalance}>${balance.toFixed(2)}</Text>
          <View style={styles.heroActions}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowTopUp(true); }}
              style={({ pressed }) => [styles.heroBtn, { backgroundColor: "rgba(255,255,255,0.22)", opacity: pressed ? 0.75 : 1 }]}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.heroBtnText}>Top Up</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.heroBtn, { backgroundColor: "rgba(255,255,255,0.22)", opacity: pressed ? 0.75 : 1 }]}
            >
              <Ionicons name="arrow-up-outline" size={18} color="#fff" />
              <Text style={styles.heroBtnText}>Send</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.heroBtn, { backgroundColor: "rgba(255,255,255,0.22)", opacity: pressed ? 0.75 : 1 }]}
            >
              <Ionicons name="arrow-down-outline" size={18} color="#fff" />
              <Text style={styles.heroBtnText}>Request</Text>
            </Pressable>
          </View>
        </View>

        {/* Stat chips */}
        <View style={styles.statRow}>
          <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="trending-up-outline" size={16} color={colors.primary} />
            <Text style={[styles.statVal, { color: colors.primary }]}>+$180</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>In this month</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="trending-down-outline" size={16} color="#8B0000" />
            <Text style={[styles.statVal, { color: "#8B0000" }]}>-$78.7</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Out this month</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Payment Methods</Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowAddCard(true); }}
              style={[styles.addBtn, { backgroundColor: colors.secondary, borderColor: "#C8E6C9" }]}
            >
              <Ionicons name="add" size={14} color={colors.primary} />
              <Text style={[styles.addBtnText, { color: colors.primary }]}>Add Card</Text>
            </Pressable>
          </View>

          {cards.map((card) => (
            <View
              key={card.id}
              style={[styles.cardRow, { backgroundColor: colors.card, borderColor: card.isDefault ? colors.primary : colors.border }]}
            >
              <View style={[styles.brandBadge, { backgroundColor: card.brand === "VISA" ? "#dbeafe" : "#fce7f3" }]}>
                <Text style={[styles.brandText, { color: card.brand === "VISA" ? "#1e40af" : "#9d174d" }]}>
                  {card.brand}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardNum, { color: colors.foreground }]}>•••• •••• •••• {card.last4}</Text>
                <Text style={[styles.cardExp, { color: colors.mutedForeground }]}>Expires {card.expiry}</Text>
              </View>
              <View style={styles.cardActions}>
                {card.isDefault ? (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text>
                  </View>
                ) : (
                  <Pressable onPress={() => setDefault(card.id)}>
                    <Text style={[styles.setDefaultText, { color: colors.primary }]}>Set default</Text>
                  </Pressable>
                )}
                {!card.isDefault && (
                  <Pressable onPress={() => removeCard(card.id)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={16} color={colors.destructive} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Transactions</Text>
          </View>

          {/* Filter */}
          <View style={styles.filterRow}>
            {(["all", "credit", "debit"] as const).map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterBtn,
                  { backgroundColor: filter === f ? colors.primary : colors.card, borderColor: filter === f ? colors.primary : colors.border },
                ]}
              >
                <Text style={[styles.filterText, { color: filter === f ? "#fff" : colors.mutedForeground }]}>
                  {f === "all" ? "All" : f === "credit" ? "Money In" : "Money Out"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* List */}
          {filtered.map((tx, i) => (
            <View
              key={tx.id}
              style={[
                styles.txRow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderBottomWidth: i < filtered.length - 1 ? 0 : 1.5,
                  borderTopLeftRadius: i === 0 ? 14 : 0,
                  borderTopRightRadius: i === 0 ? 14 : 0,
                  borderBottomLeftRadius: i === filtered.length - 1 ? 14 : 0,
                  borderBottomRightRadius: i === filtered.length - 1 ? 14 : 0,
                },
              ]}
            >
              <View style={[styles.txIcon, { backgroundColor: tx.type === "credit" ? colors.secondary : "#fff0f0" }]}>
                <Ionicons name={tx.icon} size={18} color={tx.type === "credit" ? colors.primary : "#8B0000"} />
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txLabel, { color: colors.foreground }]} numberOfLines={1}>{tx.label}</Text>
                <Text style={[styles.txSub, { color: colors.mutedForeground }]}>{tx.sub}</Text>
                <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === "credit" ? colors.primary : colors.foreground }]}>
                {tx.type === "credit" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Top Up Modal */}
      <Modal visible={showTopUp} transparent animationType="slide" onRequestClose={() => setShowTopUp(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowTopUp(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: bottomPad + 20 }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Top Up Wallet</Text>

          <View style={styles.quickAmounts}>
            {["10", "25", "50", "100"].map((a) => (
              <Pressable key={a} onPress={() => setTopUpAmount(a)} style={[styles.quickBtn, { backgroundColor: topUpAmount === a ? colors.primary : colors.secondary, borderColor: topUpAmount === a ? colors.primary : "#C8E6C9" }]}>
                <Text style={[styles.quickBtnText, { color: topUpAmount === a ? "#fff" : colors.primary }]}>${a}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.inputWrap, { borderColor: colors.primary, backgroundColor: "#f8fff0" }]}>
            <Text style={[styles.currSign, { color: colors.primary }]}>$</Text>
            <TextInput
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              placeholder="Enter amount"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="decimal-pad"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

          <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>From default card: Visa •••• 4242</Text>

          <Pressable
            onPress={handleTopUp}
            style={({ pressed }) => [styles.sheetBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.sheetBtnText}>Add ${topUpAmount || "0.00"}</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Add Card Modal */}
      <Modal visible={showAddCard} transparent animationType="slide" onRequestClose={() => setShowAddCard(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowAddCard(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: bottomPad + 20 }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Add Payment Card</Text>

          <View style={styles.cardForm}>
            <View style={[styles.inputWrap, { borderColor: colors.border }]}>
              <Ionicons name="card-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                value={newCardNum}
                onChangeText={setNewCardNum}
                placeholder="Card number"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
                maxLength={19}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
            <View style={styles.cardFormRow}>
              <View style={[styles.inputWrap, { borderColor: colors.border, flex: 1 }]}>
                <Ionicons name="calendar-outline" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={newCardExpiry}
                  onChangeText={setNewCardExpiry}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={5}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
              <View style={[styles.inputWrap, { borderColor: colors.border, flex: 1 }]}>
                <Ionicons name="lock-closed-outline" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={newCardCVV}
                  onChangeText={setNewCardCVV}
                  placeholder="CVV"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleAddCard}
            style={({ pressed }) => [styles.sheetBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 8 }]}
          >
            <Text style={styles.sheetBtnText}>Save Card</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    padding: 28,
    paddingBottom: 32,
    gap: 4,
  },
  heroLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  heroBalance: { color: "#fff", fontSize: 52, fontWeight: "900", letterSpacing: -2, marginBottom: 20 },
  heroActions: { flexDirection: "row", gap: 10 },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  statRow: { flexDirection: "row", gap: 12, padding: 16, paddingBottom: 4 },
  stat: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 4,
  },
  statVal: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "500" },
  section: { padding: 16, paddingBottom: 0 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  addBtnText: { fontSize: 13, fontWeight: "700" },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
  },
  brandBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, flexShrink: 0 },
  brandText: { fontWeight: "900", fontSize: 12 },
  cardInfo: { flex: 1 },
  cardNum: { fontSize: 14, fontWeight: "700" },
  cardExp: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  cardActions: { alignItems: "flex-end", gap: 4 },
  defaultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  defaultText: { fontSize: 11, fontWeight: "700" },
  setDefaultText: { fontSize: 11, fontWeight: "700" },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  filterText: { fontSize: 12, fontWeight: "700" },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 0,
  },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: "700" },
  txSub: { fontSize: 12, fontWeight: "500", marginTop: 1 },
  txDate: { fontSize: 11, fontWeight: "500", marginTop: 1 },
  txAmount: { fontSize: 15, fontWeight: "800", flexShrink: 0 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    padding: 24,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 14,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  sheetTitle: { fontSize: 20, fontWeight: "800" },
  sheetSub: { fontSize: 13, fontWeight: "500", textAlign: "center" },
  quickAmounts: { flexDirection: "row", gap: 8 },
  quickBtn: { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, alignItems: "center" },
  quickBtnText: { fontSize: 15, fontWeight: "700" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50 },
  currSign: { fontSize: 20, fontWeight: "800" },
  input: { flex: 1, fontSize: 15, fontWeight: "600" },
  cardForm: { gap: 10 },
  cardFormRow: { flexDirection: "row", gap: 10 },
  sheetBtn: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  sheetBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
