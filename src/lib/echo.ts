import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { api } from "@/api/axios";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

export const echo = reverbKey
  ? new Echo({
      broadcaster: "reverb",
      key: reverbKey,
      wsHost: import.meta.env.VITE_REVERB_HOST ?? "localhost",
      wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
      wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
      enabledTransports: ["ws", "wss"],
  authorizer: (channel: { name: string }) => ({
    authorize: (
      socketId: string,
      callback: (
        error: Error | null,
        authData: { auth: string; channel_data?: string } | null
      ) => void
    ) => {
      api
        .post("/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then((response) => {
          callback(null, response.data);
        })
        .catch((error: unknown) => {
          callback(error instanceof Error ? error : new Error(String(error)), null);
        });
    },
  }),
}) : null;
