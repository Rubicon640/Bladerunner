export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Expense {
  id: string;
  jobId: string;
  categoryId: string;
  category?: ExpenseCategory;
  description: string;
  amount: number;
  quantity: number;
  unitPrice: number;
  date: Date;
  receipt?: string;
  billable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseData {
  jobId: string;
  categoryId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  date: Date;
  billable: boolean;
}
