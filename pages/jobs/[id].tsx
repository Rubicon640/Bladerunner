import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Job, CreateExpenseData, Expense } from '@/types';
import { JobsAPI } from '@/lib/api/jobs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { expenseCategories } from '@/lib/data/dummy-data';

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseFormLoading, setExpenseFormLoading] = useState(false);

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    categoryId: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    date: new Date().toISOString().split('T')[0],
    billable: true,
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadJob(id);
    }
  }, [id]);

  const loadJob = async (jobId: string) => {
    try {
      const jobData = await JobsAPI.getById(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setExpenseForm(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    
    // Basic validation
    if (!expenseForm.categoryId || !expenseForm.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    setExpenseFormLoading(true);
    try {
      // Create the expense object
      const category = expenseCategories.find(cat => cat.id === expenseForm.categoryId);
      const amount = expenseForm.quantity * expenseForm.unitPrice;
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        jobId: job.id,
        categoryId: expenseForm.categoryId,
        category,
        description: expenseForm.description,
        amount,
        quantity: expenseForm.quantity,
        unitPrice: expenseForm.unitPrice,
        date: new Date(expenseForm.date),
        billable: expenseForm.billable,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add expense to job
      const updatedJob = await JobsAPI.addExpense(job.id, newExpense);
      if (updatedJob) {
        setJob(updatedJob);
        setShowExpenseForm(false);
        // Reset form
        setExpenseForm({
          categoryId: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          date: new Date().toISOString().split('T')[0],
          billable: true,
        });
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setExpenseFormLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!job || !confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      const updatedJob = await JobsAPI.removeExpense(job.id, expenseId);
      if (updatedJob) {
        setJob(updatedJob);
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleStatusUpdate = async (newStatus: Job['status']) => {
    if (!job) return;
    
    try {
      const updatedJob = await JobsAPI.update(job.id, { 
        status: newStatus,
        completedDate: newStatus === 'completed' ? new Date() : undefined
      });
      if (updatedJob) {
        setJob(updatedJob);
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

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

  const laborCost = (job.actualHours || job.estimatedHours || 0) * job.hourlyRate;
  const expensesCost = job.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAmount = expenseForm.quantity * expenseForm.unitPrice;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/jobs" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Jobs
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-lg text-gray-600">{job.client?.name}</p>
          </div>
          
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}>
              {job.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[job.priority]}`}>
              {job.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{job.description}</p>
            {job.notes && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <h3 className="font-medium text-yellow-800 mb-2">Notes</h3>
                <p className="text-yellow-700">{job.notes}</p>
              </div>
            )}
          </div>

          {/* Client Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            {job.client && (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {job.client.name}</p>
                {job.client.phone && <p><span className="font-medium">Phone:</span> {job.client.phone}</p>}
                {job.client.email && <p><span className="font-medium">Email:</span> {job.client.email}</p>}
                <p><span className="font-medium">Address:</span></p>
                <p className="ml-4 text-gray-600">
                  {job.client.address.street}<br/>
                  {job.client.address.suburb}, {job.client.address.state} {job.client.address.postcode}
                </p>
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Expenses</h2>
              <Button onClick={() => setShowExpenseForm(true)}>
                Add Expense
              </Button>
            </div>
            
            {/* Expense List */}
            {job.expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No expenses recorded yet</p>
                <p className="text-sm mt-2">Click "Add Expense" to record materials, fuel, or other costs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Expense Items */}
                <div className="space-y-2">
                  {job.expenses.map(expense => (
                    <div key={expense.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{expense.description}</h4>
                            {expense.billable && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Billable
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {expense.category?.name} • {formatDate(expense.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {expense.quantity} × {formatCurrency(expense.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-sm text-red-600 hover:text-red-700 mt-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expense Summary */}
                <div className="border-t pt-4 bg-white p-4 rounded-lg border">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Billable Expenses:</span>
                      <span>{formatCurrency(job.expenses.filter(e => e.billable).reduce((sum, e) => sum + e.amount, 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Non-billable Expenses:</span>
                      <span>{formatCurrency(job.expenses.filter(e => !e.billable).reduce((sum, e) => sum + e.amount, 0))}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total Expenses:</span>
                      <span>{formatCurrency(expensesCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <Link href={`/jobs/edit/${job.id}`}>
                <Button className="w-full">Edit Job</Button>
              </Link>
              
              {job.status !== 'completed' && (
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Mark Complete
                </Button>
              )}
              
              {job.status === 'pending' && (
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleStatusUpdate('in-progress')}
                >
                  Start Job
                </Button>
              )}
            </div>
          </div>

          {/* Job Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Scheduled Date:</span>
                <span>{job.scheduledDate ? formatDate(job.scheduledDate) : 'Not set'}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Estimated Hours:</span>
                <span>{job.estimatedHours || 0}h</span>
              </div>
              
              {job.actualHours && (
                <div className="flex justify-between">
                  <span>Actual Hours:</span>
                  <span>{job.actualHours}h</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span>{formatCurrency(job.hourlyRate)}</span>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <span>{formatCurrency(laborCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials & Expenses:</span>
                  <span>{formatCurrency(expensesCost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total Job Value:</span>
                  <span>{formatCurrency(job.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-gray-500">{formatDate(job.createdAt)}</p>
                </div>
              </div>
              
              {job.scheduledDate && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Scheduled</p>
                    <p className="text-gray-500">{formatDate(job.scheduledDate)}</p>
                  </div>
                </div>
              )}
              
              {job.completedDate && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-gray-500">{formatDate(job.completedDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        title="Add Job Expense"
        maxWidth="lg"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="categoryId"
              value={expenseForm.categoryId}
              onChange={handleExpenseFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select expense category</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={expenseForm.description}
              onChange={handleExpenseFormChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Premium lawn fertilizer"
              required
            />
          </div>

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                step="0.1"
                min="0.1"
                value={expenseForm.quantity}
                onChange={handleExpenseFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price ($) *
              </label>
              <input
                type="number"
                name="unitPrice"
                step="0.01"
                min="0"
                value={expenseForm.unitPrice}
                onChange={handleExpenseFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={expenseForm.date}
              onChange={handleExpenseFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Billable checkbox */}
          <div className="flex items-center">
            <input
              id="billable"
              name="billable"
              type="checkbox"
              checked={expenseForm.billable}
              onChange={handleExpenseFormChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="billable" className="ml-2 block text-sm text-gray-900">
              Billable to client
            </label>
          </div>

          {/* Total preview */}
          {totalAmount > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Form buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowExpenseForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={expenseFormLoading}>
              Add Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}