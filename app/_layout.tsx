import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
axios.defaults.baseURL = "http://192.168.1.80:5000";
const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
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
    </QueryClientProvider>
  );
}
