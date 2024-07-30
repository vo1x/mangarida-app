import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocalStorage from "@/hooks/useLocalStorage";

interface StoreState {
  downloadedChapters: string[];
  setDownloadedChaptersLibrary: (
    newDownloadedChapters: string[]
  ) => Promise<void>;
  loadDownloadedChaptersLibrary: () => Promise<void>;
  markChapterAsDownloaded: (chIdToDownload: string) => Promise<void>;
  //   removeDownloadedChapter: (
  //     slug: string,
  //     chIDToRemove: string
  //   ) => Promise<void>;
  checkIfChapterIsDownloaded: ( chId: string) => Promise<boolean>;
}

const useDownloadedChaptersStore = create<StoreState>((set) => ({
  downloadedChapters: [],
  setDownloadedChaptersLibrary: async (newDownloadedChapters) => {
    await AsyncStorage.setItem(
      "downloadedChapters",
      JSON.stringify(newDownloadedChapters)
    );
  },

  loadDownloadedChaptersLibrary: async () => {
    try {
      const savedLibrary = await AsyncStorage.getItem("downloadedChapters");
      if (savedLibrary) {
        set({ downloadedChapters: JSON.parse(savedLibrary) });
      }
    } catch (error) {
      console.error("Error loading downloaded Chapters", error);
    }
  },

  markChapterAsDownloaded: async (chIdToDownload) => {
    const { downloadedChapters } = useDownloadedChaptersStore.getState();
    const updatedLibrary = [...downloadedChapters];
    if (!updatedLibrary.includes(chIdToDownload)) {
      updatedLibrary.push(chIdToDownload);
      await useDownloadedChaptersStore
        .getState()
        .setDownloadedChaptersLibrary(updatedLibrary);
      console.log("download  ", chIdToDownload);
    }
  },
  checkIfChapterIsDownloaded: async (chId: string): Promise<boolean> => {
    const { downloadedChapters } = useDownloadedChaptersStore.getState();
    return downloadedChapters.includes(chId);
  },
}));

export default useDownloadedChaptersStore;
