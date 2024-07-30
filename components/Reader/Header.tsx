import React, { useEffect, useRef } from "react";
import { Animated, Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const Header = ({
  visible,
  headerTitle,
}: {
  visible: boolean;
  headerTitle: string;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // headerLeft: () => (
  //   <TouchableOpacity onPress={handleClose} className="">

  //   </TouchableOpacity>
  // ),

  return (
    <Animated.View
      style={[{ opacity }]}
      className="absolute top-0 left-0 right-0 z-10 h-24"
    >
      <BlurView
        intensity={100}
        tint="dark"
        className="h-full flex flex-row items-center justify-between pt-10 px-5"
      >
        <Pressable className=" w-8 h-8 items-center justify-center" onPress={()=>router.back()}>
          <Feather name="x" size={28} color="#1288ff" />
        </Pressable>
        <Text className="text-white text-base font-semibold flex-1 text-center">
          {headerTitle}
        </Text>
        <Pressable>
          <Feather name="more-horizontal" size={28} color="#1288ff" />
        </Pressable>
      </BlurView>
    </Animated.View>
  );
};

export default Header;
