import { View, Text, Image } from "react-native";
import React from "react";

const MangaCard = ({
  title,
  imgUrl,
}: {
  title: string;
  imgUrl: string | undefined;
}) => {
  return (
    imgUrl !== "" && (
      <View className="flex flex-col gap-2 mb-8">
        <View className="relative">
          <Image source={{ uri: imgUrl }} className="w-44 h-72 rounded-lg" />
          <Text className="p-1 bg-blue-500 absolute px-2 rounded-lg ml-2 mt-2 text-white font-semibold">
            69
          </Text>
        </View>
        <Text className="text-white  w-40 font-semibold" numberOfLines={2}>
          {title}
        </Text>
      </View>
    )
  );
};

export default MangaCard;
