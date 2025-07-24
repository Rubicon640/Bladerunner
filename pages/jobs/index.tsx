import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { JobCard } from '@/components/job/JobCard';
import { Button } from '@/components/ui/Button';
import { JobsAPI } from '@/lib/api/jobs';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await JobsAPI.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        <Link href="/jobs/new">
          <Button>Add New Job</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'in-progress', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All Jobs' : status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No jobs found</p>
          <Link href="/jobs/new">
            <Button>Create Your First Job</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}