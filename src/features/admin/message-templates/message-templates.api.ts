import { api } from "@/api/axios";
import { unwrap, type ApiResponse } from "@/api/unwrap";

export interface MessageTemplateItem {
  id: number;
  code: string;
  name: string;
  channel: string;
  subject: string;
  body: string;
  variables: string[] | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateMessageTemplatePayload {
  subject: string;
  body: string;
  is_active?: boolean;
}

export const messageTemplateApi = {
  getTemplates: async (): Promise<MessageTemplateItem[]> => {
    const res = await api.get<ApiResponse<MessageTemplateItem[]>>(
      "/admin/message-templates",
    );
    return unwrap(res);
  },

  getTemplate: async (id: number): Promise<MessageTemplateItem> => {
    const res = await api.get<ApiResponse<MessageTemplateItem>>(
      `/admin/message-templates/${id}`,
    );
    return unwrap(res);
  },

  updateTemplate: async (
    id: number,
    payload: UpdateMessageTemplatePayload,
  ): Promise<MessageTemplateItem> => {
    const res = await api.put<ApiResponse<MessageTemplateItem>>(
      `/admin/message-templates/${id}`,
      payload,
    );
    return unwrap(res);
  },
};
