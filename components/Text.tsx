import React from "react";
import { Text as RNText, TextProps, StyleSheet, Platform } from "react-native";

const WEIGHT_TO_FAMILY: Record<string, string> = {
  "100": "Manrope_400Regular",
  "200": "Manrope_400Regular",
  "300": "Manrope_300Light",
  "400": "Manrope_400Regular",
  normal: "Manrope_400Regular",
  "500": "Manrope_500Medium",
  "600": "Manrope_600SemiBold",
  "700": "Manrope_700Bold",
  bold: "Manrope_700Bold",
  "800": "Manrope_800ExtraBold",
  "900": "Manrope_800ExtraBold",
};

export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style);
  const weight = (flat?.fontWeight as string | undefined) ?? "400";
  const fontFamily = WEIGHT_TO_FAMILY[weight] ?? "Manrope_400Regular";
  return <RNText style={[{ fontFamily }, style]} {...props} />;
}
