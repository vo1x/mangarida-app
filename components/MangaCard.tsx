import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const MangaCard = ({
  title,
  mangaID,
  coverUrl,
  slug,
  source,
  contentRating,
}: {
  title: string;
  mangaID: string;
  coverUrl: string;
  slug: string;
  source: string;
  contentRating: string;
}) => {
  return (
    coverUrl !== "" && (
      <Pressable
        onPress={() =>
          router.push({
            pathname: `/manga/${mangaID + '|'+ slug}`,
            params: {
              mangaTitle: title,
            },
          })
        }
      >
        <View className="flex flex-col gap-2 mb-8">
          <View className="relative">
            <Image
              source={{ uri: coverUrl }}
              className="w-44 h-72 rounded-lg"
            />
          </View>
          <Text className="text-white  w-40 font-semibold" numberOfLines={2}>
            {title}
          </Text>
        </View>
      </Pressable>
    )
  );
};

export default MangaCard;
