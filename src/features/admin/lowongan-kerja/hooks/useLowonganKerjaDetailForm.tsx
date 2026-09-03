import { useState, useEffect, useMemo, useCallback } from "react";
import { type JobVacancy } from "../types";
import { api } from "@/api/axios";

export interface UseLowonganKerjaDetailFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancy: JobVacancy | null;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function resolveTarget(code?: string, name?: string): string {
  const key = (code ?? name ?? "").toLowerCase();
  if (!key || key === "all" || key === "semua") return "Siswa & Alumni";
  if (key.includes("alumni") && key.includes("siswa")) return "Siswa & Alumni";
  if (key.includes("alumni")) return "Alumni";
  if (key.includes("siswa")) return "Siswa";
  return name ?? "-";
}

function stripLeadingBullet(line: string): string {
  const bulletChars = ["-", "•", "*", "·"];
  const trimmed = line.trim();
  const firstChar = trimmed.charAt(0);
  if (bulletChars.includes(firstChar)) {
    return trimmed.slice(1).trim();
  }
  return trimmed;
}

function parseQualificationLines(text?: string): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map(stripLeadingBullet)
    .filter((line) => line.length > 0);
}

export function useLowonganKerjaDetailForm({
  open,
  onOpenChange,
  vacancy,
}: UseLowonganKerjaDetailFormProps) {
  const [activeVacancy, setActiveVacancy] = useState<JobVacancy | null>(
    vacancy,
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const response = await api.get<{ data: JobVacancy }>(
        `/admin/job-vacancies/${id}`,
      );
      if (response.data?.data) {
        setActiveVacancy(response.data.data);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && vacancy?.id) {
      setActiveVacancy(vacancy);
      fetchDetail(vacancy.id);
    } else if (!open) {
      setIsLoading(false);
    }
  }, [open, vacancy, fetchDetail]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const detail = useMemo(() => {
    const current = activeVacancy ?? vacancy;
    if (!current) {
      return {
        companyName: "-",
        position: "-",
        quota: "-",
        deadline: "-",
        major: "-",
        target: "-",
        workLocation: "-",
        qualificationLines: [],
      };
    }

    const majorLabel =
      current.majors && current.majors.length > 0
        ? current.majors.map((m) => m.code || m.name).join(" & ")
        : "-";

    return {
      companyName: current.company?.name ?? "-",
      position: current.position || current.title || "-",
      quota: current.quota != null ? `${current.quota} Orang` : "-",
      deadline: formatDate(current.deadline),
      major: majorLabel,
      target: resolveTarget(
        current.targetApplicant?.code,
        current.targetApplicant?.name,
      ),
      workLocation: current.workLocation ?? "-",
      qualificationLines: parseQualificationLines(
        current.qualification || current.description,
      ),
    };
  }, [activeVacancy, vacancy]);

  return {
    isLoading,
    companyName: detail.companyName,
    position: detail.position,
    quota: detail.quota,
    deadline: detail.deadline,
    major: detail.major,
    target: detail.target,
    workLocation: detail.workLocation,
    qualificationLines: detail.qualificationLines,
    handleOpenChange,
  };
}
