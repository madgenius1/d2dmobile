import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    useFonts,
} from "@expo-google-fonts/manrope";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{ headerBackTitle: "Back", headerTintColor: "#099D15" }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-order"
        options={{ title: "New Order", presentation: "card" }}
      />
      <Stack.Screen
        name="create-errand"
        options={{ title: "New Errand", presentation: "card" }}
      />
      <Stack.Screen
        name="order-confirmation"
        options={{ title: "Confirm Order", presentation: "card" }}
      />
      <Stack.Screen
        name="errand-confirmation"
        options={{ title: "Confirm Errand", presentation: "card" }}
      />
      <Stack.Screen name="order/[id]" options={{ title: "Order Details" }} />
      <Stack.Screen
        name="edit-profile"
        options={{ title: "Edit Profile", presentation: "card" }}
      />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="wallet" options={{ title: "Wallet & Payments" }} />
      <Stack.Screen name="errand/[id]" options={{ title: "Errand Details" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
