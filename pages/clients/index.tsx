import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Client } from '@/types';
import { ClientsAPI } from '@/lib/api/clients';
import { Button } from '@/components/ui/Button';

const ClientCard: React.FC<{ client: Client }> = ({ client }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link href={`/clients/${client.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
              {client.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600">
            {client.address.suburb}, {client.address.state}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        {client.phone && (
          <p><span className="font-medium">Phone:</span> {client.phone}</p>
        )}
        {client.email && (
          <p><span className="font-medium">Email:</span> {client.email}</p>
        )}
        <p><span className="font-medium">Address:</span></p>
        <p className="ml-4">
          {client.address.street}<br/>
          {client.address.suburb}, {client.address.state} {client.address.postcode}
        </p>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Added {new Date(client.createdAt).toLocaleDateString()}
        </div>
        <Link href={`/clients/${client.id}`}>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await ClientsAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.suburb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading clients...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <Link href="/clients/new">
          <Button>Add New Client</Button>
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No clients found matching your search' : 'No clients yet'}
          </p>
          {!searchTerm && (
            <Link href="/clients/new">
              <Button>Add Your First Client</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}