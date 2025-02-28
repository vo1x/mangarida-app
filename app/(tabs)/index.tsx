import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  RefreshControl,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";

import MangaCard from "@/components/MangaCard";
import useStore from "@/stores/libraryStore";

export default function Library() {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadLibrary = useStore((state) => state.loadLibrary);
  const library = useStore((state) => state.library);
  const setLibrary = useStore((state) => state.setLibrary);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadLibrary();
    } catch (error) {
      console.error("Error retrieving data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadLibrary();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();
  }, [loadLibrary]);

  const handleLibReset = async () => {
    await setLibrary([]);
  };

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text className="text-white text-3xl font-semibold">Library</Text>
          <TextInput
            placeholder="Find something"
            placeholderTextColor="#9ca3af"
            className="bg-[#2c2c2e] rounded-lg text-[18px] text-white p-2 mt-2 w-full"
          />
        </View>
        <View>
          <Button title="Reset Library" onPress={handleLibReset} />
        </View>
        <View className="mt-4 flex flex-row flex-wrap justify-between mr-4">
          {library.length > 0 ? (
            library.map((item: any) => (
              <MangaCard
                key={item.slug}
                title={item.title}
                mangaID={item.mangaID}
                coverUrl={item.cover.url}
                slug={item.slug}
                source={item.source}
                contentRating={item.contentRating}
              />
            ))
          ) : (
            <Text className="text-white text-2xl">Nothing in library</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
