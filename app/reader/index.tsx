import React, { useEffect, useRef, useState } from "react";
import { Text, ScrollView, View, StatusBar } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useMangarida from "@/hooks/useMangarida";
import Page from "@/components/Page";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useReadChaptersStore from "@/stores/readChaptersStore";

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
  const [isViewed, setIsViewed] = useState<boolean>(true);
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

  const markChapterAsRead = useReadChaptersStore(
    (state) => state.markChapterAsRead
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Chapter ${chNum}`,
    });
    const markChapter = async () => await markChapterAsRead(chID!);
    markChapter();
  }, []);

  return (
    <GestureDetector gesture={doubleTap}>
      <View style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          showHideTransition={"fade"}
          hidden={!isViewed}
        />
        <ScrollView style={{ flex: 1 }}>
          {pages.length > 0 &&
            pages.map((page: any) => <Page key={page.pgNum} url={page.url} />)}
        </ScrollView>
      </View>
    </GestureDetector>
  );
};

export default Reader;
