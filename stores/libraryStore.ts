import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MangaDetails, LibraryStoreState } from "@/interfaces/interfaces";

const useStore = create<LibraryStoreState>((set, get) => ({
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
    const { library, setLibrary } = get();
    const updatedLibrary = [...library];
    const mangaIndex = updatedLibrary.findIndex(
      (manga) => manga.slug === mangaToAdd.slug
    );

    if (mangaIndex === -1) {
      const mangaWithBookmark: MangaDetails = {
        ...mangaToAdd,
        isBookmarked: true,
      };
      updatedLibrary.push(mangaWithBookmark);
      await setLibrary(updatedLibrary);
      console.log("bookmarked ", mangaToAdd.slug);
    } else {
      updatedLibrary.splice(mangaIndex, 1);
      await setLibrary(updatedLibrary);
    }
  },

  checkMangaExistsInLibrary: async (slug: string): Promise<boolean> => {
    const { library } = get();
    return library.some((manga) => manga.slug === slug);
  },

  getMangaFromLibrary: async (slug: string): Promise<MangaDetails | null> => {
    const { library } = get();
    return library.find((manga) => manga.slug === slug) ?? null;
  },
}));

export default useStore;
