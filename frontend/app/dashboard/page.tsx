'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Milestone {
  month: string;
  content: string;
}

interface Roadmap {
  roadmap: string;
  structured: {
    months: Milestone[];
  };
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const careerId = searchParams.get('career');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (careerId) {
      fetchRoadmap();
    }
  }, [careerId]);

  const fetchRoadmap = async () => {
    try {
      // Get profile data from session
      const profileData = sessionStorage.getItem('profileData');
      if (!profileData) {
        setLoading(false);
        return;
      }

      const profile = JSON.parse(profileData);
      
      const response = await fetch('http://localhost:8000/api/v1/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_id: careerId,
          skills: profile.skills || {},
          interests: profile.interests || [],
          education: profile.education || '',
          experience_level: profile.experience_level || 0
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmap(data.roadmap);
        // Calculate initial progress
        setProgress(10);
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
          <Link href="/recommendations" className="text-blue-600 hover:underline">
            ← Back to Recommendations
          </Link>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 rounded-full h-4 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="font-bold text-lg">{Math.round(progress)}%</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Skills Learned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Milestones</div>
            </div>
          </div>
        </div>

        {/* Learning Roadmap */}
        {roadmap ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Learning Roadmap</h2>
            
            {roadmap.structured && roadmap.structured.months && (
              <div className="space-y-4">
                {roadmap.structured.months.map((month, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold text-lg">{month.month}</h3>
                    <div className="text-gray-700 whitespace-pre-wrap mt-1">
                      {month.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {roadmap.roadmap && !roadmap.structured && (
              <div className="text-gray-700 whitespace-pre-wrap">
                {roadmap.roadmap}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">
              Select a career to view your personalized learning roadmap
            </p>
            <Link
              href="/recommendations"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Recommendations
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}