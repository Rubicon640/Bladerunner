import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Client, Job } from '@/types';
import { ClientsAPI } from '@/lib/api/clients';
import { JobsAPI } from '@/lib/api/jobs';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/job/JobCard';
import { formatDate } from '@/lib/utils/formatters';

export default function ClientDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<Client | null>(null);
  const [clientJobs, setClientJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadClientData(id);
    }
  }, [id]);

  const loadClientData = async (clientId: string) => {
    try {
      const [clientData, allJobs] = await Promise.all([
        ClientsAPI.getById(clientId),
        JobsAPI.getAll()
      ]);
      
      setClient(clientData);
      setClientJobs(allJobs.filter(job => job.clientId === clientId));
    } catch (error) {
      console.error('Failed to load client data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading client details...</div>;
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h2>
        <Link href="/clients">
          <Button>Back to Clients</Button>
        </Link>
      </div>
    );
  }

  const totalJobValue = clientJobs.reduce((sum, job) => sum + job.totalAmount, 0);
  const completedJobs = clientJobs.filter(job => job.status === 'completed');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/clients" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Clients
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h1>
            <p className="text-lg text-gray-600">
              {client.address.suburb}, {client.address.state}
            </p>
          </div>
          
          <Link href={`/jobs/new?clientId=${client.id}`}>
            <Button>Create New Job</Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              {client.phone && (
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
              )}
              
              {client.email && (
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">{client.email}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-900">
                  {client.address.street}<br/>
                  {client.address.suburb}, {client.address.state} {client.address.postcode}
                </p>
              </div>
              
              {client.notes && (
                <div>
                  <span className="font-medium text-gray-700">Notes:</span>
                  <p className="text-gray-900">{client.notes}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Client Since:</span>
                <p className="text-gray-900">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Client Statistics */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Jobs:</span>
                <span className="font-semibold">{clientJobs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold">{completedJobs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-semibold">${totalJobValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Jobs</h2>
            <span className="text-gray-500">{clientJobs.length} total</span>
          </div>
          
          {clientJobs.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-500 mb-4">No jobs yet for this client</p>
              <Link href={`/jobs/new?clientId=${client.id}`}>
                <Button>Create First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {clientJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}