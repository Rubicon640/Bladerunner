import { Status, Priority } from './index';
import { Client } from './client';
import { Expense } from './expense';

export interface Job {
  id: string;
  title: string;
  description: string;
  clientId: string;
  client?: Client;
  status: Status;
  priority: Priority;
  scheduledDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  hourlyRate: number;
  expenses: Expense[];
  totalAmount: number;
  notes?: string;
  photos?: string[];
  quoteId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobData {
  title: string;
  description: string;
  clientId: string;
  status: Status;
  priority: Priority;
  scheduledDate?: Date;
  estimatedHours?: number;
  hourlyRate: number;
  notes?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  actualHours?: number;
  completedDate?: Date;
}
