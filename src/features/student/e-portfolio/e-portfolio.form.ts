import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentProfileSchema,
  type StudentProfileSchemaType,
  type StudentProfileData,
  type SocialMediaItem,
} from "./e-portfolio.schema";

export function usePortfolioProfileForm(
  initialData?: StudentProfileData | null,
  initialSocialMedia: SocialMediaItem[] = []
) {
  return useForm<StudentProfileSchemaType>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      nis: initialData?.nis || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      majorId: initialData?.majorId || 0,
      classId: initialData?.classId || 0,
      graduationYear: initialData?.graduationYear || new Date().getFullYear(),
      socialMedia: initialSocialMedia,
    },
  });
}
