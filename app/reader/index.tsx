import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { View, StatusBar, Text, FlatList, FlatListProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import useMangarida from "@/hooks/useMangarida";
import useReadChaptersStore from "@/stores/readChaptersStore";
import useChapterStore from "@/stores/chapterStore";
import Header from "@/components/Reader/Header";
import PageItem from "@/components/Reader/Page";
import PageSlider from "@/components/Reader/PageSlider";
import { Page, Chapter } from "@/interfaces/interfaces";

interface ReaderParams extends Record<string, string> {
  chID: string;
  chNum: string;
}

const MAX_CHAPTERS_IN_MEMORY = 3;

const Reader: React.FC = () => {
  const params = useLocalSearchParams<ReaderParams>();
  const initialChID = params.chID;
  const initialChNum = parseInt(params.chNum);

  const [isViewed, setIsViewed] = useState<boolean>(true);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [loadedChapters, setLoadedChapters] = useState<Chapter[]>([]);
  const [chapterIdToFetch, setChapterIdToFetch] = useState<string>(initialChID);
  const [prevChapterNum, setPreviousChapterNum] =
    useState<number>(initialChNum);
  const [currentChapterNum, setCurrentChapterNum] =
    useState<number>(initialChNum);
  const [currentChapterLength, setCurrentChapterLength] = useState<number>(0);

  const flatListRef = useRef<FlatList<Page>>(null);

  const handleDoubleTap = () => {
    setIsViewed((prev) => !prev);
  };

  const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(handleDoubleTap);

  const { useChapterPages } = useMangarida();
  const getNextChapter = useChapterStore((state) => state.getNextChapter);
  const markChapterAsRead = useReadChaptersStore(
    (state) => state.markChapterAsRead
  );

  const { data: fetchedPages, isSuccess: isPageFetchSuccess } = useChapterPages(
    chapterIdToFetch,
    true
  );

  useEffect(() => {
    if (isPageFetchSuccess && fetchedPages) {
      setLoadedChapters((prev) => {
        const existingChapterIndex = prev.findIndex(
          (ch) => ch.chId === chapterIdToFetch
        );
        if (existingChapterIndex !== -1) {
          const updatedChapter = {
            ...prev[existingChapterIndex],
            pages: fetchedPages,
          };
          const updated = [...prev];
          updated[existingChapterIndex] = updatedChapter;
          return updated;
        }

        if (fetchedPages) {
          const newChapter: Chapter = {
            chId: chapterIdToFetch,
            chNum: currentChapterNum,
            pages: fetchedPages,
          };

          setCurrentChapterLength(fetchedPages.length);
          const updated = [...prev, newChapter].sort(
            (a, b) => a.chNum - b.chNum
          );
          if (updated.length > MAX_CHAPTERS_IN_MEMORY) {
            updated.shift();
          }
          return updated;
        } else {
          console.error("Fetched pages are undefined");
          return prev;
        }
      });
    }
  }, [fetchedPages, isPageFetchSuccess, chapterIdToFetch, currentChapterNum]);

  const handleEndReached = async () => {
    await markChapterAsRead(chapterIdToFetch);
    const nextChapter = await getNextChapter(currentChapterNum);

    if (nextChapter) {
      if (chapterIdToFetch !== nextChapter.chId) {
        setChapterIdToFetch(nextChapter.chId);
        setPreviousChapterNum(nextChapter.chNum - 1);
        setCurrentChapterNum(nextChapter.chNum);
      }
    } else {
      const currentChapter = loadedChapters.find(
        (ch) => ch.chNum === currentChapterNum
      );
      if (currentChapter && currentChapter.pages) {
        setCurrentChapterLength(currentChapter.pages.length);
      }
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleViewableItemsChanged = useCallback<
    NonNullable<FlatListProps<Page>["onViewableItemsChanged"]>
  >(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        const currentChapter = loadedChapters.find(
          (ch) => ch.chNum === currentChapterNum
        );
        if (currentChapter && currentChapter.pages) {
          const pageIndex = currentChapter.pages.findIndex(
            (page) => page.pgNum === firstViewableItem.item.pgNum
          );
          if (pageIndex >= 0) {
            setCurrentPageIndex(pageIndex);
          }
        }
      }
    },
    [loadedChapters, currentChapterNum]
  );
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
          headerTitle={`Chapter ${currentChapterNum}`}
        />
        <FlatList
          ref={flatListRef}
          data={loadedChapters
            .filter((ch) => ch.pages !== undefined)
            .flatMap((ch) => ch.pages!)
            .filter((page): page is Page => page !== undefined)}
          renderItem={(props) => (
            <PageItem
              {...props}
              currentChapterNum={currentChapterNum}
              prevChapterNum={prevChapterNum}
              loadedChapters={loadedChapters}
            />
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
        />

        <PageSlider
          visible={isViewed}
          chapterLength={currentChapterLength}
          currentPageIndex={currentPageIndex}
        />
      </View>
    </GestureDetector>
  );
};

export default Reader;
