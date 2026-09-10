import { useState, useEffect, useRef, useCallback } from "react";
import type {
  AsyncSelectItem,
  FetchSelectPage,
  SelectPageResult,
} from "@/api/select-options";

export interface UsePaginatedOptionsConfig {
  fetchPage: FetchSelectPage;
  perPage?: number;
  debounceMs?: number;
}

export interface UsePaginatedOptionsResult {
  options: AsyncSelectItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
  onOpen: () => void;
  resetSearch: () => void;
}

export function usePaginatedOptions({
  fetchPage,
  perPage = 20,
  debounceMs = 500,
}: UsePaginatedOptionsConfig): UsePaginatedOptionsResult {
  const [options, setOptions] = useState<AsyncSelectItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const pageRef = useRef(1);
  const requestIdRef = useRef(0);
  const loadedRef = useRef(false);
  const lastFetchedSearchRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchPageRef = useRef(fetchPage);

  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      abortRef.current?.abort();
    };
  }, []);

  const runFetch = useCallback(
    async (targetSearch: string, targetPage: number, append: boolean) => {
      if (!append && lastFetchedSearchRef.current === targetSearch && loadedRef.current) {
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const isStale = () => requestIdRef.current !== requestId;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const result: SelectPageResult = await fetchPageRef.current(
          {
            search: targetSearch,
            page: targetPage,
            per_page: perPage,
          },
          { signal: controller.signal }
        );
        if (isStale()) return;

        pageRef.current = targetPage + 1;
        setHasMore(result.hasMore);
        setOptions((prev) => {
          const merged = append ? [...prev, ...result.items] : result.items;
          const seen = new Set<string>();
          return merged.filter((item) => {
            if (seen.has(item.value)) return false;
            seen.add(item.value);
            return true;
          });
        });
        if (!append) {
          lastFetchedSearchRef.current = targetSearch;
        }
        loadedRef.current = true;
        setHasLoaded(true);
      } catch {
        if (isStale()) return;
        if (!append) setOptions([]);
        setHasMore(false);
      } finally {
        if (!isStale()) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [perPage]
  );

  const onOpen = useCallback(() => {
    if (!hasLoaded && !loading) {
      pageRef.current = 1;
      void runFetch(search, 1, false);
    }
  }, [hasLoaded, loading, search, runFetch]);

  const onLoadMore = useCallback(() => {
    if (!hasMore || loading || loadingMore) return;
    void runFetch(search, pageRef.current, true);
  }, [hasMore, loading, loadingMore, search, runFetch]);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      searchTimerRef.current = setTimeout(() => {
        if (!loadedRef.current) return;
        pageRef.current = 1;
        void runFetch(value, 1, false);
      }, debounceMs);
    },
    [debounceMs, runFetch]
  );

  const resetSearch = useCallback(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    abortRef.current?.abort();
    requestIdRef.current += 1;
    loadedRef.current = false;
    lastFetchedSearchRef.current = null;
    pageRef.current = 1;
    setSearch("");
    setHasLoaded(false);
  }, []);

  return {
    options,
    loading,
    loadingMore,
    hasMore,
    search,
    onSearchChange,
    onLoadMore,
    onOpen,
    resetSearch,
  };
}
