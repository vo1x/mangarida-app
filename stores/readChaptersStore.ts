import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReadChaptersStoreState } from "@/interfaces/interfaces";

const useReadChaptersStore = create<ReadChaptersStoreState>((set) => ({
  readChapters: [],
  setReadChapterLibrary: async (newReadChapters) => {
    set({ readChapters: newReadChapters });
    await AsyncStorage.setItem("readChapters", JSON.stringify(newReadChapters));
  },

  loadReadChapterLibrary: async () => {
    try {
      const savedLibrary = await AsyncStorage.getItem("readChapters");
      if (savedLibrary) {
        set({ readChapters: JSON.parse(savedLibrary) });
      }
    } catch (error) {
      console.error("Error loading library", error);
    }
  },

  markChapterAsRead: async (chIdToMark: string) => {
    const { readChapters } = useReadChaptersStore.getState();
    const updatedLibrary = [...readChapters];
    if (!updatedLibrary.includes(chIdToMark)) {
      updatedLibrary.push(chIdToMark);
      await useReadChaptersStore
        .getState()
        .setReadChapterLibrary(updatedLibrary);
      console.log("marked as read ", chIdToMark);
    }
  },
  markChapterAsUnread: async (chIdToMark: string) => {
    const { readChapters } = useReadChaptersStore.getState();
    const updatedLibrary = [...readChapters];
    const chapterIndex = updatedLibrary.findIndex((id) => chIdToMark === id);
    if (chapterIndex !== -1) {
      updatedLibrary.splice(chapterIndex, 1);
      await useReadChaptersStore
        .getState()
        .setReadChapterLibrary(updatedLibrary);
      console.log("marked as unread ", chIdToMark);
    }
  },
  checkIfChapterIsRead: async (chId: string): Promise<boolean> => {
    const { readChapters } = useReadChaptersStore.getState();
    return readChapters.includes(chId);
  },
}));

export default useReadChaptersStore;
