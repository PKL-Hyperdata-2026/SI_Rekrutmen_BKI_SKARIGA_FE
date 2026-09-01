import { useState, useEffect, useId } from "react";
import { PageHeader, StatCard, DataTable, type DataTableColumn } from "@/components/custom";
import {
  UserPlus,
  Search,
  KeyRound,
  Pencil,
  Trash2,
  Building2,
  ShieldCheck,
  UserCheck,
  Briefcase,
  GraduationCap,
  Users,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { api } from "@/api/axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  company?: {
    id: number;
    name: string;
  } | null;
}

interface CompanyOption {
  id: number;
  name: string;
  user_id: number | null;
}

export const UsersManagementPage = () => {
  const roleSelectId = useId();
  const companySelectId = useId();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    company_id: "",
  });

  const [resetUser, setResetUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOptions = async () => {
    try {
      const res = await api.get("/admin/users/options");
      if (res.data?.data?.companies) {
        setCompanies(res.data.data.companies);
      }
    } catch {
      // ignore
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? "1" : "0";

      const res = await api.get("/admin/users", { params });
      setUsers(res.data?.data?.data || []);
    } catch {
      setUsers([]);
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, roleFilter, statusFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
      company_id: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      full_name: user.fullName,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.role,
      company_id: user.company?.id ? String(user.company.id) : "",
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (formData.role === "hrd") {
        payload.company_id = formData.company_id ? Number(formData.company_id) : null;
      }

      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, payload);
        toast.success("Data pengguna berhasil diperbarui.");
      } else {
        await api.post("/admin/users", payload);
        toast.success("Pengguna baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchUsers();
      fetchOptions();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Terjadi kesalahan saat menyimpan data pengguna.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: UserItem) => {
    try {
      await api.patch(`/admin/users/${user.id}/toggle-active`);
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(`Status akun ${user.fullName} berhasil diubah.`);
    } catch {
      toast.error("Gagal mengubah status aktif pengguna.");
    }
  };

  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resetUser || !newPassword) return;
    setResetting(true);
    try {
      await api.post(`/admin/users/${resetUser.id}/reset-password`, {
        password: newPassword,
      });
      toast.success(`Kata sandi untuk ${resetUser.fullName} berhasil diatur ulang.`);
      setResetUser(null);
      setNewPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal mengatur ulang kata sandi.";
      toast.error(msg);
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteUser.id}`);
      toast.success(`Pengguna ${deleteUser.fullName} berhasil dihapus.`);
      setDeleteUser(null);
      fetchUsers();
      fetchOptions();
    } catch {
      toast.error("Gagal menghapus pengguna.");
    } finally {
      setDeleting(false);
    }
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const hrdCount = users.filter((u) => u.role === "hrd").length;
  const siswaCount = users.filter((u) => u.role === "siswa").length;

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 bg-purple-50 text-purple-700 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            Super Admin
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 bg-blue-50 text-blue-700 shadow-2xs">
            <UserCheck className="h-3.5 w-3.5" />
            Admin BKI
          </span>
        );
      case "hrd":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs">
            <Briefcase className="h-3.5 w-3.5" />
            HRD Mitra
          </span>
        );
      case "siswa":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700 shadow-2xs">
            <Users className="h-3.5 w-3.5" />
            Siswa
          </span>
        );
      case "alumni":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-2xs">
            <GraduationCap className="h-3.5 w-3.5" />
            Alumni
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700">
            {role}
          </span>
        );
    }
  };

  const columns: DataTableColumn<UserItem>[] = [
    {
      header: "PENGGUNA",
      align: "left",
      cell: (user) => (
        <div className="flex items-center gap-3.5">
          <Avatar className="h-10 w-10 rounded-xl border border-white shadow-2xs ring-1 ring-slate-100 shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullName}`}
              alt={user.fullName}
              className="rounded-xl"
            />
            <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
              {user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm leading-snug truncate">
              {user.fullName}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "ROLE",
      align: "left",
      cell: (user) => renderRoleBadge(user.role),
    },
    {
      header: "KONTAK",
      align: "left",
      cell: (user) =>
        user.phone ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{user.phone}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        ),
    },
    {
      header: "INSTANSI / MITRA DUDI",
      align: "left",
      cell: (user) =>
        user.company ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <span className="truncate max-w-[180px]">{user.company.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        ),
    },
    {
      header: "STATUS AKUN",
      align: "center",
      cell: (user) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={user.isActive}
            onCheckedChange={() => handleToggleActive(user)}
          />
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "right",
      cell: (user) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setResetUser(user);
              setNewPassword("");
            }}
            title="Reset Kata Sandi"
            className="h-8 w-8 rounded-lg border border-amber-200/80 bg-amber-50/70 text-amber-600 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(user)}
            title="Edit Pengguna"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteUser(user)}
            title="Hapus Pengguna"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Manajemen Pengguna"
        description="Kelola akun pengguna, hak akses peran, status keaktifan, dan pengaturan kata sandi sistem."
      >
        <PageHeader.Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Pengguna
        </PageHeader.Button>
      </PageHeader>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pengguna Terdaftar"
          value={users.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Administrator BKI"
          value={adminCount}
          icon={UserCheck}
          color="sky"
        />
        <StatCard
          label="HRD Industri Mitra"
          value={hrdCount}
          icon={Building2}
          color="teal"
        />
        <StatCard
          label="Siswa Terdaftar"
          value={siswaCount}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama, email, telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 bg-slate-50 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-40 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Pilih Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Role</SelectItem>
              <SelectItem value="admin" className="text-xs">Admin BKI</SelectItem>
              <SelectItem value="hrd" className="text-xs">HRD Mitra</SelectItem>
              <SelectItem value="siswa" className="text-xs">Siswa</SelectItem>
              <SelectItem value="alumni" className="text-xs">Alumni</SelectItem>
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

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="Tidak ada pengguna yang ditemukan"
        emptyDescription="Coba sesuaikan kata kunci pencarian atau filter peran"
        emptyIcon={<Users className="h-8 w-8 text-slate-400" />}
      />

      {/* Modal Form Tambah / Edit User */}
      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={editingUser ? <Pencil className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
        title={editingUser ? "Edit Akun Pengguna" : "Tambah Pengguna Baru"}
        description={
          editingUser
            ? "Perbarui informasi kredensial, peran, dan relasi institusi akun pengguna."
            : "Lengkapi data pengguna baru untuk memberikan akses masuk ke portal sistem."
        }
        confirmText={editingUser ? "Perbarui Pengguna" : "Simpan Pengguna"}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="cth. Budi Santoso, S.Pd"
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Akun</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@skariga.sch.id"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / Telepon</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="081234567890"
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={roleSelectId} className="text-xs font-bold text-slate-700">Role</label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger id={roleSelectId} className="h-10 rounded-xl">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="text-xs font-medium">Admin BKI (Operasional Sekolah)</SelectItem>
                  <SelectItem value="hrd" className="text-xs font-medium">HRD Perusahaan Mitra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {editingUser ? "Kata Sandi Baru (Kosongkan jika tidak ingin diubah)" : "Kata Sandi Akun"}
            </label>
            <Input
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingUser ? "••••••••" : "Minimal 6 karakter kombinasi"}
              className="h-10 rounded-xl"
            />
          </div>

          {formData.role === "hrd" && (
            <div className="space-y-1.5 pt-1">
              <label htmlFor={companySelectId} className="text-xs font-bold text-slate-700">Pilih Perusahaan DUDI Mitra</label>
              <Select
                value={formData.company_id}
                onValueChange={(val) => setFormData({ ...formData, company_id: val })}
              >
                <SelectTrigger id={companySelectId} className="h-10 rounded-xl">
                  <SelectValue placeholder="Pilih Perusahaan Terdaftar" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} className="text-xs font-medium">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-400">
                Akun HRD ini akan memiliki wewenang untuk mengelola lowongan & seleksi dari perusahaan yang dipilih.
              </p>
            </div>
          )}
        </form>
      </Modal>

      {/* Modal Reset Password */}
      <Modal
        open={!!resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
        variant="admin"
        size="sm"
        headerIcon={<Lock className="h-5 w-5" />}
        title="Atur Ulang Sandi"
        description={
          <div className="flex flex-col gap-1.5 mt-0.5">
            <span className="text-white/90">
              Ubah kata sandi untuk pengguna <strong className="text-white font-bold">{resetUser?.fullName}</strong> ({resetUser?.email}).
            </span>
            {resetUser && (
              <div className="pt-0.5">
                {renderRoleBadge(resetUser.role)}
              </div>
            )}
          </div>
        }
        confirmText="Reset Kata Sandi"
        cancelText="Batal"
        isLoading={resetting}
        onConfirm={handleResetPassword}
      >
        <form onSubmit={handleResetPassword} className="space-y-3 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
            <Input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan minimal 6 karakter"
              className="h-10 rounded-xl"
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pastikan pengguna segera mengganti kata sandi setelah berhasil masuk ke sistem.
          </p>
        </form>
      </Modal>

      {/* Alert Dialog Konfirmasi Hapus */}
      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Akun Pengguna
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus akun <strong className="text-slate-900 font-semibold">{deleteUser?.fullName}</strong> ({deleteUser?.email})? Akses masuk untuk akun ini akan langsung dinonaktifkan.
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
              {deleting ? "Menghapus..." : "Ya, Hapus Akun"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
