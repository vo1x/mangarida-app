import { View, Text } from "react-native";

export default function Header({ text }: { text: string }) {
  return (
    <View>
      <Text className="text-white text-3xl font-[600]">{text}</Text>
    </View>
  );
}
