import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import type { Alarm, AlarmSeverity } from '../types/alarm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AlarmCardProps {
  alarm: Alarm;
  onAcknowledge?: (id: string) => void;
}

const severityConfig: Record<AlarmSeverity, { icon: any; color: string; border: string; bg: string }> = {
  critical: { icon: AlertCircle, color: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' },
  high: { icon: AlertTriangle, color: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50' },
  medium: { icon: Info, color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' },
  low: { icon: Bell, color: 'text-slate-600', border: 'border-slate-200', bg: 'bg-slate-50' },
};

export const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onAcknowledge }) => {
  const config = severityConfig[alarm.severity];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-xl border shadow-sm transition-all animate-in slide-in-from-right duration-300",
      config.bg,
      config.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-white", config.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className={cn("text-xs font-bold uppercase tracking-wider", config.color)}>
              {alarm.severity}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date(alarm.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-tight">
            {alarm.message}
          </p>
          <p className="text-xs text-slate-500">
            Site: {alarm.siteId}
          </p>
          {alarm.acknowledgedAt && (
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-green-600 bg-green-100/50 w-fit px-1.5 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              ACK AT {new Date(alarm.acknowledgedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
        {alarm.status === 'active' && (
          <button 
            onClick={() => onAcknowledge?.(alarm.id)}
            className="p-1 hover:bg-white rounded-md transition-colors"
            title="Acknowledge"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-400 hover:text-green-600" />
          </button>
        )}
      </div>
    </div>
  );
};
