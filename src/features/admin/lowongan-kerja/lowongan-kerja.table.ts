import { useNavigate } from "react-router-dom";
import type { JobVacancy } from "./lowongan-kerja.schema";

export function formatDeadline(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function isDeadlinePassed(dateStr?: string): boolean {
  if (!dateStr) return false;
  const dateOnly = dateStr.slice(0, 10);
  const deadlineEnd = new Date(`${dateOnly}T23:59:59`);
  return !Number.isNaN(deadlineEnd.getTime()) && deadlineEnd.getTime() < Date.now();
}

export function isVacancyClosed(row: JobVacancy): boolean {
  return (
    isDeadlinePassed(row.deadline) ||
    row.status?.code === "closed" ||
    Boolean(row.status?.name?.toLowerCase().includes("tutup")) ||
    Boolean(row.status?.name?.toLowerCase().includes("expired"))
  );
}

export interface UseLowonganKerjaTableProps {
  currentPage: number;
  pageSize: number;
}

export function useLowonganKerjaTable({
  currentPage,
  pageSize,
}: UseLowonganKerjaTableProps) {
  const navigate = useNavigate();

  const numberStartIndex = (currentPage - 1) * pageSize + 1;

  const handleEdit = (item: JobVacancy) => {
    navigate(`/admin/lowongan/${item.id}/edit`);
  };

  return {
    numberStartIndex,
    handleEdit,
  };
}
