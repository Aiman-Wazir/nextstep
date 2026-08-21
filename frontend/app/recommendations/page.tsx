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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('recommendations');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRecommendations(data);
        if (data.length > 0) {
          setSelectedCareer(data[0]);
        }
      } catch (e) {
        console.error('Error parsing recommendations:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="card text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Recommendations Found</h1>
            <p className="text-gray-600 mb-6">
              Please complete your profile first to get career recommendations.
            </p>
            <Link href="/profile" className="btn-primary">
              Go to Profile
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Recommendations</h1>
            <p className="text-gray-600 mt-1">Based on your skills and interests</p>
          </div>
          <Link href="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
            Update Profile →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of recommendations */}
          <div className="lg:col-span-1 space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.career_id}
                onClick={() => setSelectedCareer(rec)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedCareer?.career_id === rec.career_id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100'
                }`}
              >
                <h3 className="font-semibold">{rec.career_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm opacity-75">Match:</span>
                  <span className={`font-bold ${selectedCareer?.career_id === rec.career_id ? 'text-white' : 'text-blue-600'}`}>
                    {rec.match_score}%
                  </span>
                </div>
                <span className="text-xs opacity-75">{rec.category}</span>
              </div>
            ))}
          </div>

          {/* Details of selected career */}
          <div className="lg:col-span-2">
            {selectedCareer ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCareer.career_name}</h2>
                    <span className="badge badge-blue mt-1">{selectedCareer.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{selectedCareer.match_score}%</div>
                    <span className="text-sm text-gray-500">Match Score</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedCareer.description}</p>
                
                {selectedCareer.explanation && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Why this career?</h3>
                    <p className="text-blue-800 whitespace-pre-wrap">{selectedCareer.explanation}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard?career=${selectedCareer.career_id}`}
                    className="btn-primary"
                  >
                    View Learning Path
                  </Link>
                  <Link
                    href="/profile"
                    className="btn-outline"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500">Select a career to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}