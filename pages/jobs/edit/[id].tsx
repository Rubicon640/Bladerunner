import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Job, Client, UpdateJobData } from '@/types';
import { JobsAPI } from '@/lib/api/jobs';
import { ClientsAPI } from '@/lib/api/clients';

export default function EditJobPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateJobData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadData(id);
    }
  }, [id]);

  const loadData = async (jobId: string) => {
    try {
      const [jobData, clientData] = await Promise.all([
        JobsAPI.getById(jobId),
        ClientsAPI.getAll()
      ]);
      
      if (jobData) {
        setJob(jobData);
        setFormData({
          title: jobData.title,
          description: jobData.description,
          clientId: jobData.clientId,
          status: jobData.status,
          priority: jobData.priority,
          hourlyRate: jobData.hourlyRate,
          estimatedHours: jobData.estimatedHours,
          actualHours: jobData.actualHours,
          scheduledDate: jobData.scheduledDate,
          notes: jobData.notes,
        });
      }
      setClients(clientData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' || name === 'estimatedHours' || name === 'actualHours' 
        ? parseFloat(value) || undefined 
        : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.clientId) newErrors.clientId = 'Please select a client';
    if (formData.hourlyRate && formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job || !validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
      };
      
      const updatedJob = await JobsAPI.update(job.id, updateData);
      if (updatedJob) {
        router.push(`/jobs/${updatedJob.id}`);
      }
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center py-8">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <Button onClick={() => router.push('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job</h1>
        <p className="text-gray-600">Update job details and progress</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Job Title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              error={errors.title}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <Select
            label="Client"
            name="clientId"
            value={formData.clientId || ''}
            onChange={handleInputChange}
            options={clientOptions}
            error={errors.clientId}
            required
          />

          <Input
            label="Scheduled Date"
            name="scheduledDate"
            type="date"
            value={formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status || ''}
            onChange={handleInputChange}
            options={statusOptions}
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority || ''}
            onChange={handleInputChange}
            options={priorityOptions}
          />

          <Input
            label="Hourly Rate ($)"
            name="hourlyRate"
            type="number"
            step="0.01"
            value={formData.hourlyRate || ''}
            onChange={handleInputChange}
            error={errors.hourlyRate}
            required
          />

          <Input
            label="Estimated Hours"
            name="estimatedHours"
            type="number"
            step="0.5"
            value={formData.estimatedHours || ''}
            onChange={handleInputChange}
          />

          <Input
            label="Actual Hours"
            name="actualHours"
            type="number"
            step="0.5"
            value={formData.actualHours || ''}
            onChange={handleInputChange}
            placeholder="Hours worked"
          />

          <div></div> {/* Empty div for grid alignment */}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Update Job
          </Button>
        </div>
      </form>
    </div>
  );
}