import { View, Text } from "react-native";
import React from "react";
import AutoHeightImage from "./AutoHeightImage";
const Page = ({ url }: { url: string }) => {
  return (
    <View>
      <AutoHeightImage url={url}></AutoHeightImage>
    </View>
  );
};

export default Page;
