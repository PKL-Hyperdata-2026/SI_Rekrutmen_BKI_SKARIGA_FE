import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard</h3>
        <p className="text-slate-500">Selamat datang di portal siswa & alumni.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Statistik {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 mt-1 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pr-6">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card className="col-span-3 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Pemberitahuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-4 space-y-2 w-full">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
