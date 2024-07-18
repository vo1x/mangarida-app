import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function MangaDetailsPage() {
  const { manga } = useLocalSearchParams<{ manga: string }>();
  return (
    <View>
      <Text className="text-white">DetailsPage {manga}</Text>
    </View>
  );
}
