'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const careerId = searchParams.get('career');

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
          <Link href="/recommendations" className="text-blue-600 hover:text-blue-700">
            ← Back to Recommendations
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {careerId ? `Learning Path for ${careerId.replace('_', ' ').toUpperCase()}` : 'Select a Career'}
          </h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
            <p className="text-blue-800">
              Your personalized learning path will appear here once you select a career.
              Go back to recommendations and choose a career to see your learning roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Skills Learned</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">0%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}