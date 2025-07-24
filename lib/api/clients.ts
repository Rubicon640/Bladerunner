import { Client, CreateClientData } from '@/types';
import { clients as dummyClients } from '@/lib/data/dummy-data';

export class ClientsAPI {
  private static clients: Client[] = [...dummyClients];

  static async getAll(): Promise<Client[]> {
    await this.delay(100);
    return [...this.clients];
  }

  static async getById(id: string): Promise<Client | null> {
    await this.delay(100);
    return this.clients.find(client => client.id === id) || null;
  }

  static async create(data: CreateClientData): Promise<Client> {
    await this.delay(200);
    const newClient: Client = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.push(newClient);
    return newClient;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}