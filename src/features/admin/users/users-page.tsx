import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, StatCard, DataTable } from "@/components/custom";
import { useAppSelector } from "@/hooks/useApp";
import {
  UserPlus,
  Search,
  Users,
  Building2,
  UserCheck,
  Lock,
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
import { usersApi } from "./users.api";
import {
  useUsersForm,
  useUsersResetPasswordForm,
  toCreateUserPayload,
} from "./users.form";
import { UserForm, UserResetPasswordForm } from "./users-form";
import { buildUserColumns, renderRoleBadge } from "./users-table";
import type { UserItem } from "./users.schema";

export function UsersPage() {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [resetUser, setResetUser] = useState<UserItem | null>(null);
  const [resetting, setResetting] = useState(false);

  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const userForm = useUsersForm(editingUser);
  const resetForm = useUsersResetPasswordForm();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? "1" : "0";

      const res = await usersApi.getUsers(params);
      const rawUsers: UserItem[] = res.data?.data?.data || [];
      const filtered = rawUsers.filter(
        (u) => u.id !== currentUser?.id && u.role !== "superadmin"
      );
      setUsers(filtered);
    } catch {
      setUsers([]);
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, currentUser?.id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    userForm.reset({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
      company_id: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((user: UserItem) => {
    setEditingUser(user);
    userForm.reset({
      full_name: user.fullName,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: (user.role as "admin" | "hrd" | "siswa" | "alumni") || "admin",
      company_id: user.company?.id ? String(user.company.id) : "",
    });
    setIsFormOpen(true);
  }, [userForm]);

  const handleSubmitForm = userForm.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = toCreateUserPayload(values);

      if (editingUser) {
        await usersApi.updateUser(editingUser.id, payload);
        toast.success("Data pengguna berhasil diperbarui.");
      } else {
        await usersApi.createUser(payload);
        toast.success("Pengguna baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data pengguna.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const handleToggleActive = useCallback(async (user: UserItem) => {
    try {
      await usersApi.toggleUserActive(user.id);
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(`Status akun ${user.fullName} berhasil diubah.`);
    } catch {
      toast.error("Gagal mengubah status aktif pengguna.");
    }
  }, []);

  const handleOpenReset = useCallback((user: UserItem) => {
    setResetUser(user);
    resetForm.reset({ password: "" });
  }, [resetForm]);

  const handleSubmitReset = resetForm.handleSubmit(async (values) => {
    if (!resetUser) return;
    setResetting(true);
    try {
      await usersApi.resetUserPassword(resetUser.id, values);
      toast.success(`Kata sandi untuk ${resetUser.fullName} berhasil diatur ulang.`);
      setResetUser(null);
      resetForm.reset();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengatur ulang kata sandi.";
      toast.error(msg);
    } finally {
      setResetting(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await usersApi.deleteUser(deleteUser.id);
      toast.success(`Pengguna ${deleteUser.fullName} berhasil dihapus.`);
      setDeleteUser(null);
      fetchUsers();
    } catch {
      toast.error("Gagal menghapus pengguna.");
    } finally {
      setDeleting(false);
    }
  };

  const adminCount = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users]
  );
  const hrdCount = useMemo(
    () => users.filter((u) => u.role === "hrd").length,
    [users]
  );
  const siswaCount = useMemo(
    () => users.filter((u) => u.role === "siswa").length,
    [users]
  );

  const columns = useMemo(
    () =>
      buildUserColumns({
        onToggleActive: handleToggleActive,
        onResetPassword: handleOpenReset,
        onEdit: handleOpenEdit,
        onDelete: (user) => setDeleteUser(user),
      }),
    [handleToggleActive, handleOpenReset, handleOpenEdit]
  );


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
              <SelectItem value="admin" className="text-xs">Admin</SelectItem>
              <SelectItem value="hrd" className="text-xs">HRD</SelectItem>
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

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="Tidak ada pengguna yang ditemukan"
        emptyDescription="Coba sesuaikan kata kunci pencarian atau filter peran"
        emptyIcon={<Users className="h-8 w-8 text-slate-400" />}
        getRowId={(user) => String(user.id)}
      />

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
        <form onSubmit={handleSubmitForm}>
          <UserForm
            form={userForm}
            companyFallbackLabel={editingUser?.company?.name}
            isEditing={!!editingUser}
          />
        </form>
      </Modal>

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
        onConfirm={handleSubmitReset}
      >
        <form onSubmit={handleSubmitReset}>
          <UserResetPasswordForm form={resetForm} user={resetUser} />
        </form>
      </Modal>

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
}

export const UsersManagementPage = UsersPage;
