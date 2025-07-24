import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CreateExpenseData, ExpenseCategory } from '@/types';
import { expenseCategories } from '@/lib/data/dummy-data';

interface ExpenseFormProps {
  jobId: string;
  onSubmit: (data: CreateExpenseData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  jobId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateExpenseData>({
    jobId,
    categoryId: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    date: new Date(),
    billable: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'date') {
      processedValue = new Date(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) newErrors.categoryId = 'Please select a category';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (formData.unitPrice < 0) newErrors.unitPrice = 'Unit price cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const categoryOptions = expenseCategories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  const totalAmount = formData.quantity * formData.unitPrice;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Category"
        name="categoryId"
        value={formData.categoryId}
        onChange={handleInputChange}
        options={categoryOptions}
        error={errors.categoryId}
        placeholder="Select expense category"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={2}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : ''
          }`}
          placeholder="e.g., Premium lawn fertilizer"
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          step="0.1"
          min="0.1"
          value={formData.quantity}
          onChange={handleInputChange}
          error={errors.quantity}
          required
        />

        <Input
          label="Unit Price ($)"
          name="unitPrice"
          type="number"
          step="0.01"
          min="0"
          value={formData.unitPrice}
          onChange={handleInputChange}
          error={errors.unitPrice}
          required
        />
      </div>

      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date.toISOString().split('T')[0]}
        onChange={handleInputChange}
        required
      />

      <div className="flex items-center">
        <input
          id="billable"
          name="billable"
          type="checkbox"
          checked={formData.billable}
          onChange={handleInputChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="billable" className="ml-2 block text-sm text-gray-900">
          Billable to client
        </label>
      </div>

      {totalAmount > 0 && (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between font-medium">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Expense
        </Button>
      </div>
    </form>
  );
};