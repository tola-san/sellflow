import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api from "./Axios";
import {
  notifyNotificationsChanged,
  type BusinessNotification,
} from "../Services/notifications";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

interface NotificationBroadcast {
  notification: BusinessNotification;
}

let echoInstance: Echo<"reverb"> | null = null;

function broadcastAuthEndpoint(): string {
  const apiBase = String(api.defaults.baseURL || "/api/v1").replace(/\/+$/, "");
  return `${apiBase}/broadcasting/auth`;
}

function echo(): Echo<"reverb"> | null {
  const key = import.meta.env.VITE_REVERB_APP_KEY;
  const host = import.meta.env.VITE_REVERB_HOST;

  if (!key || !host) {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const scheme = import.meta.env.VITE_REVERB_SCHEME || "https";
  const secure = scheme === "https";
  const port = Number(import.meta.env.VITE_REVERB_PORT || (secure ? 443 : 8080));
  const token = localStorage.getItem("token");

  window.Pusher = Pusher;
  echoInstance = new Echo({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: secure,
    enabledTransports: ["ws", "wss"],
    authEndpoint: broadcastAuthEndpoint(),
    auth: {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  });

  return echoInstance;
}

export function subscribeToBusinessNotifications(businessId: number): () => void {
  const client = echo();

  if (!client) {
    return () => undefined;
  }

  const channelName = `business.${businessId}`;
  const channel = client
    .private(channelName)
    .listen(".business.notification.created", (event: NotificationBroadcast) => {
      notifyNotificationsChanged(event.notification);
    });

  const connection = (client.connector as unknown as {
    pusher?: {
      connection?: {
        bind: (event: string, handler: () => void) => void;
        unbind: (event: string, handler: () => void) => void;
      };
    };
  }).pusher?.connection;
  const resync = () => notifyNotificationsChanged();
  connection?.bind("connected", resync);

  return () => {
    channel.stopListening(".business.notification.created");
    client.leave(channelName);
    connection?.unbind("connected", resync);
    client.disconnect();
    echoInstance = null;
  };
}
