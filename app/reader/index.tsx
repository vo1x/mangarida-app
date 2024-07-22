import { View, Text, ScrollView } from "react-native";
import ThemedScrollView from "@/components/ThemedScrollView";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Pressable } from "react-native";
import { Image } from "react-native";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import useMangarida from "@/hooks/useMangarida";
import { Dimensions } from "react-native";
// import AutoHeightImage from "";
import Page from "@/components/Page";
import AutoHeightImage from "@/components/AutoHeightImage";
import { useNavigation } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface ReaderParams extends Record<string, string> {
  slug: string;
  chNum: string;
}

interface Page {
  pgNum: string | number;
  url: string;
}

const Reader = () => {
  const { downloadAndStoreChapter, accessSavedFile } = useLocalStorage();
  const [imageUri, setImageUri] = useState("");
  const params = useLocalSearchParams<ReaderParams>();
  const slug = params.slug;
  const chNum = params.chNum;
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const navigation = useNavigation();
  const [headerVisible, setHeaderVisisble] = useState(false);

  const handleDoubleTap = () => {
    setIsViewed((prev) => !prev);
  };

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(handleDoubleTap);

  const imageUrl =
    "http://192.168.1.73:5000/image/i/d/d8/d8fd48b71ebd5f32a2392b5e71eeb3c6.jpg";

  const loadImage = async () => {
    const uri = await accessSavedFile(imageUrl);
    if (uri) {
      setImageUri(uri);
    } else {
      console.error("Image could not be loaded.");
    }
  };

  const [pages, setPages] = useState<Page[]>([]);

  const { getChapterPages } = useMangarida();

  useEffect(() => {
    // if (isViewed) {
    console.log("double tap detected so header is enabled");
    navigation.setOptions({
      headerShown: isViewed,
    });
    // }
  }, [isViewed]);

  useEffect(
    () =>
      navigation.setOptions({
        headerTitle: `Chapter ${chNum}`,
      }),
    []
  );

  useEffect(() => {
    const fetchInfo = async () => {
      const pgs = await getChapterPages(slug!, chNum!);
      setPages(pgs);
    };

    fetchInfo();
  }, []);

  return (
    <GestureDetector gesture={doubleTap}>
      {/* <SafeAreaView> */}
        <ScrollView>
          <Text className="text-white">this is a read</Text>
          <Text className="text-white">{slug}</Text>
          <Text className="text-white">{chNum}</Text>
          {/* {isViewed && (
          <Text
            className="text-white font-bold text-6xl"
            style={{ position: "absolute" }}
          >
            THIS IS MOCK MODAL
          </Text>
        )} */}
          {/* <ProgressiveImage></ProgressiveImage> */}
          <Pressable
            onPress={() =>
              downloadAndStoreChapter(
                "http://192.168.1.73:5000/image/i/d/d8/d8fd48b71ebd5f32a2392b5e71eeb3c6.jpg"
              )
            }
          >
            <Text className="text-blue-400 font-bold">
              Click to download image
            </Text>
          </Pressable>
          <Pressable onPress={() => loadImage()}>
            <Text className="text-blue-400 font-bold">
              Click to access image
            </Text>
          </Pressable>

          {pages.length > 0 &&
            pages.map((page) => <Page key={page.pgNum} url={page.url} />)}
        </ScrollView>
      {/* </SafeAreaView> */}
    </GestureDetector>
  );
};

export default Reader;
