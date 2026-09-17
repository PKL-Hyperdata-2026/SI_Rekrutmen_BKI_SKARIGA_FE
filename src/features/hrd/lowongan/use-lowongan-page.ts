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
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] =
    useState<HrdJobVacancyItem | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadInitialMeta = async () => {
      try {
        const [statsRes, optionsRes] = await Promise.allSettled([
          hrdLowonganApi.getStatistics({ signal: controller.signal }),
          hrdLowonganApi.getOptions({ signal: controller.signal }),
        ]);

        if (ignore || controller.signal.aborted) return;

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
        if (!ignore && abortControllerRef.current === controller) {
          setIsLoadingMeta(false);
        }
      }
    };

    void loadInitialMeta();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  const fetchMeta = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingMeta(true);
    try {
      const [statsRes, optionsRes] = await Promise.allSettled([
        hrdLowonganApi.getStatistics({ signal: controller.signal }),
        hrdLowonganApi.getOptions({ signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

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
      if (abortControllerRef.current === controller) {
        setIsLoadingMeta(false);
      }
    }
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedVacancy(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((item: HrdJobVacancyItem) => {
    setSelectedVacancy(item);
    setIsFormOpen(true);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedVacancy(null);
    }
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedVacancy(null);
  }, []);

  const list = useLowonganList({
    onVacancyUpdated: fetchMeta,
    onEditVacancy: handleOpenEdit,
  });

  const {
    fetchVacancies,
    search: listSearch,
    statusFilter: listStatusFilter,
    majorFilter: listMajorFilter,
    targetFilter: listTargetFilter,
    jobTypeFilter: listJobTypeFilter,
    sort: listSort,
  } = list;

  const handleFormSuccess = useCallback(() => {
    void fetchMeta();
    void fetchVacancies(
      1,
      listSearch,
      listStatusFilter,
      listMajorFilter,
      listTargetFilter,
      listJobTypeFilter,
      listSort
    );
  }, [
    fetchMeta,
    fetchVacancies,
    listSearch,
    listStatusFilter,
    listMajorFilter,
    listTargetFilter,
    listJobTypeFilter,
    listSort,
  ]);

  const form = useLowonganForm({
    open: isFormOpen,
    onOpenChange: handleFormOpenChange,
    selectedVacancy,
    options,
    onSuccess: handleFormSuccess,
    onClearSelection: handleClearSelection,
  });

  return {
    isFormOpen,
    selectedVacancy,
    handleOpenCreate,
    handleOpenEdit,
    handleFormOpenChange,
    handleFormSuccess,
    statistics,
    options,
    isLoadingMeta,
    fetchMeta,
    form,
    list,
    handleClearSelection,
  };
}
