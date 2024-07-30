import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import Page from "@/components/Page";
import useMangarida from "@/hooks/useMangarida";
import useReadChaptersStore from "@/stores/readChaptersStore";
import * as Haptics from "expo-haptics";

import Header from "@/components/Reader/Header";
import PageSlider from "@/components/Reader/PageSlider";

interface ReaderParams extends Record<string, string> {
  chID: string;
  chNum: string;
  nextChId: string;
}

interface Page {
  pgNum: string | number;
  url: string;
  chapterNum: number;
}

const ChapterFooter: React.FC<{ currentChNum: number }> = ({
  currentChNum,
}) => (
  <View className="w-full flex-1 flex py-10 bg-black">
    <Text className="text-white">Finished: {currentChNum}</Text>
    <Text className="text-white">Next: {currentChNum + 1}</Text>
  </View>
);

const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    Image.prefetch(url);
  });
};

const Reader = () => {
  const params = useLocalSearchParams<ReaderParams>();
  const chID = params.chID;
  const chNum = params.chNum;
  const nextChId = params.nextChId;

  const [currentChNum, setCurrentChNum] = useState(parseInt(chNum!));
  const [isViewed, setIsViewed] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [currentChapterPages, setCurrentChapterPages] = useState<Page[]>([]);

  const flatListRef = useRef<FlatList<Page>>(null);

  const handleDoubleTap = () => {
    setIsViewed((prev) => !prev);
  };

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(handleDoubleTap);

  const markChapterAsRead = useReadChaptersStore(
    (state) => state.markChapterAsRead
  );

  const { useChapterPages } = useMangarida();
  const { data: pagesData = [] } = useChapterPages(chID!, true);

  useEffect(() => {
    if (pagesData.length > 0) {
      const chapterPages = pagesData.map((page: any) => ({
        ...page,
        chapterNum: parseInt(chNum!),
      }));
      setPages(chapterPages);
      setCurrentChapterPages(chapterPages);
      preloadImages(chapterPages.slice(0, 5).map((page: any) => page.url)); // Preload first 5 images
    }
  }, [pagesData, chNum]);

  useEffect(() => {
    const filteredPages = pages.filter(
      (page) => page.chapterNum === currentChNum
    );
    setCurrentChapterPages(filteredPages);
    setCurrentPageIndex(0);
  }, [currentChNum, pages]);

  const renderItem = useCallback(
    ({ item, index }: { item: Page; index: number }) => {
      const isLastPageOfChapter =
        index === pages.length - 1 ||
        pages[index + 1].chapterNum !== item.chapterNum;
      return (
        <View>
          <Page url={item.url} />
          {isLastPageOfChapter && <ChapterFooter currentChNum={currentChNum} />}
        </View>
      );
    },
    [pages, currentChNum]
  );

  const snapToPage = async (index: number) => {
    try {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.error("Haptic feedback error:", error);
    }
  };

  const onSliderValueChange = useCallback(
    (value: number) => {
      setIsSliding(true);
      const index = Math.floor(value * (currentChapterPages.length - 1));
      setCurrentPageIndex(index);
    },
    [currentChapterPages]
  );

  const onSlidingComplete = useCallback(
    (value: number) => {
      const index = Math.floor(value * (currentChapterPages.length - 1));
      snapToPage(index);
      setIsSliding(false);
    },
    [currentChapterPages, snapToPage]
  );

  return (
    <GestureDetector gesture={doubleTap}>
      <View className="flex-1">
        <StatusBar
          animated={true}
          showHideTransition={"fade"}
          hidden={!isViewed}
        />
        
        <Header visible={isViewed} headerTitle={`Chapter ${currentChNum}`} />
        
        <FlatList
          ref={flatListRef}
          data={currentChapterPages}
          renderItem={renderItem}
          keyExtractor={(item) => item.pgNum.toString()}
        />

        <PageSlider
          visible={isViewed}
          onSliderValueChange={onSliderValueChange}
          onSlidingComplete={onSlidingComplete}
          currentChapterPages={currentChapterPages}
          currentPageIndex={currentPageIndex}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
  },
  blurContainer: {
    position: "absolute",
    paddingTop: 48,
    width: "100%",
  },
});

export default Reader;
