import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "@/components/custom/sonner";
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

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchMeta = useCallback(async () => {
    if (!isMountedRef.current) return;
    setIsLoadingMeta(true);
    try {
      const [statsRes, optionsRes] = await Promise.allSettled([
        hrdLowonganApi.getStatistics(),
        hrdLowonganApi.getOptions(),
      ]);

      if (!isMountedRef.current) return;

      if (statsRes.status === "fulfilled") {
        setStatistics(statsRes.value);
      } else {
        console.error("Failed to load vacancy statistics:", statsRes.reason);
      }

      if (optionsRes.status === "fulfilled") {
        setOptions(optionsRes.value);
      } else {
        console.error("Failed to load vacancy options:", optionsRes.reason);
        toast.error("Gagal memuat opsi pilihan lowongan kerja.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingMeta(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchMeta();
  }, [fetchMeta]);

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
