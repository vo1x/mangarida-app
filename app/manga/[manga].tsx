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

import { router, useLocalSearchParams } from "expo-router";

import { Bookmark } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

import Chapter from "@/components/Chapter";

import useStore from "../../stores/libraryStore";
import useReadChaptersStore from "@/stores/readChaptersStore";
import useMangarida from "@/hooks/useMangarida";

interface MangaDetails {
  title: string;
  altNames: string[];
  status: string;
  type: string;
  synopsis: string;
  cover: {
    height: number;
    width: number;
    url: string;
  };
  authors: string[];
  publishedOn: string;
  genres: string[];
  mangazines: string[];
  chapters: ChapterResult[];
  slug: string;
  isBookmarked: boolean;
}

interface ChapterResult {
  chId: string;
  chNum: string;
  title: string;
  volume: string;
  language: string;
  createdAt: string;
  isLastCh: string;
  groupName: string;
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


  const { useMetadata, useChapters } = useMangarida();
  const slug = manga!.split("|")[0].trim();

  const { data: metadataData, isLoading: isMetadataLoading } =
    useMetadata(slug);
  const { data: chaptersData, isLoading: isChaptersLoading } =
    useChapters(slug);

  useEffect(() => {
    const checkBookmark = async () => {
      const isBookmarked = await isInLibrary(slug);
      console.log(isBookmarked);
      setBookmarked(isBookmarked);

      if (isBookmarked) {
        const bookmarkedMetadata = await getMangaFromLibrary(slug);
        if (bookmarkedMetadata) setMetadata(bookmarkedMetadata);
      }
    };

    checkBookmark();
  }, [manga]);

  useEffect(() => {
    if (
      !bookmarked &&
      !isMetadataLoading &&
      !isChaptersLoading &&
      metadataData &&
      chaptersData
    ) {
      setMetadata({
        ...metadataData,
        chapters: chaptersData,
        slug: slug,
      });
    }
  }, [
    bookmarked,
    isMetadataLoading,
    isChaptersLoading,
    metadataData,
    chaptersData,
    manga,
  ]);

  if (isMetadataLoading || isChaptersLoading) {
    return <Text>Loading...</Text>;
  }

  const handleBookmark = async (metaData: MangaDetails) => {
    await bookmarkManga(metaData);
    setBookmarked(!bookmarked);
  };

  return (
    
    <SafeAreaView className="mx-4 h-full mt-4">
      <View className="flex flex-col ">
        <View className=" flex flex-row items-end  ">
          <Image
            source={{ uri: metaData?.cover.url }}
            className="w-28 h-44 rounded-lg object-contain"
          />
          <View className="ml-2 flex-1">
            <Text className="text-white text-xl font-semibold ">
              {mangaTitle ?? metaData?.title}
            </Text>
            <Text className="text-gray-400">
              {metaData?.authors.join(", ")}
            </Text>
            {metaData && metaData.chapters.length > 0 ? (
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
            ) : null}
          </View>
        </View>
        <View className="mt-2">
          <Text className="text-neutral-400 text-base mb-4" numberOfLines={3}>
            {metaData?.synopsis}
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/reader`,
                params: {
                  chID: metaData?.chapters[metaData.chapters.length - 1].chId,
                  chNum: metaData?.chapters[metaData.chapters.length - 1].chNum,
                },
              })
            }
            style={{
              backgroundColor: `#1288ff`,
            }}
            className="p-2 rounded-xl my-2 mt-4"
          >
            <Text className={`text-white  text-center text-base `}>
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
            title={
              item.title === null
                ? item.chNum === null
                  ? "Chapter"
                  : `Chapter ${item.chNum}`
                : `Chapter ${item.chNum ?? ""}: ${item.title}`
            }
            publishedOn={item.createdAt}
            chNum={parseInt(item.chNum)}
            slug={manga!}
            chID={item.chId}
          />
        )}
      />
    </SafeAreaView>
  );
}
