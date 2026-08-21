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
      const profileData = sessionStorage.getItem('profileData');
      let profile = null;
      
      if (profileData) {
        profile = JSON.parse(profileData);
      } else {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
          profile = JSON.parse(storedProfile);
        }
      }

      const payload = {
        career_id: careerId,
        skills: profile?.skills || { python: 3, machine_learning: 2 },
        interests: profile?.interests || [],
        education: profile?.education || 'Computer Science',
        experience_level: profile?.experience_level || 0
      };

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
        setRoadmap(data.roadmap);
      } else {
        const errorData = await response.text();
        setError(`Error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm font-medium">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/recommendations" className="btn-primary text-sm">
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  if (!careerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Career Selected</h3>
          <p className="text-gray-500 text-sm mb-6">Choose a career from your recommendations to start learning.</p>
          <Link href="/recommendations" className="btn-primary text-sm">
            View Recommendations
          </Link>
        </div>
      </div>
    );
  }

  const masteredCount = roadmap?.skill_gaps?.filter(g => g.gap === 0).length || 0;
  const totalSkills = roadmap?.skill_gaps?.length || 1;
  const progressPercentage = Math.round((masteredCount / totalSkills) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/recommendations" className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">{roadmap?.career_name || 'Learning Path'}</h1>
              <p className="text-xs text-gray-500">Career Track</p>
            </div>
          </div>
          <Link href="/profile" className="text-xs text-gray-400 hover:text-gray-600 transition">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="container max-w-3xl py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{progressPercentage}%</div>
            <div className="text-xs text-gray-500 mt-1">Overall Progress</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{masteredCount}</div>
            <div className="text-xs text-gray-500 mt-1">Skills Mastered</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{totalSkills}</div>
            <div className="text-xs text-gray-500 mt-1">Total Skills</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Your Journey Progress</span>
            <span className="text-blue-600 font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Start</span>
            <span>{masteredCount} of {totalSkills} skills mastered</span>
            <span>Goal</span>
          </div>
        </div>

        {/* Skills Section */}
        {roadmap?.skill_gaps && roadmap.skill_gaps.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900">Skills to Develop</h2>
              <span className="text-xs text-gray-400">{totalSkills} skills</span>
            </div>
            <div className="space-y-4">
              {roadmap.skill_gaps.map((gap, index) => {
                const isMastered = gap.gap === 0;
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-800">{gap.skill}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                          isMastered 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : gap.gap <= 1 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isMastered ? 'Mastered' : gap.gap <= 1 ? 'Almost there' : 'In progress'}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {gap.current} / {gap.required}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isMastered ? 'bg-emerald-500' : gap.gap <= 1 ? 'bg-amber-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(gap.current / gap.required) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Learning Roadmap Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">Learning Roadmap</h2>
          
          {roadmap?.structured?.months && roadmap.structured.months.length > 0 ? (
            <div className="space-y-0">
              {roadmap.structured.months.map((month, index) => {
                const isFirst = index === 0;
                const isLast = index === roadmap.structured.months.length - 1;
                return (
                  <div key={index} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-[19px] top-[34px] bottom-0 w-[2px] bg-gradient-to-b from-blue-200 to-gray-100" />
                    )}
                    {/* Timeline Dot */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      isFirst 
                        ? 'bg-blue-600 ring-4 ring-blue-100' 
                        : isLast 
                          ? 'bg-emerald-500 ring-4 ring-emerald-100' 
                          : 'bg-blue-400 ring-4 ring-blue-50'
                    }`}>
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">{month.month}</h3>
                        {isFirst && (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Current</span>
                        )}
                        {isLast && (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Goal</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                        {month.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No learning roadmap available yet.</p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/recommendations" className="btn-secondary text-sm flex-1 sm:flex-none">
            Browse Careers
          </Link>
          <Link href="/profile" className="btn-outline text-sm flex-1 sm:flex-none">
            Update Profile
          </Link>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary text-sm flex-1 sm:flex-none"
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}