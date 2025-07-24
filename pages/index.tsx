import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bladerunners CRM
        </h1>
        <p className="text-xl text-gray-600">
          Manage your jobs, clients, and expenses all in one place
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4">Jobs</h2>
          <p className="text-gray-600 mb-6">
            Track your gardening jobs from quote to completion
          </p>
          <Link href="/jobs">
            <Button>View Jobs</Button>
          </Link>
        </div>

        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4">Clients</h2>
          <p className="text-gray-600 mb-6">
            Manage your client information and job history
          </p>
          <Link href="/clients">
            <Button>View Clients</Button>
          </Link>
        </div>

        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4">Exports</h2>
          <p className="text-gray-600 mb-6">
            Export invoices and expenses for MYOB
          </p>
          <Link href="/exports">
            <Button>Export Data</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}