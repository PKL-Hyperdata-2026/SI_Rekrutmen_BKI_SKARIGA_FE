import { type FilterSelectOption } from "@/components/custom/filter-select";

export interface Company {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logoPath?: string;
}

export interface StandardTypeItem {
  id: number | string;
  code: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export interface MajorItem {
  id: number | string;
  code: string;
  name: string;
}

export interface MajorFilterOption extends FilterSelectOption {
  code?: string;
}

export interface JobVacancy {
  id: number | string;
  companyId: number | string;
  company?: Company;
  jobTypeId?: number | string;
  jobType?: StandardTypeItem;
  statusId?: number | string;
  status?: StandardTypeItem;
  targetApplicantId?: number | string;
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
  majorIds?: (number | string)[];
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
