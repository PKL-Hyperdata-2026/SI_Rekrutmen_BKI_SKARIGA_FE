import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, StatCard, DataTable } from "@/components/custom";
import {
  Store,
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/custom/modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/custom/sonner";
import { dudiApi } from "./dudi.api";
import { useDudiForm, toCreateDudiPayload } from "./dudi.form";
import { DudiForm } from "./dudi-form";
import { buildDudiColumns } from "./dudi-table";
import type { DudiItem, IndustryOption } from "./dudi.schema";

export function DudiPage() {
  const [companies, setCompanies] = useState<DudiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState<IndustryOption[]>([]);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<DudiItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteCompany, setDeleteCompany] = useState<DudiItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useDudiForm(editingCompany);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (industryFilter !== "all") params.industry_id = industryFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? "1" : "0";

      const res = await dudiApi.getCompanies(params);
      setCompanies(res.data?.data?.data || []);
    } catch {
      setCompanies([]);
      toast.error("Gagal memuat data industri mitra.");
    } finally {
      setLoading(false);
    }
  }, [search, industryFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;
    dudiApi
      .getCompanyOptions()
      .then((res) => {
        if (!ignore && res.data?.data?.industries) {
          setIndustries(res.data.data.industries);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCompanies();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchCompanies]);

  const handleOpenCreate = () => {
    setEditingCompany(null);
    form.reset({
      name: "",
      industry_id: "",
      address: "",
      email: "",
      phone: "",
      website: "",
      pic_name: "",
      pic_contact: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((item: DudiItem) => {
    setEditingCompany(item);
    form.reset({
      name: item.name,
      industry_id: item.industryId ? String(item.industryId) : "",
      address: item.address || "",
      email: item.email || "",
      phone: item.phone || "",
      website: item.website || "",
      pic_name: item.picName || "",
      pic_contact: item.picContact || "",
      is_active: item.isActive,
    });
    setIsFormOpen(true);
  }, [form]);

  const handleSubmitForm = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = toCreateDudiPayload(values);

      if (editingCompany) {
        await dudiApi.updateCompany(editingCompany.id, payload);
        toast.success("Data industri mitra berhasil diperbarui.");
      } else {
        await dudiApi.createCompany(payload);
        toast.success("Industri mitra baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchCompanies();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data perusahaan.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const handleToggleActive = useCallback(async (company: DudiItem) => {
    try {
      await dudiApi.toggleCompanyActive(company.id);
      setCompanies((prev) =>
        prev.map((item) =>
          item.id === company.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(`Status mitra ${company.name} berhasil diubah.`);
    } catch {
      toast.error("Gagal mengubah status aktif mitra.");
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteCompany) return;
    setDeleting(true);
    try {
      await dudiApi.deleteCompany(deleteCompany.id);
      toast.success(`Perusahaan ${deleteCompany.name} berhasil dihapus.`);
      setDeleteCompany(null);
      fetchCompanies();
    } catch {
      toast.error("Gagal menghapus mitra perusahaan.");
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = useMemo(
    () => companies.filter((c) => c.isActive).length,
    [companies]
  );
  const inactiveCount = useMemo(
    () => companies.filter((c) => !c.isActive).length,
    [companies]
  );

  const columns = useMemo(
    () =>
      buildDudiColumns({
        onToggleActive: handleToggleActive,
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteCompany(item),
      }),
    [handleToggleActive, handleOpenEdit]
  );


  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Industri Mitra"
        description="Kelola direktori mitra industri (DUDI), MoU kerjasama, kuota magang, dan kontak HRD."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Store className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Industri Mitra
        </PageHeader.Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Mitra Terdaftar"
          value={companies.length}
          icon={Building2}
          color="blue"
        />
        <StatCard
          label="Mitra Aktif Kerjasama"
          value={activeCount}
          icon={CheckCircle2}
          color="teal"
        />
        <StatCard
          label="Non-Aktif / Kadaluarsa"
          value={inactiveCount}
          icon={XCircle}
          color="amber"
        />
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari perusahaan, kontak, industri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 bg-slate-50 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-full md:w-48 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Bidang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Bidang</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind.id} value={String(ind.id)} className="text-xs">
                  {ind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-36 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
              <SelectItem value="active" className="text-xs">Aktif</SelectItem>
              <SelectItem value="inactive" className="text-xs">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={companies}
        loading={loading}
        emptyMessage="Tidak ada mitra industri yang ditemukan"
        emptyDescription="Coba sesuaikan kata kunci pencarian atau filter industri"
        emptyIcon={<Building2 className="h-8 w-8 text-slate-400" />}
        getRowId={(company) => String(company.id)}
      />

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={editingCompany ? <Pencil className="h-5 w-5" /> : <Store className="h-5 w-5" />}
        title={editingCompany ? "Edit Industri Mitra" : "Tambah Industri Mitra"}
        description={
          editingCompany
            ? "Perbarui informasi legalitas, narahubung PIC, dan status keaktifan perusahaan."
            : "Lengkapi identitas perusahaan mitra untuk terhubung dalam portal karir BKI."
        }
        confirmText={editingCompany ? "Perbarui Mitra" : "Simpan Mitra"}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm}>
          <DudiForm form={form} industries={industries} />
        </form>
      </Modal>

      <AlertDialog open={!!deleteCompany} onOpenChange={(open) => !open && setDeleteCompany(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Mitra Perusahaan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data mitra <strong className="text-slate-900 font-semibold">{deleteCompany?.name}</strong>? Data riwayat lowongan terkait tidak akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 border-none bg-transparent p-0 flex-row justify-end gap-2.5">
            <AlertDialogCancel className="h-10 rounded-xl px-5 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 cursor-pointer shadow-sm"
            >
              {deleting ? "Menghapus..." : "Ya, Hapus Mitra"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const PerusahaanDudiPage = DudiPage;
export const MitraDUDIPage = DudiPage;
