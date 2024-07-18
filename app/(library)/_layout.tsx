import { Stack, Tabs } from "expo-router";

export default function LibraryLayout() {
  return (
    <Stack>
      <Tabs.Screen
        name="index"
        options={{ href: null, title: "Library", headerShown: false }}
      />
      <Tabs.Screen
        name="[manga]"
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: "#000", borderColor: "#000" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
