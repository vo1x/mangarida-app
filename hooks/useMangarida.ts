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
  const getChapterPages = async (chID: string) => {
    const url = `/read/${chID}`;
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
    const url = `/chapters/${slug}`;
    const { data } = await axios.get<{ chapters: ChapterResult[] }>(url);
    return data.chapters;
  };

  const useChapterPages = (
    chID: string,
    options?: Omit<
      UseQueryOptions<any, Error, any, string[]>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery({
      queryKey: ["chapterPages", chID],
      queryFn: () => getChapterPages(chID),
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
    apiEnabled: boolean,

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
      enabled: apiEnabled,
      ...options,
    });

  const useChapters = (
    slug: string,
    apiEnabled: boolean,

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
      enabled: apiEnabled,
      notifyOnChangeProps,
      ...options,
    });

  return { useChapterPages, useSearchResults, useMetadata, useChapters };
};

export default useMangarida;
