export interface LogEntry {
  date: string;
  checkIn: string;
  checkOut: string | null;
  duration: number;
}

export interface WorkSession {
  _id?: string;
  user: string;
  type?: 'monthly' | 'custom';
  daysPerWeek?: number;
  hoursPerDay?: number;
  startDate?: string;
  endDate?: string | null;
  logs?: LogEntry[];
  createdAt?: string;
  updatedAt?: string;
}
