import { useState, useEffect, useCallback } from "react";
import { Mail, Pencil, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { PageHeader, SectionCard, Box, Span } from "@/components/custom";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/custom/sonner";
import {
  messageTemplateApi,
  type MessageTemplateItem,
} from "./message-templates.api";

export function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplateItem | null>(null);
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await messageTemplateApi.getTemplates();
      setTemplates(data || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat daftar template pesan.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenEdit = (tpl: MessageTemplateItem) => {
    setSelectedTemplate(tpl);
    setSubject(tpl.subject);
    setBody(tpl.body);
    setActiveModal(true);
  };

  const handleInsertVariable = (varName: string) => {
    setBody((prev) => `${prev} {${varName}}`);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    if (!subject.trim()) {
      toast.error("Subjek pesan tidak boleh kosong.");
      return;
    }
    if (!body.trim()) {
      toast.error("Isi pesan tidak boleh kosong.");
      return;
    }

    setSaving(true);
    try {
      const updated = await messageTemplateApi.updateTemplate(
        selectedTemplate.id,
        {
          subject,
          body,
          is_active: selectedTemplate.is_active,
        },
      );
      toast.success(`Template "${selectedTemplate.name}" berhasil diperbarui.`);
      setTemplates((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      setActiveModal(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui template.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="w-full max-w-full min-w-0 flex flex-col gap-5 sm:gap-6 overflow-x-hidden">
      <PageHeader
        variant="admin"
        badgeIcon={<Mail className="h-3.5 w-3.5" />}
        title="Template Notifikasi & Pesan"
        description="Kelola teks otomatis untuk email dan notifikasi sistem dengan variabel dinamis."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      />

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchTemplates}
            className="h-7 text-xs gap-1.5 border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Coba Lagi
          </Button>
        </div>
      )}

      <SectionCard
        title={
          <Span className="text-xs sm:text-sm font-bold text-[#1E293B]">
            Daftar Template Pesan Sistem
          </Span>
        }
        className="rounded-xl border-none bg-card shadow-xs p-3.5 sm:p-4.5"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Kode Event</th>
                <th className="py-2.5 px-3">Nama Template</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Subjek Default</th>
                <th className="py-2.5 px-3">Variabel Tersedia</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat daftar template pesan...
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada template pesan terdaftar.
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => (
                  <tr
                    key={tpl.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-xs text-blue-700 font-semibold">
                      {tpl.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {tpl.name}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold uppercase bg-slate-50"
                      >
                        {tpl.channel}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {tpl.subject}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {(tpl.variables || []).map((v) => (
                          <span
                            key={v}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200"
                          >
                            {`{${v}}`}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(tpl)}
                        className="h-7 px-2.5 text-xs gap-1 font-semibold cursor-pointer hover:border-blue-400 hover:text-blue-600"
                      >
                        <Pencil className="size-3" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Edit Modal */}
      {selectedTemplate && (
        <Modal
          open={activeModal}
          onOpenChange={setActiveModal}
          title={`Edit Template: ${selectedTemplate.name}`}
          description={`Kode event: ${selectedTemplate.code} (${selectedTemplate.channel.toUpperCase()})`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setActiveModal(false)}
                disabled={saving}
                className="cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {saving ? "Menyimpan..." : "Simpan Template"}
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Subjek Pesan / Judul Notifikasi
              </Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subjek pesan..."
                className="text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">
                  Isi Pesan / Body
                </Label>
                <Span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-purple-600" />
                  Klik variabel untuk menyisipkan
                </Span>
              </div>

              {/* Variable Chips */}
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                {(selectedTemplate.variables || []).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleInsertVariable(v)}
                    className="px-2 py-1 rounded text-xs font-mono font-semibold bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    {`+{${v}}`}
                  </button>
                ))}
              </div>

              <Textarea
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tulis format isi pesan..."
                className="text-sm font-normal min-h-28"
              />
            </div>
          </div>
        </Modal>
      )}
    </Box>
  );
}
