import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          🌱 Bladerunners CRM
        </Link>
      </div>
    </header>
  );
};