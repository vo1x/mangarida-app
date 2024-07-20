import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

interface TabItem {
  name: string;
  label: string;
  iconName: ComponentProps<typeof Ionicons>["name"]; // Assuming iconName is the actual property meant for Ionicons
}

const TABS: TabItem[] = [
  { name: "index", label: "Library", iconName: "library" },
  { name: "search", label: "Search", iconName: "search" },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // headerShown: false,
        tabBarStyle: {
          position: "absolute",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint="dark"
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: "hidden",
              backgroundColor: "transparent",
            }}
          />
        ),
      }}
    >
      {/* <Tabs.Screen
        name="index"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="library"
              color={focused ? "#fff" : "#777"}
              size={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <SearchIcon color={focused ? "#fff" : "#777"} size={25} />
          ),
        }}
      /> */}

      {TABS.map((tab, index) => (
        <Tabs.Screen
          key={"tab-" + index}
          name={tab.name}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                style={{ marginBottom: -3 }}
                name={tab.iconName}
                color={focused ? "#1288ff" : "#777"}
                size={28}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
