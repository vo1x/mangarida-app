import { Stack } from "expo-router";
import { Easing } from "react-native";
export default function ReaderLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
