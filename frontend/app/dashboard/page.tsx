'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
}

interface Month {
  month: string;
  content: string;
}

interface Roadmap {
  roadmap: string;
  structured: {
    months: Month[];
  };
  skill_gaps?: SkillGap[];
  career_name?: string;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const careerId = searchParams.get('career');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (careerId) {
      fetchRoadmap();
    } else {
      setLoading(false);
    }
  }, [careerId]);

  const fetchRoadmap = async () => {
    try {
      // Get profile data from session
      const profileData = sessionStorage.getItem('profileData');
      let profile = null;
      
      if (profileData) {
        profile = JSON.parse(profileData);
      } else {
        // Try to get from form data
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
          profile = JSON.parse(storedProfile);
        }
      }

      // If no profile, use default values
      const payload = {
        career_id: careerId,
        skills: profile?.skills || { python: 3, machine_learning: 2 },
        interests: profile?.interests || [],
        education: profile?.education || 'Computer Science',
        experience_level: profile?.experience_level || 0
      };

      console.log('Fetching roadmap with payload:', payload);

      const response = await fetch('http://localhost:8000/api/v1/roadmap', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Roadmap data:', data);
        setRoadmap(data.roadmap);
      } else {
        const errorData = await response.text();
        setError(`Error: ${response.status} - ${errorData}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      setError('Unable to connect to the server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="card">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Roadmap</h2>
            <p className="text-gray-700">{error}</p>
            <Link href="/recommendations" className="btn-primary mt-4 inline-block">
              Back to Recommendations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!careerId) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="card text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Career Selected</h2>
            <p className="text-gray-600 mb-6">
              Please select a career from your recommendations to see your learning path.
            </p>
            <Link href="/recommendations" className="btn-primary">
              Go to Recommendations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {roadmap?.career_name || 'Learning Dashboard'}
          </h1>
          <Link href="/recommendations" className="text-blue-600 hover:text-blue-700">
            ← Back to Recommendations
          </Link>
        </div>

        {/* Skill Gaps */}
        {roadmap?.skill_gaps && roadmap.skill_gaps.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills to Develop</h2>
            <div className="space-y-3">
              {roadmap.skill_gaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-medium text-gray-900">{gap.skill}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      Current: {gap.current}/5
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 font-medium">
                      Target: {gap.required}/5
                    </span>
                    <span className="text-sm text-red-500 ml-2">
                      Gap: {gap.gap}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Roadmap */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Roadmap</h2>
          
          {roadmap?.structured?.months && roadmap.structured.months.length > 0 ? (
            <div className="space-y-6">
              {roadmap.structured.months.map((month, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-lg text-gray-900">{month.month}</h3>
                  <div className="text-gray-700 whitespace-pre-wrap mt-2">
                    {month.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No learning roadmap available for this career yet.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for updates.</p>
            </div>
          )}
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {roadmap?.skill_gaps?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Skills to Learn</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {roadmap?.structured?.months?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Learning Phases</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {roadmap?.career_name ? '✓' : '-'}
            </div>
            <div className="text-sm text-gray-600">Career Track</div>
          </div>
        </div>
      </div>
    </main>
  );
}