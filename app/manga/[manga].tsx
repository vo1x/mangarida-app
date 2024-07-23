import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";

import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";
import axios from "axios";

import { Bookmark } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

import Chapter from "@/components/Chapter";

import useStore from "../../stores/libraryStore";

import useMangarida from "@/hooks/useMangarida";

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
  slug: string;
  isBookmarked: boolean;
}

interface ChapterResult {
  url: string;
  title: string;
  publishedOn: string;
  chNum: number;
}

interface SearchParams extends Record<string, string> {
  mangaTitle: string;
}

export default function MangaDetailsPage() {
  const { manga } = useLocalSearchParams<{ manga: string }>();
  const params = useLocalSearchParams<SearchParams>();
  const { mangaTitle } = params;

  const [metaData, setMetadata] = useState<MangaDetails>();
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const bookmarkManga = useStore((state) => state.bookmarkManga);
  const isInLibrary = useStore((state) => state.checkMangaExistsInLibrary);
  const getMangaFromLibrary = useStore((state) => state.getMangaFromLibrary);

  const { getMetadata, getChapters } = useMangarida();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isBookmarked = await isInLibrary(manga!);
        if (isBookmarked) {
          setBookmarked(isBookmarked);
          const metadata = await getMangaFromLibrary(manga!);
          if (metadata) setMetadata(metadata);
        } else {
          setBookmarked(isBookmarked);
          const metadata = await getMetadata(manga!);
          const chapters = await getChapters(manga!);
          setMetadata({
            ...metadata,
            chapters: chapters,
            slug: manga!,
          });
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  const handleBookmark = async (metaData: MangaDetails) => {
    await bookmarkManga(metaData);
    setBookmarked(!bookmarked);
  };

  return (
    <SafeAreaView className="mx-4 h-full mt-4">
      <View className="flex flex-col ">
        <View className=" flex flex-row items-end  ">
          <Image
            source={{ uri: metaData?.posterUrl }}
            className="w-28 h-44 rounded-lg object-contain"
          />
          <View className="ml-2 flex-1">
            <Text className="text-white text-xl font-semibold ">
              {mangaTitle ?? metaData?.name}
            </Text>
            <Text className="text-gray-400">{metaData?.author.join(", ")}</Text>
            {metaData && metaData.chapters.length > 0 && (
              <View className="flex flex-row items-center gap-2 mt-1">
                <Pressable
                  className="bg-[#1c1c1e] p-2 rounded-lg"
                  onPress={() => handleBookmark(metaData)}
                >
                  <Bookmark
                    color={"#1288ff"}
                    fill={bookmarked ? "#1288ff" : "none"}
                    size={24}
                  />
                </Pressable>
                <Pressable className="bg-[#1c1c1e] p-2 rounded-lg">
                  <Ionicons
                    name="download"
                    size={24}
                    color={"#1288ff"}
                  ></Ionicons>
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <View className="mt-2">
          <Text className="text-neutral-400 text-base mb-4" numberOfLines={3}>
            {metaData?.synopsis}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex flex-row gap-x-2 overflow-scroll"
          >
            {metaData?.genres.map((genre, i) => (
              <View
                key={genre}
                className="p-1 px-2 bg-[#2c2c2e]  text-base w-max rounded-lg"
              >
                <Text className="text-gray-300">{genre}</Text>
              </View>
            ))}
          </ScrollView>
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: `#1288ff`,
            }}
            className="p-2 rounded-xl my-2 mt-4"
          >
            <Text className="text-white  text-center text-base ">
              {metaData && metaData.chapters.length > 0
                ? `Start Reading Ch.${
                    metaData.chapters[metaData.chapters.length - 1].chNum
                  }`
                : "No chapters found"}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={metaData?.chapters}
        ItemSeparatorComponent={() => (
          <View className="border border-[#2c2c2e] my-2 border-0.5" />
        )}
        ListHeaderComponent={() => (
          <Text className="text-white text-xl font-semibold py-2 bg-black">
            {metaData?.chapters.length ?? 0} Chapters
          </Text>
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <Chapter
            key={item.title}
            title={item.title}
            publishedOn={item.publishedOn}
            chNum={item.chNum}
            slug={manga!}
          />
        )}
      />
    </SafeAreaView>
  );
}
