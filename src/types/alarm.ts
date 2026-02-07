export type AlarmSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlarmStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alarm {
  id: string;
  siteId: string;
  severity: AlarmSeverity;
  message: string;
  status: AlarmStatus;
  timestamp: string;
  acknowledgedAt?: string;
}

export interface WebSocketEvent {
  event: 'alarm.created' | 'alarm.updated' | 'connection.status';
  data: any;
}

export interface ConnectionState {
  isConnected: boolean;
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
}
