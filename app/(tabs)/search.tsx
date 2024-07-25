import React, { useState } from "react";
import { View, Text } from "react-native";

import SearchBar from "@/components/Searchbar";
import ThemedScrollView from "@/components/ThemedScrollView";
import Header from "@/components/Header";
import MangaCard from "@/components/MangaCard";

import useMangarida from "@/hooks/useMangarida";

interface SearchResult {
  title: string;
  mangaID: string;
  cover: {
    url: string;
  };
  slug: string;
  source: string;
  contentRating: string;
}

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [submitValue, setSubmitValue] = useState("");
  const { useSearchResults } = useMangarida();

  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useSearchResults(submitValue);

  const handleSearchInput = (text: string) => {
    setSearchValue(text);
  };

  const handleSearch = () => {
    setSubmitValue(searchValue);
  };

  return (
    <ThemedScrollView>
      <View>
        <Header text="Search" />
        <SearchBar
          onChangeText={handleSearchInput}
          onSubmitEditing={handleSearch}
        />
      </View>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      <View className="mt-8 flex flex-row flex-wrap justify-between mr-4">
        {searchResults.length > 0
          ? searchResults.map((item: SearchResult) => (
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
          : null}
      </View>
    </ThemedScrollView>
  );
}
