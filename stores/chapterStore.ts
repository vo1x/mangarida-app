import { create } from "zustand";
import { ChapterStoreState } from "@/interfaces/interfaces";

const useChapterStore = create<ChapterStoreState>((set, get) => ({
  chapters: [],
  setChapterLibrary: (newChapters) => {
    set({ chapters: newChapters });
  },

  getNextChapter: async (currentChNum: number) => {
    const { chapters } = get();
    const currentIndex = chapters.findIndex(
      (chapter) => chapter.chNum === currentChNum
    );

    if (currentIndex === -1 || currentIndex === 0) {
      return null;
    }

    let nextIndex = currentIndex - 1;
    while (nextIndex >= 0 && chapters[nextIndex].chNum === currentChNum) {
      nextIndex--;
    }

    if (nextIndex >= 0) {
      return {
        chId: chapters[nextIndex].chId,
        chNum: chapters[nextIndex].chNum,
      };
    }

    return null;
  },
  getPreviousChapter: async (currentChNum: number) => {
    const { chapters } = get();
    const currentIndex = chapters.findIndex(
      (chapter) => chapter.chNum === currentChNum
    );

    if (currentIndex === -1 || currentIndex === 0) {
      return null;
    }

    let nextIndex = currentIndex + 1;
    while (nextIndex >= 0 && chapters[nextIndex].chNum === currentChNum) {
      nextIndex++;
    }

    if (nextIndex >= 0) {
      return {
        chId: chapters[nextIndex].chId,
        chNum: chapters[nextIndex].chNum,
      };
    }

    return null;
  },
}));

export default useChapterStore;
