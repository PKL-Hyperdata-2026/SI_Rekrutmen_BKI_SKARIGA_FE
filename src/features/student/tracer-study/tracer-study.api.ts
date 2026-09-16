import { api } from "@/api/axios";
import type {
  TracerStudyData,
  SubmitTracerPayload,
} from "./tracer-study.schema";

export const tracerApi = {
  getTracerStudy: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: TracerStudyData | null;
    }>("/alumni/tracer-study"),

  submitTracerStudy: (payload: SubmitTracerPayload) =>
    api.post<{
      success: boolean;
      message?: string;
      data: TracerStudyData;
    }>("/alumni/tracer-study", payload),
};
