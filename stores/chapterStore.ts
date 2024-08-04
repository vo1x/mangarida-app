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

    if (currentIndex === -1 || currentIndex === chapters.length - 1) {
      return null;
    }

    let nextIndex = currentIndex - 1;
    while (
      nextIndex < chapters.length &&
      chapters[nextIndex].chNum === currentChNum
    ) {
      nextIndex++;
    }

    if (nextIndex < chapters.length) {
      return chapters[nextIndex];
    }

    return null;
  },
}));

export default useChapterStore;
