import { View, Text, ScrollView } from "react-native";
import ThemedScrollView from "@/components/ThemedScrollView";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Pressable } from "react-native";
import { Image } from "react-native";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useMangarida from "@/hooks/useMangarida";
import { Dimensions } from "react-native";
// import AutoHeightImage from "";
import Page from "@/components/Page";
import AutoHeightImage from "@/components/AutoHeightImage";
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
    const fetchInfo = async () => {
      const pgs = await getChapterPages(slug!, chNum!);
      setPages(pgs);
    };

    fetchInfo();
  }, []);

  return (
    <ScrollView>
      <Text className="text-white">this is a read</Text>
      <Text className="text-white">{slug}</Text>
      <Text className="text-white">{chNum}</Text>
      {/* <ProgressiveImage></ProgressiveImage> */}
      <Pressable
        onPress={() =>
          downloadAndStoreChapter(
            "http://192.168.1.73:5000/image/i/d/d8/d8fd48b71ebd5f32a2392b5e71eeb3c6.jpg"
          )
        }
      >
        <Text className="text-blue-400 font-bold">Click to download image</Text>
      </Pressable>
      <Pressable onPress={() => loadImage()}>
        <Text className="text-blue-400 font-bold">Click to access image</Text>
      </Pressable>

      {pages.length > 0 &&
        pages.map((page) => <Page key={page.pgNum} url={page.url} />)}
    </ScrollView>
  );
};

export default Reader;
