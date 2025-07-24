import { Job, CreateJobData, UpdateJobData } from '@/types';
import { jobs as dummyJobs } from '@/lib/data/dummy-data';

export class JobsAPI {
  private static jobs: Job[] = [...dummyJobs];

  static async getAll(): Promise<Job[]> {
    await this.delay(100);
    return [...this.jobs];
  }

  static async getById(id: string): Promise<Job | null> {
    await this.delay(100);
    return this.jobs.find(job => job.id === id) || null;
  }

  static async create(data: CreateJobData): Promise<Job> {
    await this.delay(200);
    const newJob: Job = {
      ...data,
      id: Date.now().toString(),
      expenses: [],
      totalAmount: (data.estimatedHours || 0) * data.hourlyRate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.push(newJob);
    return newJob;
  }

  static async update(id: string, data: UpdateJobData): Promise<Job | null> {
    await this.delay(200);
    const index = this.jobs.findIndex(job => job.id === id);
    if (index === -1) return null;

    const updatedJob = {
      ...this.jobs[index],
      ...data,
      updatedAt: new Date(),
    };
    
    // Recalculate total amount
    const hours = updatedJob.actualHours || updatedJob.estimatedHours || 0;
    const expensesTotal = updatedJob.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    updatedJob.totalAmount = (hours * updatedJob.hourlyRate) + expensesTotal;

    this.jobs[index] = updatedJob;
    return updatedJob;
  }

  static async delete(id: string): Promise<boolean> {
    await this.delay(100);
    const index = this.jobs.findIndex(job => job.id === id);
    if (index === -1) return false;
    this.jobs.splice(index, 1);
    return true;
  }

  // Method to add expense to a job
  static async addExpense(jobId: string, expense: any): Promise<Job | null> {
    await this.delay(100);
    const index = this.jobs.findIndex(job => job.id === jobId);
    if (index === -1) return null;

    this.jobs[index].expenses.push(expense);
    
    // Recalculate total
    const job = this.jobs[index];
    const hours = job.actualHours || job.estimatedHours || 0;
    const expensesTotal = job.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    job.totalAmount = (hours * job.hourlyRate) + expensesTotal;
    job.updatedAt = new Date();

    return { ...job };
  }

  // Method to remove expense from a job
  static async removeExpense(jobId: string, expenseId: string): Promise<Job | null> {
    await this.delay(100);
    const index = this.jobs.findIndex(job => job.id === jobId);
    if (index === -1) return null;

    this.jobs[index].expenses = this.jobs[index].expenses.filter(exp => exp.id !== expenseId);
    
    // Recalculate total
    const job = this.jobs[index];
    const hours = job.actualHours || job.estimatedHours || 0;
    const expensesTotal = job.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    job.totalAmount = (hours * job.hourlyRate) + expensesTotal;
    job.updatedAt = new Date();

    return { ...job };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}