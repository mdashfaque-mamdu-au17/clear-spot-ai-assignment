import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHookReturn<T> {
  isConnected: boolean;
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  lastMessage: T | null;
  sendMessage: (message: any) => void;
}

export function useWebSocket<T>(url: string): WebSocketHookReturn<T> {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isComponentMounted = useRef(true);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting');
    
    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected');
        if (isComponentMounted.current) {
          setStatus('connected');
          reconnectAttemptsRef.current = 0;
        }
      };

      ws.onmessage = (event) => {
        try {
          // Check if the message is a string and looks like JSON before parsing
          if (typeof event.data === 'string' && event.data.startsWith('{')) {
            const data = JSON.parse(event.data);
            if (isComponentMounted.current) {
              setLastMessage(data);
            }
          } else {
            console.log('Received non-JSON WebSocket message:', event.data);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket Disconnected', event.reason);
        if (isComponentMounted.current) {
          setStatus('disconnected');
          // Reconnect logic: Don't reconnect if it was a clean close unless intended
          if (!event.wasClean) {
            const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
            setTimeout(() => {
              if (isComponentMounted.current && navigator.onLine) {
                reconnectAttemptsRef.current += 1;
                connect();
              }
            }, timeout);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setStatus('disconnected');
    }
  }, [url]);

  useEffect(() => {
    isComponentMounted.current = true;
    connect();

    const handleOnline = () => {
      console.log('Browser online, attempting reconnect...');
      reconnectAttemptsRef.current = 0;
      connect();
    };

    const handleOffline = () => {
      console.log('Browser offline, reflecting state');
      setStatus('disconnected');
      if (socketRef.current) {
        socketRef.current.close();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isComponentMounted.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. Message not sent.');
    }
  }, []);

  return {
    isConnected: status === 'connected',
    status,
    lastMessage,
    sendMessage,
  };
}
