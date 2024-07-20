import {
  View,
  Text,
  TextInput,
  Pressable,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import MangaCard from "@/components/MangaCard";
import ThemedScrollView from "@/components/ThemedScrollView";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { subscribeAsyncStorageUpdated } from "@/utils/AsyncStorageEmitter";
import { ScrollView } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface MangaDetails {
  name: string;
  altNames: string[];
  status: string;
  type: string;
  synopsis: string;
  posterUrl: string;
  author: string[];
  publishedOn: string;
  genres: string[];
  mangazines: string[];
  chapters: ChapterResult[];
  slug: string | undefined;
  isBookmarked: boolean;
}

interface ChapterResult {
  url: string;
  title: string[];
  publishedOn: string;
  chNum: number;
}

export default function Library() {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { getLibrary } = useAsyncStorage();
  const [storedData, setStoredData] = useState<MangaDetails[]>([]);
  const router = useRouter();
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const newData = await getLibrary();
      setStoredData(newData);
    } catch (error) {
      console.error("Error retrieving data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getLibrary();
        setStoredData(newData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    const handleAsyncStorageUpdate = () => {
      fetchData();
    };

    const unsubscribe = subscribeAsyncStorageUpdated(handleAsyncStorageUpdate);

    fetchData();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ThemedScrollView
      // className={`flex flex-col`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }

      // stickyHeaderIndices={[0]}
    >
      <View>
        <Text className="text-white text-3xl font-semibold">Library</Text>
        <TextInput
          placeholder="Find something"
          placeholderTextColor="#9ca3af"
          className="bg-[#2c2c2e] rounded-lg text-[18px] text-white p-2 mt-2 w-full"
          // onSubmitEditing={getTrending}
        ></TextInput>
      </View>

      <View className={`mt-4 flex flex-row flex-wrap justify-between mr-4`}>
        {storedData.length > 0
          ? storedData.map((item: any, index) => (
              <Pressable
                key={item.slug}
                onPress={() =>
                  router.push({
                    pathname: `/manga/${item.slug}`,
                    params: {
                      isBookmarked: item.isBookmarked,
                      name: item.name,
                      posterUrl: item.posterUrl,
                      synopsis: item.synopsis,
                      author: item.author.join(", "),
                    },
                  })
                }
              >
                <MangaCard
                  key={item.slug}
                  title={item.name}
                  imgUrl={item.posterUrl}
                />
              </Pressable>
            ))
          : null}
      </View>
    </ThemedScrollView>
  );
}
