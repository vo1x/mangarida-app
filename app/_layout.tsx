import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="reader"
            options={{
              title: "",
              headerShown: false,
              headerTitle: "",
              headerStyle: { backgroundColor: "#000" },
              headerShadowVisible: false,
              headerTintColor: "#1288ff",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="manga/[manga]"
            options={{
              title: "",
              headerShown: true,
              headerTitle: "",
              headerStyle: { backgroundColor: "#000" },
              headerShadowVisible: false,
              headerTintColor: "#1288ff",
              headerBackTitle: "Back",
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
