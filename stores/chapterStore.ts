import { create } from "zustand";

interface Chapter {
  chId: string;
  chNum: string;
}

interface StoreState {
  chapters: Chapter[];
  setChapterLibrary: (newChapters: Chapter[]) => Promise<void>;
  getNextUniqueChapterId: (currentChNum: string) => Chapter | undefined;
}

const useChapterStore = create<StoreState>((set, get) => ({
  chapters: [],
  setChapterLibrary: async (newChapters) => {
    set({ chapters: newChapters });
  },

  getNextUniqueChapterId: (currentChNum) => {
    const { chapters } = get();
    const currentIndex = chapters.findIndex(
      (chapter) => chapter.chNum === currentChNum
    );

    if (currentIndex === -1 || currentIndex >= chapters.length - 1) {
      return undefined;
    }

    let nextIndex = currentIndex - 1;
    let nextChapter = chapters[nextIndex];

    while (nextIndex < chapters.length && nextChapter.chNum === currentChNum) {
      nextIndex++;
      nextChapter = chapters[nextIndex];
    }

    if (nextIndex < chapters.length) {
      return {
        chId: nextChapter.chId,
        chNum: nextChapter.chNum,
      };
    }

    return undefined;
  },
}));

export default useChapterStore;
