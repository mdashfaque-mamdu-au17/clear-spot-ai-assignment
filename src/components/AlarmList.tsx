import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { AlarmCard } from './AlarmCard';
import type { Alarm, WebSocketEvent } from '../types/alarm';
import { Bell, ShieldAlert, Wifi, WifiOff } from 'lucide-react';

const AlarmList: React.FC = () => {
  // Using a dummy URL as per requirements, will simulate messages internally for demonstration
  const { isConnected, status, lastMessage } = useWebSocket<WebSocketEvent>('wss://echo.websocket.org');
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    if (lastMessage?.event === 'alarm.created') {
      const newAlarm: Alarm = {
        ...lastMessage.data,
        status: 'active',
        timestamp: new Date().toISOString()
      };
      setAlarms(prev => [newAlarm, ...prev].slice(0, 50)); // Keep last 50
    }
  }, [lastMessage]);

  // Simulation effect for demonstration since we don't have a real WS server
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const severities: any[] = ['low', 'medium', 'high', 'critical'];
        const mockAlarm = {
          event: 'alarm.created',
          data: {
            id: `alarm-${Math.random().toString(36).substr(2, 9)}`,
            siteId: `site-${Math.floor(Math.random() * 50) + 1}`,
            severity: severities[Math.floor(Math.random() * severities.length)],
            message: 'Inverter output fluctuation detected above threshold'
          }
        };
        // Programmatically update state as if it came from WS
        const newAlarm: Alarm = {
          ...mockAlarm.data,
          status: 'active',
          timestamp: new Date().toISOString()
        } as Alarm;
        setAlarms(prev => [newAlarm, ...prev].slice(0, 50));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleAcknowledge = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { 
      ...a, 
      status: 'acknowledged' as const,
      acknowledgedAt: new Date().toISOString()
    } : a));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary-600" />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Active Alarms</h2>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Real-time Feed</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm ${
            isConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {status}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
            <Bell className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm font-semibold">Monitoring active...</p>
            <p className="text-[10px] text-slate-400 mt-1">New alarms will appear here</p>
          </div>
        ) : (
          alarms.map(alarm => (
            <AlarmCard 
              key={alarm.id} 
              alarm={alarm} 
              onAcknowledge={handleAcknowledge} 
            />
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 text-center font-medium italic">
          Monitoring Active • Auto-reconnect enabled
        </p>
      </div>
    </div>
  );
};

export default AlarmList;
