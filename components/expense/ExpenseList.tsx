import React from 'react';
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { expenseCategories } from '@/lib/data/dummy-data';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete
}) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No expenses recorded yet
      </div>
    );
  }

  const getCategoryName = (categoryId: string) => {
    return expenseCategories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const billableAmount = expenses
    .filter(expense => expense.billable)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4">
      {/* Expense Items */}
      <div className="space-y-2">
        {expenses.map(expense => (
          <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-4">
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
                  {getCategoryName(expense.categoryId)} • {formatDate(expense.date)}
                </p>
                <p className="text-sm text-gray-600">
                  {expense.quantity} × {formatCurrency(expense.unitPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
                {(onEdit || onDelete) && (
                  <div className="flex gap-2 mt-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Billable Expenses:</span>
            <span>{formatCurrency(billableAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Non-billable Expenses:</span>
            <span>{formatCurrency(totalAmount - billableAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total Expenses:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};