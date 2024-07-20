import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bookmark, DownloadIcon } from "lucide-react-native";
import Chapter from "@/components/Chapter";
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
  isBookmarked: string;
}

interface ChapterResult {
  url: string;
  title: string;
  publishedOn: string;
  chNum: number;
}

interface MangaParams extends Record<string, string> {
  isBookmarked: string;
  manga: string;
  name: string;
  posterUrl: string;
  synopsis: string;
}

import useAsyncStorage from "@/hooks/useAsyncStorage";

export default function MangaDetailsPage() {
  const params = useLocalSearchParams<MangaParams>();
  const isBookmarked = params.isBookmarked === "true";
  const manga = params.manga;
  const name = params.name;
  const posterUrl = params.posterUrl;
  const synopsis = params.synopsis;
  const [metaData, setMetadata] = useState<MangaDetails>();
  const [chapters, setChapters] = useState<ChapterResult[]>([]);
  const { bookmarkManga } = useAsyncStorage();

  const getMetadata = async () => {
    try {
      const url = `http://192.168.1.73:5000/manga/${manga}`;
      const { data } = await axios.get(url);
      setMetadata(data);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
  };

  const getChapters = async () => {
    try {
      const url = `http://192.168.1.73:5000/chapters/${manga}`;
      const { data } = await axios.get<{ chapters: ChapterResult[] }>(url);

      setMetadata((prev: MangaDetails | undefined) => ({
        ...prev!,
        chapters: data.chapters,
        slug: manga!,
      }));

      setChapters(data.chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const { checkIfMangaInLibrary } = useAsyncStorage();

  const [bookmarked, setBookmarked] = useState<boolean>(isBookmarked);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMetadata();
        await getChapters();
        let isBookmarked = false;
        if (manga) {
          isBookmarked = await checkIfMangaInLibrary(manga);
          console.log(isBookmarked);
        }
        setBookmarked(isBookmarked);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleBookmark = async (metaData: MangaDetails) => {
    const isBookmarked = await bookmarkManga(metaData);
    setBookmarked(isBookmarked);
  };

  return (
    <View className="mx-4 h-full">
      <View className="flex flex-col ">
        <View className=" flex flex-row items-end  ">
          <Image source={{ uri: posterUrl }} className="w-32 h-48 rounded-lg" />
          <View className="ml-2">
            <Text className="text-white text-2xl font-semibold ">{name}</Text>

            <Text className="text-gray-400">{metaData?.author.join(", ")}</Text>
            {metaData && metaData.chapters?.length > 0 && (
              <View className="flex flex-row items-center gap-2 mt-1">
                <Pressable onPress={() => handleBookmark(metaData)}>
                  <Bookmark
                    color={"#FE375E"}
                    fill={bookmarked ? "#FE375E" : "none"}
                    size={30}
                  />
                </Pressable>
                <Pressable>
                  <DownloadIcon color={"#FE375E"} size={30} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <View className="mt-4">
          <Text className="text-white text-base mb-4" numberOfLines={3}>
            {synopsis}
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
        </View>
      </View>

      <Text className="text-white text-2xl font-semibold mt-2 py-2">
        {chapters.length} Chapters
      </Text>
      {metaData?.chapters && metaData.chapters.length > 0 && (
        <ScrollView className="h-full ">
          {chapters.map((chapter) => (
            <Chapter
              key={chapter.chNum}
              title={chapter.title}
              publishedOn={chapter.publishedOn}
            ></Chapter>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
