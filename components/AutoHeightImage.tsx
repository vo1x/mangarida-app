import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  ImageStyle,
  Dimensions,
} from "react-native";

interface Props {
  url: string;
  newWidth?: number;
  newHeight?: number;
  styles?: ImageStyle;
}

const AutoHeightImage: React.FC<Props> = ({
  url,
  newWidth = Dimensions.get("window").width,
  newHeight,
  styles,
}) => {
  const windowWidth = Dimensions.get("window").width;

  const [imageDimensions, setimageDimensions] = useState({
    width: windowWidth,
    height: windowWidth,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Image.getSize(
      url,
      (imgWidth, imgHeight) => {
        let ratio = newWidth
          ? newWidth / imgWidth
          : newHeight
          ? newHeight / imgHeight
          : 1;

        setimageDimensions({
          width: newWidth ?? ratio * imgWidth,
          height: newHeight ?? ratio * imgHeight,
        });
        setLoading(false);
      },
      (error) => {
        alert(`Couldn't get the image size: ${error.message}`);
      }
    );
  }, [url, newWidth, newHeight]);
  return loading ? (
    <View
      style={{
        height: imageDimensions.height,
        width: imageDimensions.width,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={"large"} color="#1288ff" />
    </View>
  ) : (
    <Image
      source={{ uri: url }}
      style={[
        styles,
        {
          height: imageDimensions.height,
          width: imageDimensions.width,
        },
      ]}
      resizeMode="cover"
    />
  );
};

export default AutoHeightImage;
