// import { FlatList } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { Chapter } from "@/interfaces/interfaces";
import PageItem from "./Page";
import { useEffect, useCallback, useRef } from "react";

const PageList: React.FC<{
  chapter: Chapter;
  setCurrentPageIndex: (index: number) => void;
}> = ({ chapter, setCurrentPageIndex }) => {
  useEffect(() => {
    setCurrentPageIndex(0);
  }, []);

  const onViewCallBack = useCallback((viewableItems: any) => {
    if (
      viewableItems.changed &&
      viewableItems.changed.length > 0 &&
      typeof viewableItems.changed[0].index === "number"
    ) {
      setCurrentPageIndex(viewableItems.changed[0].index);
    }
  }, []);

  const viewConfigRef = useRef({ itemVisiblePercentThreshold: 50 });

  return (
    <View>
      <FlatList
        data={chapter.pages}
        renderItem={({ item }) => <PageItem item={item} />}
        keyExtractor={(item) => item.pgNum.toString()}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewCallBack}
      />
    </View>
  );
};

export default PageList;
