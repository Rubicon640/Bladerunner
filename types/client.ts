export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address: {
    street: string;
    suburb: string;
    postcode: string;
    state: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  address: {
    street: string;
    suburb: string;
    postcode: string;
    state: string;
  };
  notes?: string;
}
