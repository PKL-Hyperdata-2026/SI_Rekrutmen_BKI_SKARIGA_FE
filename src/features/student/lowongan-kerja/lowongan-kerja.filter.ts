import { useState, useEffect, useCallback, useMemo } from "react";
import type { FilterSelectOption } from "@/components/custom/filter-select";
import { lowonganKerjaApi, type RawMajor } from "./lowongan-kerja.api";

export interface LowonganKerjaFilterProps {
  departmentOptions?: FilterSelectOption[];
  majorOptions?: FilterSelectOption[];
  targetOptions?: FilterSelectOption[];
  locationOptions?: FilterSelectOption[];
  selectedDepartment?: string;
  selectedMajor?: string;
  selectedTarget?: string;
  selectedLocation?: string;
  defaultDepartment?: string;
  defaultMajor?: string;
  defaultTarget?: string;
  defaultLocation?: string;
  onDepartmentChange?: (val: string) => void;
  onMajorChange?: (val: string) => void;
  onTargetChange?: (val: string) => void;
  onLocationChange?: (val: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function useLowonganKerjaFilterValues(props: LowonganKerjaFilterProps) {
  const departmentValue =
    props.selectedDepartment ?? props.defaultDepartment ?? "all";
  const majorValue = props.selectedMajor ?? props.defaultMajor ?? "all";
  const targetValue = props.selectedTarget ?? props.defaultTarget ?? "all";
  const locationValue =
    props.selectedLocation ?? props.defaultLocation ?? "all";

  return {
    departmentValue,
    majorValue,
    targetValue,
    locationValue,
  };
}

const DEFAULT_DEPARTMENT_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Departemen" },
];

const DEFAULT_MAJOR_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Jurusan" },
];

const DEFAULT_TARGET_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Kategori Target" },
];

const DEFAULT_LOCATION_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Lokasi Kerja" },
];

export function useLowonganKerjaFilter() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedTarget, setSelectedTarget] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [rawMajors, setRawMajors] = useState<RawMajor[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    FilterSelectOption[]
  >(DEFAULT_DEPARTMENT_OPTIONS);
  const [targetOptions, setTargetOptions] = useState<FilterSelectOption[]>(
    DEFAULT_TARGET_OPTIONS,
  );
  const [locationOptions, setLocationOptions] = useState<FilterSelectOption[]>(
    DEFAULT_LOCATION_OPTIONS,
  );

  const [isLoading, setIsLoading] = useState(false);

  const majorOptions = useMemo<FilterSelectOption[]>(() => {
    const available =
      selectedDepartment === "all"
        ? rawMajors
        : rawMajors.filter(
            (m) => String(m.department_id) === selectedDepartment,
          );

    return [
      ...DEFAULT_MAJOR_OPTIONS,
      ...available.map((m) => ({
        value: String(m.id),
        label: m.code ? `${m.name} (${m.code})` : m.name,
      })),
    ];
  }, [rawMajors, selectedDepartment]);

  const fetchOptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await lowonganKerjaApi.getFilterOptions();

      if (data) {
        if (Array.isArray(data.departments)) {
          setDepartmentOptions([
            { value: "all", label: "Semua Departemen" },
            ...data.departments.map((d) => ({
              value: String(d.id),
              label: d.name,
            })),
          ]);
        }

        if (Array.isArray(data.majors)) {
          setRawMajors(data.majors);
        }

        if (Array.isArray(data.targetApplicants)) {
          setTargetOptions([
            { value: "all", label: "Semua Kategori Target" },
            ...data.targetApplicants.map((t) => ({
              value: String(t.id),
              label: t.name,
            })),
          ]);
        }

        if (Array.isArray(data.workLocations)) {
          setLocationOptions([
            { value: "all", label: "Semua Lokasi Kerja" },
            ...data.workLocations
              .map((loc) => {
                if (typeof loc === "string") {
                  return { value: loc, label: loc };
                }
                const val =
                  loc.work_location ?? loc.name ?? String(loc.id ?? "");
                return { value: val, label: val };
              })
              .filter((item) => item.value !== ""),
          ]);
        }
      }
    } catch {
      setDepartmentOptions(DEFAULT_DEPARTMENT_OPTIONS);
      setRawMajors([]);
      setTargetOptions(DEFAULT_TARGET_OPTIONS);
      setLocationOptions(DEFAULT_LOCATION_OPTIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleDepartmentChange = useCallback(
    (val: string) => {
      setSelectedDepartment(val);
      if (val !== "all") {
        const belongsToDept = rawMajors.some(
          (m) =>
            String(m.department_id) === val && String(m.id) === selectedMajor,
        );
        if (!belongsToDept) {
          setSelectedMajor("all");
        }
      }
    },
    [rawMajors, selectedMajor],
  );

  const handleMajorChange = useCallback((val: string) => {
    setSelectedMajor(val);
  }, []);

  const handleTargetChange = useCallback((val: string) => {
    setSelectedTarget(val);
  }, []);

  const handleLocationChange = useCallback((val: string) => {
    setSelectedLocation(val);
  }, []);

  const isFiltered = useMemo(() => {
    return (
      selectedDepartment !== "all" ||
      selectedMajor !== "all" ||
      selectedTarget !== "all" ||
      selectedLocation !== "all"
    );
  }, [selectedDepartment, selectedMajor, selectedTarget, selectedLocation]);

  const resetFilters = useCallback(() => {
    setSelectedDepartment("all");
    setSelectedMajor("all");
    setSelectedTarget("all");
    setSelectedLocation("all");
  }, []);

  return {
    selectedDepartment,
    selectedMajor,
    selectedTarget,
    selectedLocation,
    departmentOptions,
    majorOptions,
    targetOptions,
    locationOptions,
    isLoading,
    isFiltered,
    resetFilters,
    onDepartmentChange: handleDepartmentChange,
    onMajorChange: handleMajorChange,
    onTargetChange: handleTargetChange,
    onLocationChange: handleLocationChange,
  };
}
