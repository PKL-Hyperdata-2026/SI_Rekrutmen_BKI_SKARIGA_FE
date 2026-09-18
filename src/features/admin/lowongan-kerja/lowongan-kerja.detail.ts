import { useState, useEffect, useMemo, useCallback } from "react";
import { type JobVacancy } from "./lowongan-kerja.schema";
import { lowonganKerjaApi } from "./lowongan-kerja.api";

export interface UseLowonganKerjaDetailProps {
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

export function useLowonganKerjaDetail({
  open,
  onOpenChange,
  vacancy,
}: UseLowonganKerjaDetailProps) {
  const [activeVacancy, setActiveVacancy] = useState<JobVacancy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDetail(id: number | string) {
      setIsLoading(true);
      try {
        const data = await lowonganKerjaApi.getVacancyDetail(id);
        if (isMounted && data) {
          setActiveVacancy(data);
        }
      } catch (err: unknown) {
        void err;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (open && vacancy?.id) {
      loadDetail(vacancy.id);
    }

    return () => {
      isMounted = false;
    };
  }, [open, vacancy?.id]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const detail = useMemo(() => {
    const current = open ? (activeVacancy ?? vacancy) : null;
    if (!current) {
      return {
        companyName: "-",
        position: "-",
        quota: "-",
        deadline: "-",
        major: "-",
        target: "-",
        workLocation: "-",
        description: "",
        qualification: "",
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
      description: current.description ?? "",
      qualification: current.qualification ?? "",
      qualificationLines: parseQualificationLines(current.qualification),
      isHtmlQualification: Boolean(
        current.qualification &&
          current.qualification.includes("<") &&
          current.qualification.includes(">"),
      ),
    };
  }, [activeVacancy, vacancy, open]);

  return {
    isLoading,
    companyName: detail.companyName,
    position: detail.position,
    quota: detail.quota,
    deadline: detail.deadline,
    major: detail.major,
    target: detail.target,
    workLocation: detail.workLocation,
    description: detail.description,
    qualification: detail.qualification,
    qualificationLines: detail.qualificationLines,
    isHtmlQualification: detail.isHtmlQualification,
    handleOpenChange,
  };
}
