import React from "react";
import { useRef, useEffect } from "react";
import { View, Text, Dimensions, Animated } from "react-native";
import Slider from "@react-native-community/slider";

import { BlurView } from "expo-blur";
interface Page {
  pgNum: string | number;
  url: string;
  chapterNum: number;
}

const { width } = Dimensions.get("window");

const PageSlider = ({
  visible,
  currentPageIndex,
  currentChapterPages,
  onSliderValueChange,
  onSlidingComplete,
}: {
  visible: boolean;
  currentPageIndex: number;
  currentChapterPages: Page[];
  onSliderValueChange: any;
  onSlidingComplete: any;
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
      className="absolute bottom-0 left-0 right-0 "
    >
      <BlurView intensity={80} tint="dark" className="py-10 pt-4">
        <View className="items-center justify-center w-full">
          <Slider
            style={{ width: width * 0.9 }}
            minimumValue={0}
            maximumValue={1}
            value={currentPageIndex / (currentChapterPages.length - 1)}
            onValueChange={onSliderValueChange}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor="#1288ff"
            maximumTrackTintColor="#888"
            thumbTintColor="#ffffff"
            accessibilityLabel="Page slider"
            accessibilityHint="Slide to change pages"
          />
          <Text className="text-white text-base ">
            Page {currentPageIndex + 1} of {currentChapterPages.length}
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};
export default PageSlider;
