import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Job } from '@/types';
import { JobsAPI } from '@/lib/api/jobs';
import { CSVExporter } from '@/lib/utils/csv-export';

export default function ExportsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleExportInvoices = () => {
    const csv = CSVExporter.exportInvoices(jobs);
    CSVExporter.downloadCSV(csv, `invoices-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportExpenses = () => {
    const csv = CSVExporter.exportExpenses(jobs);
    CSVExporter.downloadCSV(csv, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const completedJobs = jobs.filter(job => job.status === 'completed');
  const totalRevenue = completedJobs.reduce((sum, job) => sum + job.totalAmount, 0);
  const totalExpenses = jobs.reduce((sum, job) => 
    sum + job.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Export Data</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Total Jobs</h3>
          <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Invoice Export</h2>
          <p className="text-gray-600 mb-6">
            Export completed jobs for MYOB invoicing. Includes labor hours, rates, and billable expenses.
          </p>
          <Button onClick={handleExportInvoices} className="w-full">
            Export Invoices ({completedJobs.length} jobs)
          </Button>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Expense Export</h2>
          <p className="text-gray-600 mb-6">
            Export all job expenses for tax and accounting purposes. Includes both billable and non-billable expenses.
          </p>
          <Button onClick={handleExportExpenses} className="w-full">
            Export Expenses
          </Button>
        </div>
      </div>
    </div>
  );
}