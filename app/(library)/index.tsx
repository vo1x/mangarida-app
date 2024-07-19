import { View, Text, TextInput, Button } from "react-native";
import MangaCard from "@/components/MangaCard";
import ThemedScrollView from "@/components/ThemedScrollView";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { subscribeAsyncStorageUpdated } from "@/utils/AsyncStorageEmitter";
import { RefreshControl } from "react-native";
interface LatestChapter {
  chNum: number;
  volume: number;
}

import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully");
    } catch (e) {
      console.error("Failed to clear AsyncStorage:", e);
    }
  };

  return (
    <ThemedScrollView
      className={`flex flex-col mt-32 ml-4`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Text className="text-white text-3xl font-semibold">Library</Text>
        <TextInput
          placeholder="Find something"
          placeholderTextColor={"#9ca3af"}
          className={`p-2 bg-[#1c1c1e] mx-4 ml-0 rounded-md mt-2 text-white`}
          // onSubmitEditing={getTrending}
        ></TextInput>
      </View>
      <Pressable onPress={() => clearAsyncStorage()}>
        <Text className="text-white text-3xl">Clear storage</Text>
      </Pressable>
      <View className={`mt-4 flex flex-row flex-wrap justify-between mr-4`}>
        {storedData.length > 0
          ? storedData.map((item: any, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(`(library)/${item.slug}`)}
              >
                <MangaCard
                  key={index}
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
