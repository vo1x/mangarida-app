import { Stack } from "expo-router";

export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "Library",
        }}
      />
      <Stack.Screen
        name="[manga]"
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: "#000", },
          headerShadowVisible: false,
          headerTintColor: "#FE375E",
        }}
      />
    </Stack>
  );
}
