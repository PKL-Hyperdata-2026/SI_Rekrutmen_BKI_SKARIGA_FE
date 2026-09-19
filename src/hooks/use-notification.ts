import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { echo } from "../lib/echo";
import { notificationApi } from "@/api/notification.api";
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
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    notificationApi
      .getUnread(controller.signal)
      .then((response) => {
        setNotifications((response.data.data as unknown as NotificationItem[]) || []);
        setUnreadCount(response.data.total_unread ?? (response.data.data?.length ?? 0));
        setError(null);
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return;
        setError("Gagal memuat notifikasi.");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [userId, refreshTrigger]);

  useEffect(() => {
    if (!userId || !echo) return;

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
      echo?.leaveChannel(`private-user.${userId}`);
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
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
      await notificationApi.markAllAsRead();
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
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  };
};
