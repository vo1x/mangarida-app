import React, { useRef, useEffect } from "react";
import { View, Text, Dimensions, Animated } from "react-native";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const PageSlider = ({
  visible,
  currentPageIndex,
  chapterLength,
}: {
  visible: boolean;
  currentPageIndex: number;
  chapterLength: number;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[{ opacity }]}
      className="absolute bottom-0 left-0 right-0"
    >
      <BlurView intensity={80} tint="dark" className="py-10 pt-4">
        <View className="items-center justify-center w-full">
          <View
            style={{
              width: width * 0.9,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#888",
            }}
          >
            <View
              style={{
                width: `${(currentPageIndex / (chapterLength - 1)) * 100}%`,
                height: '100%',
                borderRadius: 5,
                backgroundColor: "#1288ff",
              }}
            />
          </View>
          <Text className="text-white text-base mt-2">
            Page {currentPageIndex + 1} of {chapterLength}
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};

export default PageSlider;
