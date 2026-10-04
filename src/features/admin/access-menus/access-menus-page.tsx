import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Save, RefreshCw, AlertCircle } from "lucide-react";
import { PageHeader, SectionCard, Box, Span } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/custom/sonner";
import { accessMenusApi, type MenuItemAccess } from "./access-menus.api";

export function AccessMenusPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [roles, setRoles] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<MenuItemAccess[]>([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  const fetchMatrix = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accessMenusApi.getMatrix();
      setRoles(data.roles || []);
      setMatrix(data.matrix || []);

      const activeMenuIds = (data.matrix || [])
        .filter((m) => m.granted_roles.includes(selectedRole))
        .map((m) => m.id);
      setSelectedMenuIds(activeMenuIds);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat matriks hak akses.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const activeMenuIds = matrix
      .filter((m) => m.granted_roles.includes(role))
      .map((m) => m.id);
    setSelectedMenuIds(activeMenuIds);
  };

  const handleToggleMenu = (menuId: number) => {
    setSelectedMenuIds((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId],
    );
  };

  const handleSelectAll = () => {
    setSelectedMenuIds(matrix.map((m) => m.id));
  };

  const handleClearAll = () => {
    setSelectedMenuIds([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await accessMenusApi.updateRolePermissions(selectedRole, selectedMenuIds);
      toast.success(
        `Hak akses menu untuk role ${selectedRole.toUpperCase()} berhasil disimpan.`,
      );

      setMatrix((prev) =>
        prev.map((m) => {
          const has = selectedMenuIds.includes(m.id);
          const currentRoles = m.granted_roles.filter(
            (r) => r !== selectedRole,
          );
          return {
            ...m,
            granted_roles: has ? [...currentRoles, selectedRole] : currentRoles,
          };
        }),
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan hak akses.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="w-full max-w-full min-w-0 flex flex-col gap-5 sm:gap-6 overflow-x-hidden">
      <PageHeader
        variant="admin"
        badgeIcon={<ShieldCheck className="h-3.5 w-3.5" />}
        title="Pengaturan Hak Akses Menu"
        description="Kelola hak akses menu navigasi aplikasi untuk setiap role pengguna (Role-Menu Permission Matrix)."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.Button
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={loading || saving}
          className="w-full sm:w-auto justify-center"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </PageHeader.Button>
      </PageHeader>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchMatrix}
            className="h-7 text-xs gap-1.5 border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Role Picker */}
      <SectionCard
        title={
          <Span className="text-xs sm:text-sm font-bold text-[#1E293B]">
            Pilih Role Pengguna
          </Span>
        }
        className="rounded-xl border-none bg-card shadow-xs p-3.5 sm:p-4.5"
      >
        <div className="flex flex-wrap items-center gap-2">
          {roles.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={selectedRole === r ? "default" : "outline"}
              onClick={() => handleRoleChange(r)}
              className={
                selectedRole === r
                  ? "bg-slate-900 text-white font-bold cursor-pointer"
                  : "bg-white font-medium cursor-pointer"
              }
            >
              {r.toUpperCase()}
            </Button>
          ))}
        </div>
      </SectionCard>

      {/* Permission Matrix Table */}
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <Span className="text-xs sm:text-sm font-bold text-[#1E293B]">
              Daftar Menu untuk Role:{" "}
              <span className="text-blue-600 uppercase">{selectedRole}</span>
            </Span>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSelectAll}
              disabled={loading}
              className="h-7 text-xs cursor-pointer"
            >
              Pilih Semua
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearAll}
              disabled={loading}
              className="h-7 text-xs cursor-pointer"
            >
              Hapus Semua
            </Button>
          </div>
        }
        className="rounded-xl border-none bg-card shadow-xs p-3.5 sm:p-4.5"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3 w-12 text-center">Akses</th>
                <th className="py-2.5 px-3">Nama Menu</th>
                <th className="py-2.5 px-3">Route Link</th>
                <th className="py-2.5 px-3">Ikon</th>
                <th className="py-2.5 px-3">Section</th>
                <th className="py-2.5 px-3">Role Aktif Lainnya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat matriks hak akses...
                  </td>
                </tr>
              ) : matrix.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data menu.
                  </td>
                </tr>
              ) : (
                matrix.map((item) => {
                  const isChecked = selectedMenuIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleToggleMenu(item.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleMenu(item.id)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-500">
                        {item.link || "-"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {item.icon || "-"}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                          Seksi {item.section}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {item.granted_roles
                            .filter((r) => r !== selectedRole)
                            .map((r) => (
                              <span
                                key={r}
                                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                              >
                                {r}
                              </span>
                            ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Box>
  );
}
