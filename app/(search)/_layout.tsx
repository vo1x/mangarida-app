import { Stack, Tabs } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Tabs.Screen
        name="index"
        options={{ href: null, title: "Search", headerShown: false }}
      />
      <Tabs.Screen
        name="[manga]"
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: "#000", borderBottomWidth: 0 },
          headerShadowVisible: false,
        }}
      ></Tabs.Screen>
    </Stack>
  );
}
