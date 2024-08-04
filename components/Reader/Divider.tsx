import { View, Text } from "react-native";

interface DividerProps {
  dividerType: string;
}

const Divider: React.FC<DividerProps> = ({ dividerType }) => (
  <View className="h-96 justify-center items-center bg-neutral-950 mt-10">
    <Text className="font-bold text-white text-base">{dividerType}</Text>
  </View>
);

export default Divider;
