import { useState, useCallback, useEffect } from "react";
import type {
  HrdJobVacancyItem,
  HrdJobVacancyOptions,
  HrdJobVacancyStatistics,
} from "./lowongan.schema";
import { hrdLowonganApi } from "./lowongan.api";
import { useLowonganForm } from "./lowongan.form";
import { useLowonganList } from "./use-lowongan-list";

export function useLowonganPage() {
  const [statistics, setStatistics] = useState<HrdJobVacancyStatistics>({
    active: 0,
    draft_closed: 0,
  });
  const [options, setOptions] = useState<HrdJobVacancyOptions>({
    majors: [],
    targetApplicants: [],
    jobTypes: [],
    vacancyStatuses: [],
  });
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [selectedVacancy, setSelectedVacancy] =
    useState<HrdJobVacancyItem | null>(null);

  const fetchMeta = useCallback(async () => {
    setIsLoadingMeta(true);
    try {
      const [statsRes, optionsRes] = await Promise.allSettled([
        hrdLowonganApi.getStatistics(),
        hrdLowonganApi.getOptions(),
      ]);

      if (statsRes.status === "fulfilled") {
        setStatistics(statsRes.value);
      }
      if (optionsRes.status === "fulfilled") {
        setOptions(optionsRes.value);
      }
    } finally {
      setIsLoadingMeta(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoadingMeta(true);
      try {
        const [statsRes, optionsRes] = await Promise.allSettled([
          hrdLowonganApi.getStatistics(),
          hrdLowonganApi.getOptions(),
        ]);

        if (isMounted) {
          if (statsRes.status === "fulfilled") {
            setStatistics(statsRes.value);
          }
          if (optionsRes.status === "fulfilled") {
            setOptions(optionsRes.value);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingMeta(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditVacancy = useCallback((item: HrdJobVacancyItem) => {
    setSelectedVacancy(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedVacancy(null);
  }, []);

  const list = useLowonganList({
    onVacancyUpdated: fetchMeta,
    onEditVacancy: handleEditVacancy,
  });

  const form = useLowonganForm({
    options,
    selectedVacancy,
    onClearSelection: handleClearSelection,
    onSuccess: () => {
      fetchMeta();
      list.fetchVacancies(1, list.search);
    },
  });

  return {
    statistics,
    options,
    isLoadingMeta,
    selectedVacancy,
    form,
    list,
    handleClearSelection,
  };
}
