export * from './job';
export * from './client';
export * from './expense';
export * from './quote';

export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
