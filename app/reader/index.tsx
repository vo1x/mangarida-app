import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StatusBar, Text, FlatList, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import Page from "@/components/Page";
import useMangarida from "@/hooks/useMangarida";
import useReadChaptersStore from "@/stores/readChaptersStore";
import useChapterStore from "@/stores/chapterStore";
import Header from "@/components/Reader/Header";
import PageSlider from "@/components/Reader/PageSlider";

interface ReaderParams extends Record<string, string> {
  chID: string;
  chNum: string;
}

interface Page {
  pgNum: string | number;
  url: string;
  chapterNum: number;
}

interface Chapter {
  id: string;
  num: number;
  pages: Page[];
}

const MAX_CHAPTERS_IN_MEMORY = 3;

const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    Image.prefetch(url);
  });
};

const Reader = () => {
  const params = useLocalSearchParams<ReaderParams>();
  const initialChID = params.chID;
  const initialChNum = parseInt(params.chNum);

  const [isViewed, setIsViewed] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loadedChapters, setLoadedChapters] = useState<Chapter[]>([]);
  const [currentChapterInView, setCurrentChapterInView] =
    useState(initialChNum);
  const [currentChapterId, setCurrentChapterId] = useState(initialChID);

  const flatListRef = useRef<FlatList<Page>>(null);

  const { useChapterPages } = useMangarida();
  const getNextUniqueChapterId = useChapterStore(
    (state) => state.getNextUniqueChapterId
  );
  const markChapterAsRead = useReadChaptersStore(
    (state) => state.markChapterAsRead
  );

  const { data: currentChapterPages, isSuccess: isCurrentChapterSuccess } =
    useChapterPages(currentChapterId, true);

  useEffect(() => {
    if (isCurrentChapterSuccess && currentChapterPages) {
      setLoadedChapters((prev) => {
        const existingChapter = prev.find((ch) => ch.id === currentChapterId);
        if (existingChapter) return prev;

        const newChapter = {
          id: currentChapterId,
          num: currentChapterInView,
          pages: currentChapterPages,
        };
        const updated = [...prev, newChapter].sort((a, b) => a.num - b.num);
        if (updated.length > MAX_CHAPTERS_IN_MEMORY) {
          updated.shift();
        }
        return updated;
      });
      preloadImages(currentChapterPages.map((page: any) => page.url));
    }
  }, [
    currentChapterId,
    currentChapterPages,
    isCurrentChapterSuccess,
    currentChapterInView,
  ]);

  const loadNextChapter = useCallback(async () => {
    await markChapterAsRead(currentChapterId);
    const nextChapter = getNextUniqueChapterId(currentChapterInView.toString());

    if (nextChapter) {
      setCurrentChapterId(nextChapter.chId);
      setCurrentChapterInView(parseInt(nextChapter.chNum));
    }
  }, [
    currentChapterInView,
    currentChapterId,
    getNextUniqueChapterId,
    markChapterAsRead,
  ]);

  const handleDoubleTap = () => {
    setIsViewed((prev) => !prev);
  };

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(handleDoubleTap);

  const renderItem = useCallback(
    ({ item, index }: { item: Page; index: number }) => {
      const currentChapter = loadedChapters.find((chapter) =>
        chapter.pages.some((page) => page.pgNum === item.pgNum)
      );
      const isLastPageOfChapter =
        currentChapter?.pages[currentChapter.pages.length - 1].pgNum ===
        item.pgNum;
      const isLastPage =
        index === loadedChapters.flatMap((ch) => ch.pages).length - 1;

      const nextChapterNum = currentChapter
        ? currentChapter.num + 1
        : undefined;
      const nextChapterId = currentChapter
        ? getNextUniqueChapterId(currentChapter.num.toString())
        : undefined;

      return (
        <View>
          <Page url={item.url} />
          {isLastPageOfChapter && !isLastPage && nextChapterId && (
            <View className="h-40 justify-center items-center bg-neutral-950 mt-10">
              <Text className="font-bold text-white text-base mb-2">
                Finished: Chapter {currentChapter?.num}
              </Text>
              <Text className="font-bold text-white text-base">
                Next: Chapter {nextChapterNum}
              </Text>
            </View>
          )}
          {isLastPage && (
            <View className="h-40 justify-center items-center bg-neutral-950 mt-10">
              <Text className="font-bold text-white text-base">
                There is no next chapter.
              </Text>
            </View>
          )}
        </View>
      );
    },
    [loadedChapters, getNextUniqueChapterId]
  );

  // const onViewableItemsChanged = useCallback(
  //   ({ viewableItems }: { viewableItems: any[] }) => {
  //     if (viewableItems.length > 0) {
  //       const firstVisibleItem = viewableItems[0].item;
  //       const chapterNum = firstVisibleItem.num;
  //       setCurrentChapterInView(chapterNum);
  //       markChapterAsRead(
  //         loadedChapters.find((ch) => ch.num === chapterNum)?.id || ""
  //       );
  //     }
  //   },
  //   [loadedChapters, markChapterAsRead]
  // );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <GestureDetector gesture={doubleTap}>
      <View className="flex-1">
        <StatusBar
          animated={true}
          showHideTransition={"fade"}
          hidden={!isViewed}
        />
        <Header
          visible={isViewed}
          headerTitle={`Chapter ${currentChapterInView}`}
        />
        <FlatList
          ref={flatListRef}
          data={loadedChapters.flatMap((ch) => ch.pages)}
          renderItem={renderItem}
          onEndReached={loadNextChapter}
          onEndReachedThreshold={0.1}
          // onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <PageSlider
          visible={isViewed}
          onSliderValueChange={(value: any) => {
            const totalPages = loadedChapters.flatMap((ch) => ch.pages).length;
            const index = Math.floor(value * (totalPages - 1));
            setCurrentPageIndex(index);
          }}
          onSlidingComplete={(value: any) => {
            const totalPages = loadedChapters.flatMap((ch) => ch.pages).length;
            const index = Math.floor(value * (totalPages - 1));
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
          chapterPages={loadedChapters.flatMap((ch) => ch.pages)}
          currentPageIndex={currentPageIndex}
        />
      </View>
    </GestureDetector>
  );
};

export default Reader;
