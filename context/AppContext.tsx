import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type OrderStatus =
  | "on-the-way"
  | "completed"
  | "scheduled"
  | "picked-up"
  | "cancelled";

export type Order = {
  id: string;
  recipient: string;
  status: OrderStatus;
  pickup: string;
  dropoff: string;
  price: number;
  eta?: string;
  delivered?: string;
  date?: string;
  size: string;
  speed: string;
  reason?: string;
};

export type ErrandStatus = "on-the-way" | "scheduled" | "completed";
export type ErrandType = "grocery" | "pharmacy" | "document" | "other";

export type Errand = {
  id: string;
  name: string;
  type: ErrandType;
  status: ErrandStatus;
  store: string;
  items?: string;
  note?: string;
  courier?: string;
  time?: string;
  delivered?: string;
};

export type User = {
  name: string;
  phone: string;
  email: string;
};

export type PendingOrder = {
  pickupRoute: string;
  pickupLocation: string;
  dropoffRoute: string;
  dropoffLocation: string;
  recipientName: string;
  recipientPhone: string;
  size: string;
  express: boolean;
  notes: string;
};

export type PendingErrand = {
  type: string;
  pickupRoute: string;
  pickupLocation: string;
  dropoffRoute: string;
  dropoffLocation: string;
  deliverToMe: boolean;
  pickupTime: string;
  instructions: string;
};

type AppContextType = {
  user: User;
  orders: Order[];
  errands: Errand[];
  pendingOrder: PendingOrder | null;
  pendingErrand: PendingErrand | null;
  updateUser: (u: Partial<User>) => void;
  addOrder: (o: Order) => void;
  updateOrder: (id: string, u: Partial<Order>) => void;
  addErrand: (e: Errand) => void;
  updateErrand: (id: string, u: Partial<Errand>) => void;
  setPendingOrder: (o: PendingOrder) => void;
  setPendingErrand: (e: PendingErrand) => void;
  clearPendingOrder: () => void;
  clearPendingErrand: () => void;
};

const DEFAULT_USER: User = {
  name: "James Doe",
  phone: "+1 234 567 8900",
  email: "james@email.com",
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: "D2D-89021",
    recipient: "Alex Thompson",
    status: "on-the-way",
    pickup: "244 Oak St, North District",
    dropoff: "89 Maple Ave, West Side",
    price: 18.5,
    eta: "12:45 PM",
    size: "Small",
    speed: "Standard",
  },
  {
    id: "D2D-88210",
    recipient: "Gourmet Food Box",
    status: "completed",
    pickup: "Gourmet Deli, 5th Ave",
    dropoff: "12 Business Park Dr",
    price: 24.0,
    delivered: "Yesterday",
    size: "Medium",
    speed: "Standard",
  },
  {
    id: "D2D-77312",
    recipient: "Michael Chen",
    status: "scheduled",
    pickup: "Central Warehouse",
    dropoff: "45 Business Park, East Wing",
    price: 12.2,
    date: "Thu, 24 Oct",
    size: "Small",
    speed: "Express",
  },
  {
    id: "D2D-55120",
    recipient: "Sarah Jenkins",
    status: "picked-up",
    pickup: "Gourmet Deli, 5th Ave",
    dropoff: "12 Business Park Dr",
    price: 12.0,
    size: "Medium",
    speed: "Standard",
  },
  {
    id: "D2D-00921",
    recipient: "Morning Coffee Batch",
    status: "cancelled",
    pickup: "Blue Bottle Coffee",
    dropoff: "30 Tech Campus Rd",
    price: 8.5,
    reason: "Store closed",
    size: "Small",
    speed: "Express",
  },
];

const DEFAULT_ERRANDS: Errand[] = [
  {
    id: "E-001",
    name: "Weekly Grocery",
    type: "grocery",
    status: "on-the-way",
    store: "Whole Foods Market",
    items: "3 items left",
    courier: "Marcus J.",
  },
  {
    id: "E-002",
    name: "Prescription Pickup",
    type: "pharmacy",
    status: "scheduled",
    store: "CVS Pharmacy",
    note: "Pick up by 6:00 PM",
    time: "Today, 5:45 PM",
  },
  {
    id: "E-003",
    name: "Contract Signature",
    type: "document",
    status: "completed",
    store: "Law Offices of Miller & Co.",
    delivered: "2:15 PM",
  },
];

const KEYS = {
  user: "d2d:user",
  orders: "d2d:orders",
  errands: "d2d:errands",
};

async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

async function save(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const AppContext = createContext<AppContextType>({
  user: DEFAULT_USER,
  orders: DEFAULT_ORDERS,
  errands: DEFAULT_ERRANDS,
  pendingOrder: null,
  pendingErrand: null,
  updateUser: () => {},
  addOrder: () => {},
  updateOrder: () => {},
  addErrand: () => {},
  updateErrand: () => {},
  setPendingOrder: () => {},
  setPendingErrand: () => {},
  clearPendingOrder: () => {},
  clearPendingErrand: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [errands, setErrands] = useState<Errand[]>(DEFAULT_ERRANDS);
  const [pendingOrder, setPendingOrderState] = useState<PendingOrder | null>(null);
  const [pendingErrand, setPendingErrandState] = useState<PendingErrand | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      load(KEYS.user, DEFAULT_USER),
      load(KEYS.orders, DEFAULT_ORDERS),
      load(KEYS.errands, DEFAULT_ERRANDS),
    ]).then(([u, o, e]) => {
      setUser(u);
      setOrders(o);
      setErrands(e);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) save(KEYS.user, user);
  }, [user, loaded]);

  useEffect(() => {
    if (loaded) save(KEYS.orders, orders);
  }, [orders, loaded]);

  useEffect(() => {
    if (loaded) save(KEYS.errands, errands);
  }, [errands, loaded]);

  const updateUser = (u: Partial<User>) => setUser((prev) => ({ ...prev, ...u }));
  const addOrder = (o: Order) => setOrders((prev) => [o, ...prev]);
  const updateOrder = (id: string, u: Partial<Order>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...u } : o)));
  const addErrand = (e: Errand) => setErrands((prev) => [e, ...prev]);
  const updateErrand = (id: string, u: Partial<Errand>) =>
    setErrands((prev) => prev.map((e) => (e.id === id ? { ...e, ...u } : e)));
  const setPendingOrder = (o: PendingOrder) => setPendingOrderState(o);
  const setPendingErrand = (e: PendingErrand) => setPendingErrandState(e);
  const clearPendingOrder = () => setPendingOrderState(null);
  const clearPendingErrand = () => setPendingErrandState(null);

  return (
    <AppContext.Provider
      value={{
        user, orders, errands,
        pendingOrder, pendingErrand,
        updateUser, addOrder, updateOrder,
        addErrand, updateErrand,
        setPendingOrder, setPendingErrand,
        clearPendingOrder, clearPendingErrand,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
