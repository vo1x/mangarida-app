import React, { memo } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { PageItemProps } from "@/interfaces/interfaces";

const PageItem: React.FC<PageItemProps> = memo(({ item }) => {
  const { width: windowWidth } = Dimensions.get("window");
  const ratio = windowWidth / item.width;

  return (
    <View>
      <Image
        source={{ uri: item.url }}
        style={{ width: item.width * ratio, height: item.height * ratio }}
        resizeMode="contain"
      />
    </View>
  );
});

export default PageItem;
