import { Client } from './client';

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  client?: Client;
  title: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  notes?: string;
  convertedToJobId?: string;
  createdAt: Date;
  updatedAt: Date;
}
