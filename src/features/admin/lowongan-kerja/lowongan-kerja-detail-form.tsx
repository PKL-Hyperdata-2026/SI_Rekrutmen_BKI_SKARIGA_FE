import { Modal } from "@/components/custom/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Building2, Loader2 } from "lucide-react";
import { type JobVacancy } from "./lowongan-kerja.schema";
import { useLowonganKerjaDetailForm } from "./use-lowongan-kerja-detail";

export interface LowonganKerjaDetailFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancy: JobVacancy | null;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <Field className="gap-1.5">
      <Label className="text-xs font-bold text-[#1e1b4b]">{label}</Label>
      <Card className="rounded-lg border border-slate-200 bg-[#F6F7FB] px-4 py-3 min-h-11 flex flex-row items-center ring-0 shadow-none gap-0">
        <CardContent className="p-0 text-sm text-slate-700">
          {value ?? "-"}
        </CardContent>
      </Card>
    </Field>
  );
}

function QualificationList({ lines }: { lines: string[] }) {
  if (lines.length === 0) {
    return (
      <Card className="rounded-lg border border-slate-200 bg-[#F6F7FB] px-4 py-3 ring-0 shadow-none gap-0">
        <CardContent className="p-0 text-sm text-slate-500 italic">
          Tidak ada kualifikasi yang dicantumkan.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg border border-slate-200 bg-[#F6F7FB] px-4 py-3 ring-0 shadow-none gap-0 max-h-52 overflow-y-auto custom-scrollbar pr-2">
      <CardContent className="flex flex-col gap-1.5 p-0">
        {lines.map((line, idx) => (
          <CardDescription key={idx} className="text-sm text-slate-700">
            {line}
          </CardDescription>
        ))}
      </CardContent>
    </Card>
  );
}

export function LowonganKerjaDetailForm({
  open,
  onOpenChange,
  vacancy,
}: LowonganKerjaDetailFormProps) {
  const {
    isLoading,
    companyName,
    position,
    quota,
    deadline,
    major,
    target,
    workLocation,
    qualificationLines,
    handleOpenChange,
  } = useLowonganKerjaDetailForm({ open, onOpenChange, vacancy });

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      variant="admin"
      headerStyle="gradient"
      size="sm"
      title="Detail Lowongan Pekerjaan"
      description="Informasi lengkap mengenai lowongan kerja."
      footer={null}
      className="w-[95vw] sm:max-w-120 max-h-[92vh] rounded-lg"
    >
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center py-24 gap-3 border-none ring-0 shadow-none bg-transparent">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <CardDescription className="text-xs font-medium text-slate-500 font-sans">
            Memuat detail lowongan kerja...
          </CardDescription>
        </Card>
      ) : (
        <FieldGroup className="gap-4 sm:gap-5">
          <Card className="flex flex-row items-center gap-3 rounded-lg border border-slate-200 bg-[#F6F7FB] px-4 py-3 ring-0 shadow-none">
            <CardContent className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 p-0">
              <Building2 className="size-5" />
            </CardContent>
            <CardContent className="flex flex-col min-w-0 p-0">
              <CardTitle className="text-sm font-bold text-slate-800 truncate">
                {companyName}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 truncate">
                Posisi: {position}
              </CardDescription>
            </CardContent>
          </Card>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailItem label="Kuota" value={quota} />
            <DetailItem label="Batas Pendaftaran" value={deadline} />
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailItem label="Jurusan" value={major} />
            <DetailItem label="Target" value={target} />
          </FieldGroup>

          <DetailItem label="Lokasi Kerja" value={workLocation} />

          <Field className="gap-1.5">
            <Label className="text-xs font-bold text-[#1e1b4b]">
              Kualifikasi / Persyaratan
            </Label>
            <QualificationList lines={qualificationLines} />
          </Field>
        </FieldGroup>
      )}
    </Modal>
  );
}
