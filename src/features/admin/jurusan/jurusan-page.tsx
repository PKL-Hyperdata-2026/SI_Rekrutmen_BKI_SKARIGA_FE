import {
  PageHeader,
  StatCard,
  DataTable,
  DataTablePagination,
  FilterSelect,
  Box,
  Paragraph,
} from "@/components/custom";
import {
  GraduationCap,
  Search,
  Plus,
  Building2,
  CheckCircle2,
  SlidersHorizontal,
  ToggleRight,
  ToggleLeft,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Modal } from "@/components/custom/modal";
import { MajorForm } from "./jurusan-form";
import { MajorCard, MajorCardSkeleton } from "./jurusan-mobile-card";
import { useJurusan, getMajorRowId } from "./jurusan.page";

export function JurusanPage() {
  const {
    majors,
    loading,
    search,
    handleSearchChange,
    deptFilter,
    setDeptFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    departmentOptions,
    loadingOptions,
    isFormOpen,
    setIsFormOpen,
    isEditing,
    modalTitle,
    modalDescription,
    modalConfirmText,
    departmentFallbackLabel,
    submitting,
    form,
    handleOpenCreate,
    handleSubmitForm,
    handleToggleActive,
    handleOpenEdit,
    handleDelete,
    totalCount,
    activeCount,
    totalDeptCount,
    deptFilterOptions,
    statusFilterOptions,
    columns,
  } = useJurusan();

  return (
    <Box className="space-y-6 theme-admin w-full min-w-0">
      <PageHeader
        variant="admin"
        title="Data Jurusan"
        description="Kelola program keahlian dan konsentrasi vokasi berdasarkan departemen induk."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Jurusan
        </PageHeader.Button>
      </PageHeader>

      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={GraduationCap}
          color="sky"
          label="Total Jurusan"
          value={totalCount}
          isLoading={loading}
        />
        <StatCard
          icon={CheckCircle2}
          color="teal"
          label="Jurusan Aktif"
          value={activeCount}
          isLoading={loading}
        />
        <StatCard
          icon={Building2}
          color="purple"
          label="Departemen Terkait"
          value={totalDeptCount}
          isLoading={loading}
        />
      </Box>

      <Card
        size="sm"
        className="theme-admin rounded-lg border border-slate-100! bg-white py-2! sm:py-2.5! px-3! sm:px-3.5! shadow-xs ring-0! w-full min-w-0 max-w-full"
      >
        <CardContent className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-center p-0! px-0! py-0! w-full min-w-0">
          <Box className="relative w-full md:w-80 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari jurusan atau kode..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9.5 pr-4 bg-slate-50/70 border-slate-200 rounded-lg h-10 text-xs text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all shadow-2xs w-full"
            />
          </Box>

          <Box className="flex flex-wrap w-full md:w-auto items-center gap-2 sm:gap-3 min-w-0">
            <Badge
              variant="outline"
              className="relative flex items-center h-10 w-full sm:w-auto rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
            >
              <Building2 className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <FilterSelect
                role="admin"
                value={deptFilter}
                onValueChange={setDeptFilter}
                options={deptFilterOptions}
                placeholder="Semua Departemen"
                className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
              />
            </Badge>

            <Badge
              variant="outline"
              className="relative flex items-center h-10 w-full sm:w-44 rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
            >
              {statusFilter === "active" ? (
                <ToggleRight className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              ) : statusFilter === "inactive" ? (
                <ToggleLeft className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              ) : (
                <SlidersHorizontal className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              )}
              <FilterSelect
                role="admin"
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusFilterOptions}
                placeholder="Semua Status"
                className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
              />
            </Badge>
          </Box>
        </CardContent>
      </Card>

      <Box className="flex flex-col gap-3 md:hidden w-full min-w-0">
        {loading ? (
          <>
            <MajorCardSkeleton />
            <MajorCardSkeleton />
            <MajorCardSkeleton />
          </>
        ) : majors.length === 0 ? (
          <Card className="p-8 text-center bg-white border border-slate-200/90 rounded-xl shadow-xs ring-0">
            <CardContent className="p-0 flex flex-col items-center">
              <Box className="mb-2.5 flex justify-center">
                <GraduationCap className="h-8 w-8 text-slate-400" />
              </Box>
              <Paragraph className="text-sm font-semibold text-slate-700">
                Tidak ada jurusan yang ditemukan
              </Paragraph>
              <Paragraph className="text-xs text-slate-400 mt-0.5">
                Silakan tambahkan jurusan baru atau sesuaikan kata kunci
                pencarian
              </Paragraph>
            </CardContent>
          </Card>
        ) : (
          majors.map((major) => (
            <MajorCard
              key={major.id}
              item={major}
              onToggleActive={handleToggleActive}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>

      <Box className="hidden md:block w-full min-w-0">
        <DataTable
          role="admin"
          columns={columns}
          data={majors}
          loading={loading}
          emptyMessage="Tidak ada jurusan yang ditemukan"
          emptyDescription="Silakan tambahkan jurusan baru atau sesuaikan kata kunci pencarian"
          emptyIcon={<GraduationCap className="h-8 w-8 text-slate-400" />}
          getRowId={getMajorRowId}
          numberStartIndex={(currentPage - 1) * pageSize + 1}
          className="rounded-lg"
        />
      </Box>

      <Card className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden p-0 gap-0 ring-0 w-full max-w-full min-w-0">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          role="admin"
          className="border-none"
        />
      </Card>

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        className="rounded-lg"
        headerIcon={
          isEditing ? (
            <Pencil className="h-5 w-5" />
          ) : (
            <GraduationCap className="h-5 w-5" />
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
          <MajorForm
            form={form}
            departmentOptions={departmentOptions}
            departmentFallbackLabel={departmentFallbackLabel}
            isLoading={loadingOptions && departmentOptions.length === 0}
          />
        </Form>
      </Modal>
    </Box>
  );
}
