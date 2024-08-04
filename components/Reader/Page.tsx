import React, { memo } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { PageItemProps } from "@/interfaces/interfaces";

const PageItem: React.FC<PageItemProps> = memo(
  ({ item, index, currentChapterNum, prevChapterNum, loadedChapters }) => {
    const { width: windowWidth } = Dimensions.get("window");
    const ratio = windowWidth / item.width;

    const currentChapter = loadedChapters.find(
      (chapter) => chapter.chNum === prevChapterNum
    );
    let isLastPageOfChapter = false;
    if (currentChapter && currentChapter.pages) {
      isLastPageOfChapter =
        currentChapter.pages[currentChapter.pages.length - 1].pgNum ===
        item.pgNum;
    }

    const totalPages = loadedChapters.flatMap((ch) => ch.pages).length;
    const isLastPage = index === totalPages - 1;

    return (
      <View>
        <Image
          source={{ uri: item.url }}
          style={{ width: item.width * ratio, height: item.height * ratio }}
          resizeMode="contain"
        />
        {isLastPageOfChapter && !isLastPage && (
          <View className="h-40 justify-center items-center bg-neutral-950 mt-10">
            <Text className="font-bold text-white text-base mb-2">
              Finished: Chapter {currentChapter?.chNum}
            </Text>
            <Text className="font-bold text-white text-base">
              Next: Chapter {currentChapterNum}
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
  }
);

export default PageItem;
