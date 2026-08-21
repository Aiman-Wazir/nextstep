'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Recommendation {
  career_id: string;
  career_name: string;
  match_score: number;
  description: string;
  category: string;
  explanation?: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Recommendation | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('recommendations');
    if (stored) {
      const data = JSON.parse(stored);
      setRecommendations(data);
      if (data.length > 0) {
        setSelectedCareer(data[0]);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Career Recommendations</h1>
          <Link href="/profile" className="text-blue-600 hover:underline">
            Update Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of recommendations */}
          <div className="lg:col-span-1 space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.career_id}
                onClick={() => setSelectedCareer(rec)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedCareer?.career_id === rec.career_id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-50 shadow'
                }`}
              >
                <h3 className="font-semibold">{rec.career_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Match:</span>
                  <span className="font-bold">{rec.match_score}%</span>
                </div>
                <span className="text-xs opacity-75">{rec.category}</span>
              </div>
            ))}
          </div>

          {/* Details of selected career */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {selectedCareer ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedCareer.career_name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">Match Score:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedCareer.match_score}%
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{selectedCareer.description}</p>
                
                {selectedCareer.explanation && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Why this career?</h3>
                    <p className="text-blue-800 whitespace-pre-wrap">{selectedCareer.explanation}</p>
                  </div>
                )}
                
                <Link
                  href={`/dashboard?career=${selectedCareer.career_id}`}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Learning Path
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Select a career to view details</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}