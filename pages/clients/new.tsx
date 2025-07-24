import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateClientData } from '@/types';
import { ClientsAPI } from '@/lib/api/clients';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateClientData>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      suburb: '',
      postcode: '',
      state: 'NSW',
    },
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.suburb.trim()) newErrors['address.suburb'] = 'Suburb is required';
    if (!formData.address.postcode.trim()) newErrors['address.postcode'] = 'Postcode is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newClient = await ClientsAPI.create(formData);
      router.push(`/clients/${newClient.id}`);
    } catch (error) {
      console.error('Failed to create client:', error);
      alert('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stateOptions = [
    { value: 'NSW', label: 'NSW' },
    { value: 'VIC', label: 'VIC' },
    { value: 'QLD', label: 'QLD' },
    { value: 'WA', label: 'WA' },
    { value: 'SA', label: 'SA' },
    { value: 'TAS', label: 'TAS' },
    { value: 'ACT', label: 'ACT' },
    { value: 'NT', label: 'NT' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Client</h1>
        <p className="text-gray-600">Create a new client profile</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="e.g., John Smith"
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="john@example.com"
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="0412 345 678"
          />

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Street Address"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              error={errors['address.street']}
              placeholder="123 Main Street"
              required
            />
          </div>

          <Input
            label="Suburb"
            name="address.suburb"
            value={formData.address.suburb}
            onChange={handleInputChange}
            error={errors['address.suburb']}
            placeholder="Greenfield"
            required
          />

          <Input
            label="Postcode"
            name="address.postcode"
            value={formData.address.postcode}
            onChange={handleInputChange}
            error={errors['address.postcode']}
            placeholder="2000"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['address.state'] ? 'border-red-500' : ''
              }`}
              required
            >
              {stateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors['address.state'] && (
              <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
            )}
          </div>

          <div></div> {/* Empty div for grid alignment */}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special notes about this client..."
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
            Create Client
          </Button>
        </div>
      </form>
    </div>
  );
}