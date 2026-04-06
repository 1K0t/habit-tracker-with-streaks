import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

/**
 * Creates a Socket.IO client connected to the notifications namespace
 * with JWT authentication.
 */
export function createSocket(token: string): Socket {
  return io(WS_URL!, {
    auth: { token },
  });
}
