import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';

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
  const { showToast } = useToast();

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting');
    
    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
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
          }
        } catch (e) {
        }
      };

      ws.onclose = () => {
        if (isComponentMounted.current) {
          setStatus('disconnected');
          // Reconnect logic: Always attempt to reconnect if the component is still mounted
          // This handles server idle timeouts or temporary network blips
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          setTimeout(() => {
            if (isComponentMounted.current && navigator.onLine) {
              reconnectAttemptsRef.current += 1;
              connect();
            }
          }, timeout);
        }
      };

      ws.onerror = () => {
        // handled via ws.onclose and status
      };
    } catch (error) {
      setStatus('disconnected');
    }
  }, [url]);

  useEffect(() => {
    isComponentMounted.current = true;
    connect();

    const handleOnline = () => {
      showToast('Connection restored. Reconnecting...', 'success');
      reconnectAttemptsRef.current = 0;
      connect();
    };

    const handleOffline = () => {
      showToast('No internet connection. Monitoring paused.', 'error');
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
    }
  }, []);

  return {
    isConnected: status === 'connected',
    status,
    lastMessage,
    sendMessage,
  };
}
