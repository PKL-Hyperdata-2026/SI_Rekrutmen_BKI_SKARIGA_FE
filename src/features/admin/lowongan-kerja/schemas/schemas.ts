import { z } from "zod";

export const jobVacancyFormSchema = z.object({
  companyId: z
    .string()
    .min(1, { message: "Nama perusahaan mitra wajib dipilih." }),
  position: z
    .string()
    .trim()
    .min(1, { message: "Posisi pekerjaan wajib diisi." })
    .max(255, { message: "Posisi pekerjaan maksimal 255 karakter." }),
  quota: z
    .string()
    .min(1, { message: "Kuota wajib diisi." })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1;
      },
      { message: "Kuota minimal 1 orang." },
    ),
  deadline: z
    .string()
    .min(1, { message: "Batas pendaftaran wajib diisi." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal pendaftaran tidak valid.",
    }),
  majorId: z.string().min(1, { message: "Jurusan wajib dipilih." }),
  targetId: z.string().min(1, { message: "Target pelamar wajib dipilih." }),
  workLocation: z
    .string()
    .trim()
    .min(1, { message: "Lokasi kerja wajib diisi." })
    .max(255, { message: "Lokasi kerja maksimal 255 karakter." }),
  qualification: z
    .string()
    .trim()
    .min(1, { message: "Kualifikasi / persyaratan wajib diisi." }),
  sendNotification: z.boolean().default(false),
});

export type JobVacancyFormValues = z.infer<typeof jobVacancyFormSchema>;
