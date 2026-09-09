import { PageHeader } from "@/components/custom";
import { CardContent } from "@/components/ui/card";
import { FilePlus } from "lucide-react";
import { PenempatanMetricCards } from "../components/penempatan-metric-cards";
import { PenempatanTable } from "../components/penempatan-table";
import { PenempatanForm } from "../components/penempatan-form";
import { PenempatanUpdateStatusForm } from "../components/penempatan-update-status-form";
import { usePenempatanPage } from "../hooks/usePenempatanPage";

export function PenempatanPage() {
  const {
    headerConfig,
    handleOpenCreate,
    metricCardsProps,
    tableProps,
    formProps,
    updateStatusFormProps,
  } = usePenempatanPage();

  return (
    <CardContent className="w-full max-w-full min-w-0 flex flex-col gap-4 sm:gap-6 overflow-x-hidden p-0">
      <PageHeader
        variant="hrd"
        title={headerConfig.title}
        description={headerConfig.description}
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.Button
          variant="primary"
          icon={<FilePlus className="h-4 w-4" />}
          onClick={handleOpenCreate}
          className="w-full sm:w-auto justify-center"
        >
          {headerConfig.buttonText}
        </PageHeader.Button>
      </PageHeader>

      <PenempatanMetricCards {...metricCardsProps} />
      <PenempatanTable {...tableProps} />
      <PenempatanForm {...formProps} />
      <PenempatanUpdateStatusForm {...updateStatusFormProps} />
    </CardContent>
  );
}

export const PenempatanKerjaPage = PenempatanPage;
