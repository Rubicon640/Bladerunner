import { Job, Expense } from '@/types';

export interface InvoiceData {
  jobId: string;
  clientName: string;
  description: string;
  date: string;
  hours: number;
  hourlyRate: number;
  laborAmount: number;
  expensesAmount: number;
  totalAmount: number;
}

export interface ExpenseData {
  jobId: string;
  clientName: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  billable: boolean;
}

export class CSVExporter {
  static exportInvoices(jobs: Job[]): string {
    const headers = [
      'Job ID',
      'Client Name',
      'Description',
      'Date Completed',
      'Hours Worked',
      'Hourly Rate',
      'Labor Amount',
      'Expenses Amount',
      'Total Amount'
    ];

    const rows = jobs
      .filter(job => job.status === 'completed')
      .map(job => {
        const laborAmount = (job.actualHours || 0) * job.hourlyRate;
        const expensesAmount = job.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        return [
          job.id,
          job.client?.name || '',
          job.title,
          job.completedDate?.toLocaleDateString() || '',
          job.actualHours?.toString() || '0',
          job.hourlyRate.toString(),
          laborAmount.toFixed(2),
          expensesAmount.toFixed(2),
          job.totalAmount.toFixed(2)
        ];
      });

    return this.arrayToCSV([headers, ...rows]);
  }

  static exportExpenses(jobs: Job[]): string {
    const headers = [
      'Job ID',
      'Client Name',
      'Category',
      'Description',
      'Date',
      'Amount',
      'Billable'
    ];

    const rows: string[][] = [];
    
    jobs.forEach(job => {
      job.expenses.forEach(expense => {
        rows.push([
          job.id,
          job.client?.name || '',
          expense.category?.name || '',
          expense.description,
          expense.date.toLocaleDateString(),
          expense.amount.toFixed(2),
          expense.billable ? 'Yes' : 'No'
        ]);
      });
    });

    return this.arrayToCSV([headers, ...rows]);
  }

  private static arrayToCSV(data: string[][]): string {
    return data
      .map(row => 
        row.map(cell => 
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
      .join('\n');
  }

  static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

