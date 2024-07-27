import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function ReaderLayout() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          // animation: "fade",
          
          headerLeft: () => (
            <TouchableOpacity onPress={handleClose} className="">
              <Ionicons
                name="exit"
                size={28}
                color={"#1288ff"}
                style={{
                  transform: [{ rotate: "180deg" }],
                }}
              ></Ionicons>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
