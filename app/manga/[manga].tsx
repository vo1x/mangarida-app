import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  SafeAreaView,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import Chapter from "@/components/MangaDetails/Chapter";
import useStore from "../../stores/libraryStore";
import useReadChaptersStore from "@/stores/readChaptersStore";
import useMangarida from "@/hooks/useMangarida";
import FilterModal from "@/components/MangaDetails/FilterModal";
import useChapterStore from "@/stores/chapterStore";

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
  groups: string[];
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

export default function MangaDetailsPage() {
  const { manga } = useLocalSearchParams<{ manga: string }>();
  const { mangaTitle } = useLocalSearchParams<{ mangaTitle: string }>();

  const [metaData, setMetadata] = useState<MangaDetails | null>(null);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [apiEnabled, setApiEnabled] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { setChapterLibrary } = useChapterStore();

  const bookmarkManga = useStore((state) => state.bookmarkManga);
  const isInLibrary = useStore((state) => state.checkMangaExistsInLibrary);
  const getMangaFromLibrary = useStore((state) => state.getMangaFromLibrary);
  const loadReadChaptersLibrary = useReadChaptersStore(
    (state) => state.loadReadChapterLibrary
  );
  const readChapters = useReadChaptersStore((state) => state.readChapters);

  const { useMetadata, useChapters } = useMangarida();

  const slug = manga ? manga.split("|")[0].trim() : "";

  const { data: metadataData, isLoading: isMetadataLoading } = useMetadata(
    slug,
    apiEnabled
  );
  const { data: chaptersData, isLoading: isChaptersLoading } = useChapters(
    slug,
    apiEnabled
  );

  useEffect(() => {
    loadReadChaptersLibrary();
  }, [loadReadChaptersLibrary]);

  useEffect(() => {
    async function checkBookmark() {
      const isBookmarked = await isInLibrary(slug);
      setBookmarked(isBookmarked);

      if (isBookmarked) {
        const bookmarkedMetadata = await getMangaFromLibrary(slug);
        if (bookmarkedMetadata) {
          setMetadata(bookmarkedMetadata);
          setChapterLibrary(bookmarkedMetadata.chapters);
        }
      } else {
        setApiEnabled(true);
      }
    }

    checkBookmark();
  }, [slug, isInLibrary, getMangaFromLibrary, setChapterLibrary]);

  useEffect(() => {
    if (
      !bookmarked &&
      !isMetadataLoading &&
      !isChaptersLoading &&
      metadataData &&
      chaptersData
    ) {
      const combinedMetadata = {
        ...metadataData,
        chapters: chaptersData?.chapters,
        groups: chaptersData?.groups || [],
        slug: slug,
      };
      setMetadata(combinedMetadata);
      setChapterLibrary(combinedMetadata.chapters);
    }
  }, [
    bookmarked,
    isMetadataLoading,
    isChaptersLoading,
    metadataData,
    chaptersData,
    slug,
    setChapterLibrary,
  ]);

  const handleBookmark = async () => {
    if (metaData) {
      await bookmarkManga(metaData);
      setBookmarked((prev) => !prev);
    }
  };

  if (isMetadataLoading || isChaptersLoading) {
    return <Text>Loading...</Text>;
  }

  const filteredChapters = metaData?.chapters.filter(
    (chapter) => !selectedGroups.includes(chapter.groupName)
  );

  return (
    <View>
      <FilterModal
        initialSelectedGroups={selectedGroups}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        groupNames={metaData?.groups || []}
        onSelectionChange={(groups) => {
          setSelectedGroups(groups);
          setModalVisible(false);
        }}
      />
      <SafeAreaView className="mx-4 h-full mt-4">
        {metaData && (
          <>
            <View className="flex flex-col">
              <View className="flex flex-row items-end">
                <Image
                  source={{ uri: metaData.cover.url }}
                  className="w-28 h-44 rounded-lg object-contain"
                />
                <View className="ml-2 flex-1">
                  <Text className="text-white text-xl font-semibold">
                    {mangaTitle ?? metaData.title}
                  </Text>
                  <Text className="text-gray-400">
                    {metaData.authors.join(", ")}
                  </Text>
                  {filteredChapters && filteredChapters?.length > 0 && (
                    <View className="flex flex-row items-center gap-2 mt-1">
                      <Pressable
                        className="bg-[#1c1c1e] p-2 rounded-lg"
                        onPress={handleBookmark}
                      >
                        <Bookmark
                          color={"#1288ff"}
                          fill={bookmarked ? "#1288ff" : "none"}
                          size={24}
                        />
                      </Pressable>
                      <Pressable className="bg-[#1c1c1e] p-2 rounded-lg">
                        <Ionicons name="download" size={24} color={"#1288ff"} />
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
              <View className="mt-2">
                <Text
                  className="text-neutral-400 text-base mb-4"
                  numberOfLines={3}
                >
                  {metaData.synopsis}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: `/reader`,
                      params: {
                        chID: filteredChapters?.[filteredChapters.length - 1]
                          .chId,
                        chNum:
                          filteredChapters?.[filteredChapters.length - 1].chNum,
                      },
                    })
                  }
                  style={{
                    backgroundColor: `#1288ff`,
                  }}
                  className="p-2 rounded-xl my-2 mt-4"
                >
                  <Text className={`text-white text-center text-base`}>
                    {filteredChapters && filteredChapters?.length > 0
                      ? `Start Reading Ch.${
                          filteredChapters[filteredChapters.length - 1].chNum
                        }`
                      : "No chapters found"}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="flex flex-row justify-between items-center bg-black">
              <Text className="text-white text-xl font-semibold py-2 bg-black">
                {filteredChapters?.length} Chapters
              </Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <Ionicons name="filter" color="#1288ff" size={24} />
              </Pressable>
            </View>
            <FlatList
              data={filteredChapters}
              ItemSeparatorComponent={() => (
                <View className="border border-[#2c2c2e] my-2 border-0.5" />
              )}
              renderItem={({ item, index }) => (
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
                  chNum={item.chNum}
                  slug={manga!}
                  chID={item.chId}
                  groupName={item.groupName}
                  isRead={readChapters.includes(item.chId)}
                  nextChId={filteredChapters?.[index + 1]?.chId}
                />
              )}
              className="mb-2"
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
