import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
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
  getProfile: async (): Promise<StudentProfileData> => {
    const res = await api.get<ApiResponse<StudentProfileData>>(
      "/siswa/portfolio/profile",
    );
    return unwrap(res);
  },

  getOptions: async (): Promise<PortfolioFormOptions> => {
    const res = await api.get<ApiResponse<PortfolioFormOptions>>(
      "/siswa/portfolio/options",
    );
    return unwrap(res);
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<StudentProfileData> => {
    const res = await api.put<ApiResponse<StudentProfileData>>(
      "/siswa/portfolio/profile",
      payload,
    );
    return unwrap(res);
  },

  uploadDocument: async (
    categoryId: number,
    file: File,
  ): Promise<PortfolioItem> => {
    const formData = new FormData();
    formData.append("category_id", String(categoryId));
    formData.append("file", file);

    const res = await api.post<ApiResponse<PortfolioItem>>(
      "/siswa/portfolio/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return unwrap(res);
  },

  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/siswa/portfolio/${id}`);
  },
};
