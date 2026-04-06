'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';
import { createSocket } from '@/lib/ws';
import type { MilestoneNotification } from '@habit/shared';

interface UseWebsocketOptions {
  onNotification?: (notification: MilestoneNotification) => void;
}

interface UseWebsocketReturn {
  notifications: MilestoneNotification[];
  connected: boolean;
  acknowledge: (milestoneId: string) => void;
}

export function useWebsocket(
  options?: UseWebsocketOptions,
): UseWebsocketReturn {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const onNotificationRef = useRef(options?.onNotification);
  useEffect(() => {
    onNotificationRef.current = options?.onNotification;
  }, [options?.onNotification]);
  const [notifications, setNotifications] = useState<MilestoneNotification[]>(
    [],
  );
  const [connected, setConnected] = useState(false);

  const acknowledge = useCallback((milestoneId: string): void => {
    socketRef.current?.emit('ack', { milestoneId });
    setNotifications((prev) => prev.filter((n) => n.habitId !== milestoneId));
  }, []);

  useEffect(() => {
    const token = session?.user?.jwt;
    if (!token) return;

    const socket = createSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('subscribe');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('milestone', (data: MilestoneNotification) => {
      setNotifications((prev) => [...prev, data]);
      onNotificationRef.current?.(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [session?.user?.jwt]);

  return { notifications, connected, acknowledge };
}
