import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UseQueryOptions } from "@tanstack/react-query";

import { useFocusNotifyOnChangeProps } from "./useFocusNotifyOnChangeProps";

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

const useMangarida = () => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();
  const getChapterPages = async (slug: string, chNum: string) => {
    const url = `/read/${slug}/chapter-${chNum}`;
    const { data } = await axios.get(url);
    if (data) {
      return data.pages;
    } else {
      throw new Error("Failed to fetch chapter pages");
    }
  };

  const getSearchResults = async (searchValue: string) => {
    const url = `/search?query=${searchValue}`;
    const { data } = await axios.get(url);
    return data.results;
  };

  const getMetadata = async (slug: string) => {
    const url = `/manga/${slug}`;
    const { data } = await axios.get(url);
    return data;
  };

  const getChapters = async (slug: string) => {
    const url = `/chapters/${slug}?page=1`;
    const { data } = await axios.get<{ chapters: ChapterResult[] }>(url);
    return data.chapters;
  };

  const useChapterPages = (
    slug: string,
    chNum: string,
    options?: Omit<
      UseQueryOptions<any, Error, any, string[]>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["chapterPages", slug, chNum],
      queryFn: () => getChapterPages(slug, chNum),
      staleTime: 5 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      notifyOnChangeProps,
      ...options,
    });

  const useSearchResults = (
    searchValue: string,
    options?: Omit<
      UseQueryOptions<any, Error, any, string[]>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["searchResults", searchValue.toLowerCase()],
      queryFn: async () => await getSearchResults(searchValue),
      staleTime: 5 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      notifyOnChangeProps,
      enabled: !!searchValue,
      ...options,
    });

  const useMetadata = (
    slug: string,
    options?: Omit<
      UseQueryOptions<any, Error, any, string[]>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["metadata", slug],
      queryFn: () => getMetadata(slug),
      staleTime: 5 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      notifyOnChangeProps,
      ...options,
    });

  const useChapters = (
    slug: string,
    options?: Omit<
      UseQueryOptions<any, Error, any, string[]>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["chapters", slug],
      queryFn: async () => await getChapters(slug),
      staleTime: 5 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      notifyOnChangeProps,
      ...options,
    });

  return { useChapterPages, useSearchResults, useMetadata, useChapters };
};

export default useMangarida;
