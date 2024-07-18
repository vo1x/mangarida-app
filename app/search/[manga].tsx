import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function DetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text className="text-white">DetailsPage {id}</Text>
    </View>
  );
}
