import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GenericDummyPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h3>
        <p className="text-slate-500">{description}</p>
      </div>
      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Data {title}</CardTitle>
          <CardDescription>Ini adalah halaman contoh (dummy) untuk mengetes animasi perpindahan menu.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-[250px] rounded-lg" />
              <Skeleton className="h-10 w-[120px] rounded-lg" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-8 w-[100px] rounded" />
              <Skeleton className="h-8 w-[200px] rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
