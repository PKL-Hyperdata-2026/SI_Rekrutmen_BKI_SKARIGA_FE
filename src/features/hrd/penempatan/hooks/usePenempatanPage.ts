import { useState, useCallback, useMemo } from "react";
import { type JobPlacement } from "../types/penempatan-schema";

export function usePenempatanPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] =
    useState<JobPlacement | null>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [statusPlacement, setStatusPlacement] = useState<JobPlacement | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenCreate = useCallback(() => {
    setSelectedPlacement(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((placement: JobPlacement) => {
    setSelectedPlacement(placement);
    setIsFormOpen(true);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedPlacement(null);
    }
  }, []);

  const handleOpenUpdateStatus = useCallback((placement: JobPlacement) => {
    setStatusPlacement(placement);
    setIsUpdateStatusOpen(true);
  }, []);

  const handleUpdateStatusOpenChange = useCallback((open: boolean) => {
    setIsUpdateStatusOpen(open);
    if (!open) {
      setStatusPlacement(null);
    }
  }, []);

  const handleSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const headerConfig = useMemo(
    () => ({
      title: "Monitoring Penempatan Kerja Alumni",
      description:
        "Temukan peluang karir terbaik dari industri mitra resmi SKARIGA.",
      buttonText: "Input Data Penempatan",
    }),
    [],
  );

  const metricCardsProps = useMemo(
    () => ({
      key: `metrics-${refreshKey}`,
      refreshKey,
    }),
    [refreshKey],
  );

  const tableProps = useMemo(
    () => ({
      key: `table-${refreshKey}`,
      refreshKey,
      onUpdateStatus: handleOpenUpdateStatus,
    }),
    [refreshKey, handleOpenUpdateStatus],
  );

  const formProps = useMemo(
    () => ({
      open: isFormOpen,
      onOpenChange: handleFormOpenChange,
      placement: selectedPlacement,
      onSuccess: handleSuccess,
    }),
    [isFormOpen, handleFormOpenChange, selectedPlacement, handleSuccess],
  );

  const updateStatusFormProps = useMemo(
    () => ({
      open: isUpdateStatusOpen,
      onOpenChange: handleUpdateStatusOpenChange,
      placement: statusPlacement,
      onSuccess: handleSuccess,
    }),
    [
      isUpdateStatusOpen,
      handleUpdateStatusOpenChange,
      statusPlacement,
      handleSuccess,
    ],
  );

  return {
    isFormOpen,
    setIsFormOpen,
    selectedPlacement,
    setSelectedPlacement,
    isUpdateStatusOpen,
    setIsUpdateStatusOpen,
    statusPlacement,
    setStatusPlacement,
    refreshKey,
    headerConfig,
    metricCardsProps,
    tableProps,
    formProps,
    updateStatusFormProps,
    handleOpenCreate,
    handleEdit,
    handleFormOpenChange,
    handleOpenUpdateStatus,
    handleUpdateStatusOpenChange,
    handleSuccess,
  };
}

export const usePenempatan = usePenempatanPage;
