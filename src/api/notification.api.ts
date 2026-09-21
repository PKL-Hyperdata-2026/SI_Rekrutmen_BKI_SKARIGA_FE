import { api } from "@/api/axios";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  url?: string;
  read_at?: string | null;
  created_at?: string;
}

export interface UnreadNotificationsResponse {
  data: NotificationItem[];
  total_unread: number;
}

export const notificationApi = {
  getUnread: (signal?: AbortSignal) =>
    api.get<UnreadNotificationsResponse>("/notification/unread", { signal }),
  markAsRead: (id: string) =>
    api.patch(`/notification/${id}/read`),
  markAllAsRead: () =>
    api.patch("/notification/read-all"),
};
