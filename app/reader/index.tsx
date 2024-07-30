import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StatusBar, Text, FlatList, Image } from "react-native";

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

const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    Image.prefetch(url);
  });
};

const Reader = () => {
  const params = useLocalSearchParams<ReaderParams>();
  const chID = params.chID;
  const chNum = params.chNum;

  const [isViewed, setIsViewed] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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

  const renderItem = useCallback(
    ({ item }: { item: Page }) => {
      return (
        <View>
          <Page url={item.url} />
        </View>
      );
    },
    [pagesData]
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
      const index = Math.floor(value * (pagesData.length - 1));
      setCurrentPageIndex(index);
    },
    [pagesData]
  );

  const onSlidingComplete = useCallback(
    (value: number) => {
      const index = Math.floor(value * (pagesData.length - 1));
      snapToPage(index);
    },
    [pagesData, snapToPage]
  );

  return (
    <GestureDetector gesture={doubleTap}>
      <View className="flex-1">
        <StatusBar
          animated={true}
          showHideTransition={"fade"}
          hidden={!isViewed}
        />

        <Header visible={isViewed} headerTitle={`Chapter ${chNum}`} />

        <FlatList
          ref={flatListRef}
          data={pagesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.pgNum.toString()}
          onEndReached={() => markChapterAsRead(chID!)}
        />

        <PageSlider
          visible={isViewed}
          onSliderValueChange={onSliderValueChange}
          onSlidingComplete={onSlidingComplete}
          chapterPages={pagesData}
          currentPageIndex={currentPageIndex}
        />
      </View>
    </GestureDetector>
  );
};

export default Reader;
