import { View, Text } from "react-native";

const Chapter = ({
  title,
  publishedOn,
}: {
  title: string;
  publishedOn: string;
}) => {
  return (
    <View className="py-2 border-b border-b-[#2c2c2e]">
      <Text className="text-white text-lg">{title}</Text>
      <Text className="text-gray-300">{publishedOn}</Text>
    </View>
  );
};

export default Chapter;
