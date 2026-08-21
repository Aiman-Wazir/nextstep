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

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-gray-500';
  };

  const getMatchCircleColor = (score: number) => {
    if (score >= 70) return 'match-circle-high';
    if (score >= 50) return 'match-circle-medium';
    return 'match-circle-low';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="card text-center py-16">
            <h1 className="section-title mb-4">No Recommendations Found</h1>
            <p className="text-gray-500 mb-6">
              Complete your profile to get personalized career recommendations.
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Career Matches</h1>
            <p className="section-subtitle">Based on your skills and interests</p>
          </div>
          <Link href="/profile" className="btn-secondary text-sm">
            Update Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Career List */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-sm text-gray-500 mb-3 font-medium">
              Showing {recommendations.length} careers
            </div>
            {recommendations.map((rec) => (
              <div
                key={rec.career_id}
                onClick={() => setSelectedCareer(rec)}
                className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedCareer?.career_id === rec.career_id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-semibold text-sm ${
                      selectedCareer?.career_id === rec.career_id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {rec.career_name}
                    </h3>
                    <span className={`text-xs ${
                      selectedCareer?.career_id === rec.career_id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {rec.category}
                    </span>
                  </div>
                  <div className={`text-sm font-bold ${
                    selectedCareer?.career_id === rec.career_id
                      ? 'text-white'
                      : getMatchColor(rec.match_score)
                  }`}>
                    {rec.match_score}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main - Career Details */}
          <div className="lg:col-span-2">
            {selectedCareer ? (
              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCareer.career_name}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="badge-blue">{selectedCareer.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`match-circle ${getMatchCircleColor(selectedCareer.match_score)} text-lg`}>
                      {selectedCareer.match_score}%
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Match Score</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">{selectedCareer.description}</p>

                {selectedCareer.explanation && (
                  <div className="bg-blue-50/70 rounded-xl p-5 mb-6 border border-blue-100/50">
                    <h3 className="font-semibold text-blue-900 text-sm mb-2">Why this career?</h3>
                    <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedCareer.explanation}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
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
              <div className="card text-center py-16">
                <p className="text-gray-500">Select a career from the list</p>
                <p className="text-gray-400 text-sm mt-1">to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}