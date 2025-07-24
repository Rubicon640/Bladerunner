import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-200 text-red-900',
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600">{job.client?.name}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
            {job.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[job.priority]}`}>
            {job.priority}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Scheduled:</span>
          <p>{job.scheduledDate ? formatDate(job.scheduledDate) : 'Not scheduled'}</p>
        </div>
        <div>
          <span className="font-medium">Total:</span>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(job.totalAmount)}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {job.actualHours ? `${job.actualHours}h logged` : `${job.estimatedHours || 0}h estimated`}
        </div>
        <Link href={`/jobs/edit/${job.id}`}>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
};
