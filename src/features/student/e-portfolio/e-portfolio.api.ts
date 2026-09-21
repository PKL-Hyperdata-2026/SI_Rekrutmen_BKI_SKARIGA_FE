import { api } from "@/api/axios";
import type {
  StudentProfileData,
  PortfolioFormOptions,
  PortfolioItem,
} from "./e-portfolio.schema";

export interface UpdateProfilePayload {
  phone: string;
  social_media: Array<{
    platform: string;
    username: string;
  }>;
}

export const portfolioApi = {
  getProfile: () =>
    api.get<{ success: boolean; message?: string; data: StudentProfileData }>(
      "/siswa/portfolio/profile"
    ),

  getOptions: () =>
    api.get<{ success: boolean; message?: string; data: PortfolioFormOptions }>(
      "/siswa/portfolio/options"
    ),

  updateProfile: (payload: UpdateProfilePayload) =>
    api.put<{
      success: boolean;
      message?: string;
      data: StudentProfileData;
    }>("/siswa/portfolio/profile", payload),

  uploadDocument: (categoryId: number, file: File) => {
    const formData = new FormData();
    formData.append("category_id", String(categoryId));
    formData.append("file", file);

    return api.post<{
      success: boolean;
      message?: string;
      data: PortfolioItem;
    }>("/siswa/portfolio/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteDocument: (id: number) =>
    api.delete<{ success: boolean; message?: string }>(
      `/siswa/portfolio/${id}`
    ),
};
