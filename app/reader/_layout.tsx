import { Stack } from "expo-router";

export default function ReaderLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTintColor: "#fff" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
