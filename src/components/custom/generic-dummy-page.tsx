import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GenericDummyPageProps {
  title: string;
  description: string;
  variant?: "student" | "admin";
}

export function GenericDummyPage({
  title,
  description,
  variant = "student",
}: GenericDummyPageProps) {
  const isAdmin = variant === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h3>
        <p className="text-slate-500">{description}</p>
      </div>
      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">
            {isAdmin ? `Manajemen ${title}` : `Data ${title}`}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? `Halaman panel administrator untuk mengelola ${title.toLowerCase()}.`
              : "Ini adalah halaman contoh (dummy) untuk mengetes animasi perpindahan menu."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className={`flex mb-6 ${
                isAdmin
                  ? "flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  : "justify-between items-center"
              }`}
            >
              <Skeleton className={`h-10 ${isAdmin ? "w-72" : "w-[250px]"} rounded-lg`} />
              {isAdmin ? (
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-28 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              ) : (
                <Skeleton className="h-10 w-[120px] rounded-lg" />
              )}
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="flex justify-between mt-4">
              <Skeleton className={`h-8 ${isAdmin ? "w-36" : "w-[100px]"} rounded`} />
              {isAdmin ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
              ) : (
                <Skeleton className="h-8 w-[200px] rounded" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}