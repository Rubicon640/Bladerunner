import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navigation: React.FC = () => {
  const router = useRouter();
  
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/clients', label: 'Clients' },
    { href: '/exports', label: 'Exports' },
  ];

  return (
    <nav className="bg-primary-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-4 px-2 border-b-2 transition-colors ${
                router.pathname === item.href
                  ? 'border-white'
                  : 'border-transparent hover:border-primary-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};