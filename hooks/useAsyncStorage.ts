import AsyncStorage from "@react-native-async-storage/async-storage";
import { emitAsyncStorageUpdated } from "@/utils/AsyncStorageEmitter";

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
  title: string[];
  publishedOn: string;
  chNum: number;
}

export default function useAsyncStorage() {
  const getLibrary = async () => {
    const key = "library";
    try {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData !== null) {
        return JSON.parse(storedData);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  };

  const bookmarkManga = async (
    mangaDetails: MangaDetails
  ): Promise<boolean> => {
    const key = "library";
    try {
      let existingLibrary: MangaDetails[] = await getLibrary();

      const libIndex = existingLibrary.findIndex(
        (item) => item.slug === mangaDetails.slug
      );
      if (libIndex !== -1) {
        existingLibrary.splice(libIndex, 1);
        await AsyncStorage.setItem(key, JSON.stringify(existingLibrary));
        emitAsyncStorageUpdated();
        console.log("Manga unbookmarked successfully!");
        return false;
      }
      existingLibrary.push({ ...mangaDetails, isBookmarked: "true" });

      await AsyncStorage.setItem(key, JSON.stringify(existingLibrary));
      emitAsyncStorageUpdated();

      console.log("Manga bookmarked successfully!");
      return true;
    } catch (error) {
      console.error("Error bookmarking manga: ", error);
      throw error;
    }
  };

  const checkIfMangaInLibrary = async (
    slug: string | undefined
  ): Promise<boolean> => {
    try {
      const library = await getLibrary();
      if (library.length !== 0) {
        return library.some((manga: any) => manga.slug === slug);
      }
      return false;
    } catch (error) {
      console.error("Error checking manga: ", error);
      return false;
    }
  };

  return { bookmarkManga, getLibrary, checkIfMangaInLibrary };
}
