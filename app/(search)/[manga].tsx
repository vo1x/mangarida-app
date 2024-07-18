import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function MangaDetailsPage() {
  const { manga } = useLocalSearchParams<{ manga: string }>();
  return (
    <View>
      <Text className="text-white">DetailsPage {manga}</Text>
    </View>
  );
}
