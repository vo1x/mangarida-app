import { View, Text, ScrollView } from "react-native";
import SearchBar from "@/components/Searchbar";
import ThemedScrollView from "@/components/ThemedScrollView";
import Header from "@/components/Header";
import { useState } from "react";
import { Button } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { Pressable } from "react-native";
import MangaCard from "@/components/MangaCard";
interface LatestChapter {
  chNum: number;
  volume: number;
}
interface SearchResult {
  name: string;
  type: string;
  posterUrl: string;
  slug: string;
}

import { Link } from "expo-router";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchInput = (text: string) => {
    setSearchValue(text);
  };

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const getSearchResults = async () => {
    try {
      const url = `http://192.168.1.73:5000/search?query=${searchValue}`;
      const { data } = await axios.get(url);
      console.log(data);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
  };

  const handleGetSearch = () => {
    getSearchResults();
  };

  return (
    <ThemedScrollView>
      <View>
        <Header text={"Search"} />
        <SearchBar
          onChangeText={handleSearchInput}
          onSubmitEditing={getSearchResults}
        />
      </View>

      <Link href={"search/[abcd]"} className="text-white">
        click me daddyt
      </Link>
      <Pressable onPress={() => router.push("search/[manga]")}>
        <Text className="text-3xl font-bold text-white">Go to manga info</Text>
      </Pressable>
      <View className={`mt-8 flex flex-row flex-wrap justify-between mr-4`}>
        {searchResults.length > 0
          ? searchResults.map((item: any, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(`search/${item.slug}`)}
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
