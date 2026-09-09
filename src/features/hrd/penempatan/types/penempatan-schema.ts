import z from "zod";

export const penempatanStudentUserSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  fullName: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});
export type PenempatanStudentUser = z.infer<typeof penempatanStudentUserSchema>;
export const jobPlacementStudentUserSchema = penempatanStudentUserSchema;
export type JobPlacementStudentUser = PenempatanStudentUser;

export const penempatanStudentAlumniSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nis: z.string().nullable().optional(),
  user: penempatanStudentUserSchema.nullable().optional(),
  major: z.string().nullable().optional(),
  graduationYear: z.union([z.string(), z.number()]).nullable().optional(),
  currentPosition: z.string().nullable().optional(),
});
export type PenempatanStudentAlumni = z.infer<
  typeof penempatanStudentAlumniSchema
>;
export const jobPlacementStudentAlumniSchema = penempatanStudentAlumniSchema;
export type JobPlacementStudentAlumni = PenempatanStudentAlumni;

export const penempatanCompanySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  address: z.string().nullable().optional(),
});
export type PenempatanCompany = z.infer<typeof penempatanCompanySchema>;
export const jobPlacementCompanySchema = penempatanCompanySchema;
export type JobPlacementCompany = PenempatanCompany;

export const penempatanStatusSchema = z.object({
  id: z.union([z.string(), z.number()]),
  code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type PenempatanStatus = z.infer<typeof penempatanStatusSchema>;
export const jobPlacementStatusSchema = penempatanStatusSchema;
export type JobPlacementStatus = PenempatanStatus;

export const penempatanVacancySchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
});
export type PenempatanVacancy = z.infer<typeof penempatanVacancySchema>;
export const jobPlacementVacancySchema = penempatanVacancySchema;
export type JobPlacementVacancy = PenempatanVacancy;

export const penempatanApplicationSchema = z.object({
  id: z.union([z.string(), z.number()]),
  jobVacancyId: z.union([z.string(), z.number()]).nullable().optional(),
  jobVacancy: penempatanVacancySchema.nullable().optional(),
});
export type PenempatanApplication = z.infer<typeof penempatanApplicationSchema>;
export const jobPlacementApplicationSchema = penempatanApplicationSchema;
export type JobPlacementApplication = PenempatanApplication;

export const penempatanEvaluationItemSchema = z.object({
  status: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type PenempatanEvaluationItem = z.infer<
  typeof penempatanEvaluationItemSchema
>;
export const jobPlacementEvaluationItemSchema = penempatanEvaluationItemSchema;
export type JobPlacementEvaluationItem = PenempatanEvaluationItem;

export const penempatanDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  jobApplicationId: z.union([z.string(), z.number()]).nullable().optional(),
  jobApplication: penempatanApplicationSchema.nullable().optional(),
  studentAlumniId: z.union([z.string(), z.number()]).nullable().optional(),
  studentAlumni: penempatanStudentAlumniSchema.nullable().optional(),
  companyId: z.union([z.string(), z.number()]).nullable().optional(),
  company: penempatanCompanySchema.nullable().optional(),
  placementStatusId: z.union([z.string(), z.number()]).nullable().optional(),
  placementStatus: penempatanStatusSchema.nullable().optional(),
  position: z.string().default("-"),
  acceptedDate: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  status3Months: z.string().optional(),
  status6Months: z.string().optional(),
  status12Months: z.string().optional(),
  notes3Months: z.string().nullable().optional(),
  notes6Months: z.string().nullable().optional(),
  notes12Months: z.string().nullable().optional(),
  evaluations: z
    .record(z.string(), penempatanEvaluationItemSchema)
    .nullable()
    .optional(),
  notes: z.string().nullable().optional(),
  alumniName: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.union([z.string(), z.number()]).optional(),
  companyName: z.string().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type PenempatanDataSchema = z.infer<typeof penempatanDataSchema>;

export const penempatanDataTableSchema = penempatanDataSchema;
export type PenempatanDataTableSchema = z.infer<
  typeof penempatanDataTableSchema
>;

export const jobPlacementItemSchema = penempatanDataSchema;
export type JobPlacementItem = PenempatanDataSchema;
export type JobPlacement = PenempatanDataSchema;

export const penempatanFormSchema = z
  .object({
    studentAlumniId: z
      .string()
      .min(1, { message: "Nama pelamar kerja wajib dipilih." }),
    companyId: z.string().optional().nullable(),
    position: z
      .string()
      .trim()
      .min(1, { message: "Posisi / jabatan wajib diisi." })
      .max(255, { message: "Posisi / jabatan maksimal 255 karakter." }),
    acceptedDate: z
      .string()
      .min(1, { message: "Tanggal diterima wajib diisi." })
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Format tanggal diterima tidak valid.",
      }),
    startDate: z
      .string()
      .min(1, { message: "Tanggal masuk kerja wajib diisi." })
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Format tanggal masuk kerja tidak valid.",
      }),
    jobApplicationId: z.string().optional().nullable(),
    placementStatusId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.acceptedDate || !data.startDate) return true;
      const accepted = new Date(data.acceptedDate).getTime();
      const start = new Date(data.startDate).getTime();
      if (Number.isNaN(accepted) || Number.isNaN(start)) return true;
      return start >= accepted;
    },
    {
      message:
        "Tanggal masuk kerja tidak boleh lebih awal dari tanggal diterima.",
      path: ["startDate"],
    },
  );

export type PenempatanFormSchema = z.infer<typeof penempatanFormSchema>;

export const jobPlacementFormSchema = penempatanFormSchema;
export type JobPlacementFormValues = PenempatanFormSchema;

export const penempatanCompanyOptionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
});
export type PenempatanCompanyOption = z.infer<
  typeof penempatanCompanyOptionSchema
>;

export const penempatanStudentOptionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nis: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  majorName: z.string().nullable().optional(),
});
export type PenempatanStudentOption = z.infer<
  typeof penempatanStudentOptionSchema
>;

export const penempatanFormOptionsSchema = z.object({
  companies: z.array(penempatanCompanyOptionSchema),
  students_alumni: z.array(penempatanStudentOptionSchema),
  placement_statuses: z.array(penempatanStatusSchema).optional(),
});
export type PenempatanFormOptions = z.infer<typeof penempatanFormOptionsSchema>;
export type PenempatanFormOptionsData = PenempatanFormOptions;

export const penempatanFilterSchema = z.object({
  search: z.string().optional(),
  companyId: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  placementStatusId: z.string().optional(),
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
});
export type PenempatanFilterValues = z.infer<typeof penempatanFilterSchema>;

export type EvaluationPeriod = "all" | "3" | "6" | "12";

export const metricItemSchema = z.object({
  count: z.number(),
  label: z.string(),
  title: z.string(),
  category: z.string(),
});
export type MetricItem = z.infer<typeof metricItemSchema>;

export const penempatanMetricsDataSchema = z.object({
  total: metricItemSchema,
  evaluation3Months: metricItemSchema,
  evaluation6Months: metricItemSchema,
  evaluation12Months: metricItemSchema,
});
export type PenempatanMetricsData = z.infer<typeof penempatanMetricsDataSchema>;

export const penempatanUpdateStatusFormSchema = z.object({
  period: z
    .string()
    .min(1, { message: "Periode evaluasi monitoring wajib dipilih." })
    .refine((val) => ["3", "6", "12"].includes(val), {
      message: "Periode evaluasi monitoring harus 3, 6, atau 12 bulan.",
    }),
  workStatus: z
    .string()
    .min(1, { message: "Status bekerja wajib dipilih." }),
  notes: z
    .string()
    .max(1000, { message: "Catatan monitoring maksimal 1000 karakter." })
    .optional()
    .nullable(),
});

export type PenempatanUpdateStatusFormSchema = z.infer<
  typeof penempatanUpdateStatusFormSchema
>;
export const jobPlacementUpdateStatusFormSchema =
  penempatanUpdateStatusFormSchema;
export type JobPlacementUpdateStatusFormValues =
  PenempatanUpdateStatusFormSchema;
