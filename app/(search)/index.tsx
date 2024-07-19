import { View, Pressable } from "react-native";
import SearchBar from "@/components/Searchbar";
import ThemedScrollView from "@/components/ThemedScrollView";
import Header from "@/components/Header";
import { useState } from "react";
import axios from "axios";
import { router } from "expo-router";
import MangaCard from "@/components/MangaCard";

interface SearchResult {
  name: string;
  type: string;
  posterUrl: string;
  slug: string;
}

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchInput = (text: string) => {
    setSearchValue(text);
  };

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const getSearchResults = async () => {
    try {
      const url = `http://192.168.1.103:5000/search?query=${searchValue}`;
      const { data } = await axios.get(url);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
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
      <View className={`mt-8 flex flex-row flex-wrap justify-between mr-4`}>
        {searchResults.length > 0
          ? searchResults.map((item: any, index) => (
              <Pressable
                key={item.slug}
                onPress={() =>
                  router.push({
                    pathname: `(search)/${item.slug}`,
                    params: {
                      isBookmarked: item.isBookmarked,
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
