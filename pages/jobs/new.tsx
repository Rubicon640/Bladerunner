import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Client, CreateJobData } from '@/types';
import { JobsAPI } from '@/lib/api/jobs';
import { ClientsAPI } from '@/lib/api/clients';

export default function NewJobPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    description: '',
    clientId: '',
    status: 'pending',
    priority: 'medium',
    hourlyRate: 75,
    estimatedHours: 0,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadClients();
	// Pre-select client if provided in query
	if (router.query.clientId && typeof router.query.clientId === 'string') {
	   setFormData(prev => ({
      ...prev,
	  clientId: router.query.clientId as string
    }));
  }
}, [router.query.clientId]);

  const loadClients = async () => {
    try {
      const clientData = await ClientsAPI.getAll();
      setClients(clientData);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' || name === 'estimatedHours' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.clientId) newErrors.clientId = 'Please select a client';
    if (formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newJob = await JobsAPI.create({
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
      });
      router.push(`/jobs/${newJob.id}`);
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job</h1>
        <p className="text-gray-600">Add a new gardening job to your schedule</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              placeholder="e.g., Front Garden Landscaping"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Describe the work to be done..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
            options={clientOptions}
            error={errors.clientId}
            placeholder="Select a client"
            required
          />

          <Input
            label="Scheduled Date"
            name="scheduledDate"
            type="date"
            value={formData.scheduledDate || ''}
            onChange={handleInputChange}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            options={priorityOptions}
          />

          <Input
            label="Hourly Rate ($)"
            name="hourlyRate"
            type="number"
            step="0.01"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            error={errors.hourlyRate}
            required
          />

          <Input
            label="Estimated Hours"
            name="estimatedHours"
            type="number"
            step="0.5"
            value={formData.estimatedHours}
            onChange={handleInputChange}
            placeholder="0"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any additional notes or special requirements..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Job
          </Button>
        </div>
      </form>
    </div>
  );
}