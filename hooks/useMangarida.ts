import axios from "axios";

interface ChapterResult {
  url: string;
  title: string;
  publishedOn: string;
  chNum: number;
}

const useMangarida = () => {
  const getChapterPages = async (slug: string, chNum: string) => {
    const url = `/read/${slug}/chapter-${chNum}`;

    try {
      const { data } = await axios.get(url);
      if (data) {
        return data.pages;
      } else {
        throw Error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSearchResults = async (searchValue: string) => {
    try {
      const url = `/search?query=${searchValue}`;
      const { data } = await axios.get(url);
      return data.results;
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
  };
  const getMetadata = async (slug: string) => {
    try {
      const url = `/manga/${slug}`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
  };

  const getChapters = async (slug: string) => {
    try {
      const url = `/chapters/${slug}`;
      const { data } = await axios.get<{ chapters: ChapterResult[] }>(url);
      return data.chapters;
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  return { getChapterPages, getSearchResults, getMetadata, getChapters };
};

export default useMangarida;
