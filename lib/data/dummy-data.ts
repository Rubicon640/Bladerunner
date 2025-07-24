import { Job, Client, Expense, ExpenseCategory } from '@/types';

export const expenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Fuel', description: 'Vehicle fuel costs' },
  { id: '2', name: 'Plants & Seeds', description: 'Plants, seeds, bulbs' },
  { id: '3', name: 'Tools & Equipment', description: 'Tools and equipment purchases' },
  { id: '4', name: 'Fertilizer & Chemicals', description: 'Fertilizers, pesticides, herbicides' },
  { id: '5', name: 'Mulch & Soil', description: 'Mulch, soil, compost' },
  { id: '6', name: 'Equipment Hire', description: 'Hired equipment costs' },
];

export const clients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '0412345678',
    address: {
      street: '123 Garden St',
      suburb: 'Greenfield',
      postcode: '2000',
      state: 'NSW'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '0498765432',
    address: {
      street: '456 Rose Ave',
      suburb: 'Bloomdale',
      postcode: '2001',
      state: 'NSW'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

const expenses: Expense[] = [
  {
    id: '1',
    jobId: '1',
    categoryId: '2',
    description: 'Native plants for front garden',
    amount: 150,
    quantity: 10,
    unitPrice: 15,
    date: new Date('2024-02-01'),
    billable: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    jobId: '1',
    categoryId: '5',
    description: 'Premium mulch',
    amount: 80,
    quantity: 4,
    unitPrice: 20,
    date: new Date('2024-02-01'),
    billable: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Front Garden Landscaping',
    description: 'Complete redesign of front garden with native plants',
    clientId: '1',
    client: clients[0],
    status: 'in-progress',
    priority: 'medium',
    scheduledDate: new Date('2024-02-15'),
    estimatedHours: 16,
    actualHours: 8,
    hourlyRate: 75,
    expenses: expenses.filter(e => e.jobId === '1'),
    totalAmount: 830, // 8 hours * $75 + $150 + $80
    notes: 'Client prefers drought-resistant plants',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    title: 'Lawn Maintenance',
    description: 'Monthly lawn mowing and edge trimming',
    clientId: '2',
    client: clients[1],
    status: 'pending',
    priority: 'low',
    scheduledDate: new Date('2024-02-10'),
    estimatedHours: 2,
    hourlyRate: 60,
    expenses: [],
    totalAmount: 120,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
];

