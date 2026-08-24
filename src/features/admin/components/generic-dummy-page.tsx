import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GenericAdminDummyPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h3>
        <p className="text-slate-500">{description}</p>
      </div>
      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Manajemen {title}</CardTitle>
          <CardDescription>Halaman panel administrator untuk mengelola {title.toLowerCase()}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <Skeleton className="h-10 w-[280px] rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[110px] rounded-lg" />
                <Skeleton className="h-10 w-[130px] rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-[320px] w-full rounded-xl" />
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-8 w-[140px] rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-[80px] rounded" />
                <Skeleton className="h-8 w-[80px] rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
