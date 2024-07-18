import { View, Text, TextInput, Button } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native";
import MangaCard from "@/components/MangaCard";
import ThemedScrollView from "@/components/ThemedScrollView";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";
interface LatestChapter {
  chNum: number;
  volume: number;
}
interface TrendingResponse {
  name: string;
  slug: string;
  posterUrl: string;
  description: string;
  latestChapter: LatestChapter;
  genres: string[];
  status: string;
}

export default function Library() {
  const [trending, setTrending] = useState<TrendingResponse[]>([]);
  const getTrending = async () => {
    try {
      const { data } = await axios.get("http://192.168.1.73:5000/trending");
      console.log(data);
      setTrending(data.results); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching trending data:", error);
      // Handle error state or display an error message
    }
  };

  // useEffect(() => {
  //   getTrending();
  // }, []);

  return (
    <ThemedScrollView className={`flex flex-col mt-32 ml-4`}>
      <View>
        <Text className="text-white text-3xl font-semibold">Library</Text>
        <TextInput
          placeholder="Find something"
          placeholderTextColor={"#9ca3af"}
          className={`p-2 bg-[#1c1c1e] mx-4 ml-0 rounded-md mt-2 text-white`}
          onSubmitEditing={getTrending}
        ></TextInput>
      </View>
      <View className={`mt-4 flex flex-row flex-wrap justify-between mr-4`}>
        {trending.length > 0
          ? trending.map((item: any, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(`${item.slug}`)}
              >
                <MangaCard
                  key={index}
                  title={item.name}
                  imgUrl={item.posterUrl}
                />
              </Pressable>
            ))
          : null}
        {/* <Text className="text-white">{JSON.stringify(trending, null, 2)}</Text> */}
        <Button title="Touch me" onPress={() => getTrending()}></Button>
      </View>
    </ThemedScrollView>
  );
}
