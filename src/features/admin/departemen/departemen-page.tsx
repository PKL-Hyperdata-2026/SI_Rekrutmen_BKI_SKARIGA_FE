import {
  PageHeader,
  StatCard,
  DataTable,
  Box,
  Paragraph,
} from "@/components/custom";
import {
  Building2,
  Search,
  Plus,
  Layers,
  CheckCircle2,
  GraduationCap,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilterSelect } from "@/components/custom/filter-select";
import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { DepartmentForm } from "./departemen-form";
import { DepartmentCard, DepartmentCardSkeleton } from "./departemen-mobile-card";
import {
  useDepartemen,
  statusFilterOptions,
  getDepartmentRowId,
} from "./departemen.page";

export function DepartemenPage() {
  const {
    departments,
    loading,
    search,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
    isFormOpen,
    setIsFormOpen,
    submitting,
    form,
    handleOpenCreate,
    handleOpenEdit,
    handleSubmitForm,
    handleToggleActive,
    handleDelete,
    totalCount,
    activeCount,
    totalMajorsCount,
    columns,
    isEditing,
    modalTitle,
    modalDescription,
    modalConfirmText,
  } = useDepartemen();

  return (
    <Box className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      <PageHeader
        variant="admin"
        title="Data Departemen"
        description="Kelola struktur departemen induk dan bidang keahlian vokasi sekolah."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
          className="w-full sm:w-auto justify-center"
        >
          Tambah Departemen
        </PageHeader.Button>
      </PageHeader>

      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
        <StatCard
          icon={Layers}
          color="purple"
          label="Total Departemen"
          value={totalCount}
          className="rounded-xl"
        />
        <StatCard
          icon={CheckCircle2}
          color="teal"
          label="Departemen Aktif"
          value={activeCount}
          className="rounded-xl"
        />
        <StatCard
          icon={GraduationCap}
          color="sky"
          label="Total Jurusan"
          value={totalMajorsCount}
          className="rounded-xl"
        />
      </Box>

      <Card
        size="sm"
        className="theme-admin rounded-xl border border-slate-100! bg-white py-2! sm:py-2.5! px-3! sm:px-3.5! shadow-xs ring-0! w-full min-w-0 max-w-full"
      >
        <CardContent className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-center p-0! px-0! py-0! w-full min-w-0">
          <Box className="relative w-full md:w-80 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari kode, nama departemen..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9.5 pr-4 bg-slate-50/70 border-slate-200 rounded-lg h-10 text-xs text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all shadow-2xs w-full"
            />
          </Box>

          <Box className="flex w-full md:w-auto items-center gap-3 min-w-0">
            <Badge
              variant="outline"
              className="relative flex items-center h-10 w-full md:w-44 rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
            >
              <CheckCircle2 className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <FilterSelect
                role="admin"
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusFilterOptions}
                className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
              />
            </Badge>
          </Box>
        </CardContent>
      </Card>

      <Box className="flex flex-col gap-3 md:hidden w-full min-w-0">
        {loading ? (
          <>
            <DepartmentCardSkeleton />
            <DepartmentCardSkeleton />
            <DepartmentCardSkeleton />
          </>
        ) : departments.length === 0 ? (
          <Card className="p-8 text-center bg-white border border-slate-200/90 rounded-xl shadow-xs ring-0">
            <CardContent className="p-0 flex flex-col items-center">
              <Box className="mb-2.5 flex justify-center">
                <Building2 className="h-8 w-8 text-slate-400" />
              </Box>
              <Paragraph className="text-sm font-semibold text-slate-700">
                Tidak ada departemen yang ditemukan
              </Paragraph>
              <Paragraph className="text-xs text-slate-400 mt-0.5">
                Silakan tambahkan departemen baru atau sesuaikan kata kunci pencarian
              </Paragraph>
            </CardContent>
          </Card>
        ) : (
          departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              item={dept}
              onToggleActive={handleToggleActive}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>

      <Box className="hidden md:block w-full min-w-0">
        <DataTable
          columns={columns}
          data={departments}
          loading={loading}
          emptyMessage="Tidak ada departemen yang ditemukan"
          emptyDescription="Silakan tambahkan departemen baru atau sesuaikan kata kunci pencarian"
          emptyIcon={<Building2 className="h-8 w-8 text-slate-400" />}
          getRowId={getDepartmentRowId}
          className="rounded-xl"
        />
      </Box>

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        className="rounded-xl"
        headerIcon={
          isEditing ? (
            <Pencil className="h-5 w-5" />
          ) : (
            <Building2 className="h-5 w-5" />
          )
        }
        title={modalTitle}
        description={modalDescription}
        confirmText={modalConfirmText}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <Form onSubmit={handleSubmitForm} className="space-y-0">
          <DepartmentForm form={form} />
        </Form>
      </Modal>
    </Box>
  );
}
