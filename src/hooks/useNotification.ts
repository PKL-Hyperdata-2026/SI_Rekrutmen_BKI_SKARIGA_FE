import { useEffect, useState } from "react";
import { echo } from "../libs/echo";

interface NotificationPayload {
  userId: string;
  message: string;
}

export const useNotification = (userId: string) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const channel = echo.private(`user.${userId}`);

    channel.listen('.notification.sent', (data: NotificationPayload) => {
      setNotifications((prev) => [data.message, ...prev]);
    });

    return () => {
      channel.stopListening('.notification.sent');
      echo.leaveChannel(`private-user.${userId}`);
    };
  }, [userId]);

  return {notifications};
};
