export interface Cover {
  height: number;
  width: number;
  url: string;
}

export interface BaseChapter {
  chId: string;
  chNum: number;
}

export interface MangaDetails {
  title: string;
  altNames: string[];
  status: string;
  type: string;
  synopsis: string;
  cover: Cover;
  authors: string[];
  publishedOn: string;
  genres: string[];
  mangazines: string[];
  chapters: ChapterResult[];
  groups: string[];
  slug: string;
  isBookmarked: boolean;
}

export interface ChapterResult extends BaseChapter {
  title: string;
  volume: string;
  language: string;
  createdAt: string;
  isLastCh: string;
  groupName: string;
}

export interface Chapter extends BaseChapter {
  pages?: Page[];
}

export interface Page {
  pgNum: string | number;
  url: string;
  width: number;
  height: number;
}

export interface ChapterStoreState {
  chapters: Chapter[];
  setChapterLibrary: (newChapters: Chapter[]) => void;
  getNextChapter: (currentChNum: number) => Promise<Chapter | null>;
  getPreviousChapter: (currentChNum: number) => Promise<Chapter | null>;
}

export interface LibraryStoreState {
  library: MangaDetails[];
  setLibrary: (newLibrary: MangaDetails[]) => Promise<void>;
  loadLibrary: () => Promise<void>;
  bookmarkManga: (mangaToAdd: MangaDetails) => Promise<void>;
  checkMangaExistsInLibrary: (slug: string) => Promise<boolean>;
  getMangaFromLibrary: (slug: string) => Promise<MangaDetails | null>;
}

export interface ReadChaptersStoreState {
  readChapters: string[];
  setReadChapterLibrary: (newReadChapters: string[]) => Promise<void>;
  loadReadChapterLibrary: () => Promise<void>;
  markChapterAsRead: (chIdToMark: string) => Promise<void>;
  markChapterAsUnread: (chIdToMark: string) => Promise<void>;
  checkIfChapterIsRead: (chId: string) => Promise<boolean>;
}

export interface PageItemProps {
  item: Page;
}
