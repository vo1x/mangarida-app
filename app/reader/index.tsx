import { Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useMangarida from "@/hooks/useMangarida";
import Page from "@/components/Page";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface ReaderParams extends Record<string, string> {
  slug: string;
  chNum: string;
}

interface Page {
  pgNum: string | number;
  url: string;
}

const Reader = () => {
  const params = useLocalSearchParams<ReaderParams>();
  const slug = params.slug;
  const chNum = params.chNum;
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleDoubleTap = () => {
    setIsViewed((prev) => !prev);
  };

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(handleDoubleTap);

  const [pages, setPages] = useState<Page[]>([]);

  const { getChapterPages } = useMangarida();

  useEffect(() => {
    navigation.setOptions({
      headerShown: isViewed,
    });
  }, [isViewed]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Chapter ${chNum}`,
    });

    const fetchInfo = async () => {
      const pgs = await getChapterPages(slug!, chNum!);
      setPages(pgs);
    };

    fetchInfo();
  }, []);

  return (
    <GestureDetector gesture={doubleTap}>
      <ScrollView>
        <Text className="text-white">this is a read</Text>
        <Text className="text-white">{slug}</Text>
        <Text className="text-white">{chNum}</Text>
        {pages.length > 0 &&
          pages.map((page) => <Page key={page.pgNum} url={page.url} />)}
      </ScrollView>
    </GestureDetector>
  );
};

export default Reader;
