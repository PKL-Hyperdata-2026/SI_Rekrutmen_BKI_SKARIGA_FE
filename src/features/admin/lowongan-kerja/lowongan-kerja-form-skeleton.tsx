import { CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

export function LowonganKerjaFormSkeleton() {
  return (
    <CardContent className="space-y-5 sm:space-y-6 min-w-0 max-w-full p-0">
      <CardContent className="bg-white rounded-xl border border-slate-200 shadow-xs px-5 sm:px-6 py-5 sm:py-6 min-w-0 max-w-full space-y-2.5">
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-36 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Field>
          <Field className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-14 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Field>
          <Field className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-32 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-16 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Field>
          <Field className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-14 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Field>
        </FieldGroup>
      </CardContent>

      <CardContent className="bg-white rounded-xl border border-slate-200 shadow-xs px-5 sm:px-6 py-5 sm:py-6 min-w-0 max-w-full space-y-2.5">
        <Field className="flex flex-col gap-1">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </Field>

        <Field className="flex flex-col gap-1">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </Field>

        <Field className="flex flex-col gap-1">
          <Skeleton className="h-3.5 w-40 rounded" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </Field>

        <CardContent className="flex items-center gap-2.5 pt-0.5 p-0">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-3.5 w-64 sm:w-72 rounded" />
        </CardContent>
      </CardContent>
    </CardContent>
  );
}
