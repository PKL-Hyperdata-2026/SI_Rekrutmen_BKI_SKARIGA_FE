import { useEffect, useState, useCallback } from "react";
import { echo } from "../lib/echo";
import { api } from "@/api/axios";
import { toast } from "@/components/custom/sonner";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read_at?: string | null;
  created_at: string;
}

export const useNotification = (userId?: string | number | null) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get<{
        success: boolean;
        data: NotificationItem[];
        total_unread?: number;
      }>("/notification/unread");

      setNotifications(response.data.data || []);
      setUnreadCount(response.data.total_unread ?? response.data.data?.length ?? 0);
    } catch (err: unknown) {
      void err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    api
      .get<{
        success: boolean;
        data: NotificationItem[];
        total_unread?: number;
      }>("/notification/unread")
      .then((response) => {
        if (!active) return;
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.total_unread ?? response.data.data?.length ?? 0);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoading(false);
        void err;
      });

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const channel = echo.private(`user.${userId}`);

    channel.listen(".notification.sent", (data: { notificationData: NotificationItem }) => {
      if (data?.notificationData) {
        setNotifications((prev) => [data.notificationData, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(data.notificationData.title, {
          description: data.notificationData.message,
        });
      }
    });

    return () => {
      channel.stopListening(".notification.sent");
      echo.leaveChannel(`private-user.${userId}`);
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      void err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notification/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err: unknown) {
      void err;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
