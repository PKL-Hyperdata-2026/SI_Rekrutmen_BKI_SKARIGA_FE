import { type FilterSelectOption } from "@/components/custom/filter-select";

export interface Company {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logoPath?: string;
}

export interface StandardTypeItem {
  id: number;
  code: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export interface MajorItem {
  id: number;
  code: string;
  name: string;
}

export interface MajorFilterOption extends FilterSelectOption {
  code?: string;
}

export interface JobVacancy {
  id: number;
  companyId: number;
  company?: Company;
  jobTypeId?: number;
  jobType?: StandardTypeItem;
  statusId?: number;
  status?: StandardTypeItem;
  targetApplicantId?: number;
  targetApplicant?: StandardTypeItem;
  title: string;
  slug: string;
  position: string;
  description?: string;
  qualification?: string;
  quota?: number;
  deadline?: string;
  workLocation?: string;
  majors?: MajorItem[];
  majorIds?: number[];
  minSalary?: number;
  maxSalary?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobVacancyOptionsData {
  companies: Company[];
  majors: MajorItem[];
  vacancyStatuses: StandardTypeItem[];
  targetApplicants: StandardTypeItem[];
  jobTypes: StandardTypeItem[];
}
