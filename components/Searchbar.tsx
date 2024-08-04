import { View, TextInput } from "react-native";
import React from "react";

type SearchbarProps = {
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
};

export default function SearchBar({
  onChangeText,
  onSubmitEditing,
}: SearchbarProps) {
  return (
    <View>
      <TextInput
        placeholder="Find something"
        placeholderTextColor="#9ca3af"
        className="bg-[#2c2c2e] rounded-lg text-[18px] text-white p-2 mt-2 w-full"
        keyboardType="default"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}
