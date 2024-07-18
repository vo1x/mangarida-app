import { Stack, Tabs } from "expo-router";
import React from "react";

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
          headerTitle: "abc",
          headerStyle: { backgroundColor: "#000", borderColor: "#000" }, // Example of setting header style
        }}
      >
        {/* Your screen content goes here */}
      </Tabs.Screen>
    </Stack>
  );
}
