/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { echo } from "../lib/echo";
import { api } from "@/api/axios";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string;
  created_at: string;
}

export const useNotification = (userId: string) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/unread");
        setNotifications(response.data.data);
        setUnreadCount(response.data.unread_count);
      } catch (error) {
        console.error(`Failed to fetch notifications over ws/wss: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const channel = echo.private(`user.${userId}`);

    channel.listen(".notification.sent", (data: { notificationData: NotificationItem }) => {
      setNotifications((prev) => [data.notificationData, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      channel.stopListening(".notification.sent");
      echo.leaveChannel(`private-user.${userId}`);
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(`Failed to mark notification as read: ${error}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(`Failed to mark all notifications as read: ${error}`);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
};
