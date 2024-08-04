import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StatusBar, FlatList } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import useMangarida from "@/hooks/useMangarida";
import useReadChaptersStore from "@/stores/readChaptersStore";
import useChapterStore from "@/stores/chapterStore";
import Header from "@/components/Reader/Header";
import PageSlider from "@/components/Reader/PageSlider";
import { Chapter } from "@/interfaces/interfaces";
import PageList from "@/components/Reader/PageList";
import Divider from "@/components/Reader/Divider";

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
  const [currentChapterNum, setCurrentChapterNum] =
    useState<number>(initialChNum);

  const flatListRef = useRef<FlatList<Chapter>>(null);

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

        const newChapter: Chapter = {
          chId: chapterIdToFetch,
          chNum:
            loadedChapters.length > 0
              ? loadedChapters[loadedChapters.length - 1].chNum + 1
              : initialChNum,
          pages: fetchedPages,
        };

        const updated = [...prev, newChapter].sort((a, b) => a.chNum - b.chNum);
        if (updated.length > MAX_CHAPTERS_IN_MEMORY) {
          updated.shift();
        }
        return updated;
      });
    }
  }, [
    fetchedPages,
    isPageFetchSuccess,
    chapterIdToFetch,
    initialChNum,
    loadedChapters.length,
  ]);

  const handleEndReached = async () => {
    await markChapterAsRead(chapterIdToFetch);
    const nextChapter = await getNextChapter(currentChapterNum);

    if (nextChapter && chapterIdToFetch !== nextChapter.chId) {
      setChapterIdToFetch(nextChapter.chId);
    }
  };

  const onViewCallBack = useCallback((viewableItems: any) => {
    setCurrentChapterNum(viewableItems.changed[0].item.chNum);
  }, []);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 });

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
          data={loadedChapters}
          
          renderItem={({ item }) => (
            <View>
              <PageList
                chapter={item}
                setCurrentPageIndex={setCurrentPageIndex}
              />
              <Divider
                dividerType={
                  currentChapterNum === item.chNum
                    ? `Next Chapter ${currentChapterNum + 1}`
                    : `Previous Chapter ${currentChapterNum - 1}`
                }
              />
            </View>
          )}
          keyExtractor={(item) => item.chId}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onViewableItemsChanged={onViewCallBack}
          viewabilityConfig={viewConfigRef.current}
          maxToRenderPerBatch={3}
          initialNumToRender={3}
        />
        <PageSlider
          visible={isViewed}
          chapterLength={
            loadedChapters.length > 0
              ? loadedChapters.find(
                  (chapter) => chapter.chNum === currentChapterNum
                )?.pages?.length ?? 0
              : 0
          }
          currentPageIndex={currentPageIndex}
        />
      </View>
    </GestureDetector>
  );
};

export default Reader;
