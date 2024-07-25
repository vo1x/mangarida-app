import { Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useMangarida from "@/hooks/useMangarida";
import Page from "@/components/Page";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface ReaderParams extends Record<string, string> {
  chID: string;
}

interface Page {
  pgNum: string | number;
  url: string;
}

const Reader = () => {
  const params = useLocalSearchParams<ReaderParams>();
  const chID = params.chID;
  const chNum = params.chNum;
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleDoubleTap = () => {
    setIsViewed((prev) => !prev);
  };

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(handleDoubleTap);

  const { useChapterPages } = useMangarida();
  const { data: pages = [] } = useChapterPages(chID!);

  useEffect(() => {
    navigation.setOptions({
      headerShown: isViewed,
    });
  }, [isViewed]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Chapter ${chNum}`,
    });
  }, []);

  return (
    <GestureDetector gesture={doubleTap}>
      <ScrollView>
        <Text className="text-white">this is a read</Text>
        <Text className="text-white">{chID}</Text>
        <Text className="text-white">{chNum}</Text>
        {pages.length > 0 &&
          pages.map((page: any) => <Page key={page.pgNum} url={page.url} />)}
      </ScrollView>
    </GestureDetector>
  );
};

export default Reader;
