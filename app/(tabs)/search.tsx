import { useState } from "react";
import { View } from "react-native";

import SearchBar from "@/components/Searchbar";
import ThemedScrollView from "@/components/ThemedScrollView";
import Header from "@/components/Header";
import MangaCard from "@/components/MangaCard";

import useMangarida from "@/hooks/useMangarida";

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

  const { getSearchResults } = useMangarida();

  const handleSearch = async () => {
    const searchRes = await getSearchResults(searchValue);
    setSearchResults(searchRes);
  };

  return (
    <ThemedScrollView>
      <View>
        <Header text={"Search"} />
        <SearchBar
          onChangeText={handleSearchInput}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View className={`mt-8 flex flex-row flex-wrap justify-between mr-4`}>
        {searchResults.length > 0
          ? searchResults.map((item: any, index) => (
              <MangaCard
                key={item.slug}
                title={item.name}
                imgUrl={item.posterUrl}
                slug={item.slug}
              />
            ))
          : null}
      </View>
    </ThemedScrollView>
  );
}
