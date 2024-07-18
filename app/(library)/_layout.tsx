import { Stack, Tabs } from "expo-router";
import React from "react";

export default function LibraryLayout() {
  return (
    <Stack>
      <Tabs.Screen
        name="index"
        options={{ href: null, title: "Search", headerShown: false }}
      />
      <Tabs.Screen
        name="[manga]"
        options={{ href: null, headerTitle: "" }}
      />
    </Stack>
  );
}
