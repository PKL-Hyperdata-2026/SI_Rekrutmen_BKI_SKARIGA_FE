import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
import type {
  TracerStudyData,
  SubmitTracerPayload,
} from "./tracer-study.schema";

export const tracerApi = {
  getTracerStudy: async (): Promise<TracerStudyData | null> => {
    const res = await api.get<ApiResponse<TracerStudyData | null>>(
      "/alumni/tracer-study",
    );
    return unwrap(res);
  },

  submitTracerStudy: async (
    payload: SubmitTracerPayload,
  ): Promise<TracerStudyData> => {
    const res = await api.post<ApiResponse<TracerStudyData>>(
      "/alumni/tracer-study",
      payload,
    );
    return unwrap(res);
  },
};
