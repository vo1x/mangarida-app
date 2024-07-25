import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface StoreState {
  library: MangaDetails[];
  setLibrary: (newLibrary: MangaDetails[]) => Promise<void>;
  loadLibrary: () => Promise<void>;
  bookmarkManga: (mangaToAdd: MangaDetails) => Promise<void>;
  checkMangaExistsInLibrary: (slug: string) => Promise<boolean>;
  getMangaFromLibrary: (slug: string) => Promise<MangaDetails | null>;
}

const useStore = create<StoreState>((set) => ({
  library: [],
  setLibrary: async (newLibrary) => {
    set({ library: newLibrary });
    await AsyncStorage.setItem("library", JSON.stringify(newLibrary));
  },

  loadLibrary: async () => {
    try {
      const savedLibrary = await AsyncStorage.getItem("library");
      if (savedLibrary) {
        set({ library: JSON.parse(savedLibrary) });
      }
    } catch (error) {
      console.error("Error loading library", error);
    }
  },

  bookmarkManga: async (mangaToAdd: MangaDetails) => {
    const updatedLibrary = [...useStore.getState().library];
    const mangaIndex = updatedLibrary.findIndex(
      (manga) => manga.slug === mangaToAdd.slug
    );
    if (mangaIndex === -1) {
      const mangaWithBookmark: MangaDetails = {
        ...mangaToAdd,
        isBookmarked: true,
      };
      updatedLibrary.push(mangaWithBookmark);
      await useStore.getState().setLibrary(updatedLibrary);
      console.log("bookmarked ", mangaToAdd.slug);
    }

    if (mangaIndex !== -1) {
      updatedLibrary.splice(mangaIndex, 1);
      await useStore.getState().setLibrary(updatedLibrary);
    }
  },

  checkMangaExistsInLibrary: async (slug: string): Promise<boolean> => {
    const storedData = [...useStore.getState().library];
    const mangaIndex = storedData.findIndex((manga) => manga.slug === slug);
    return mangaIndex !== -1;
  },

  getMangaFromLibrary: async (slug: string): Promise<MangaDetails | null> => {
    const storedData = [...useStore.getState().library];
    const manga = storedData.find((manga) => manga.slug === slug);
    return manga ?? null;
  },
}));

export default useStore;
