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
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-primary-500 text-sm font-medium">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-100 p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-900 mb-2">Something went wrong</h3>
          <p className="text-primary-500 text-sm mb-6">{error}</p>
          <Link href="/recommendations" className="btn-primary text-sm">
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  if (!careerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-primary-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">No Career Selected</h3>
          <p className="text-primary-500 text-sm mb-6">Choose a career from your recommendations to start learning.</p>
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
    <div className="min-h-screen bg-primary-50">
      {/* Top Navigation Bar */}
      <div className="border-b border-primary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/recommendations" className="text-primary-400 hover:text-primary-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-primary-900">{roadmap?.career_name || 'Learning Path'}</h1>
              <p className="text-xs text-primary-500">Career Track</p>
            </div>
          </div>
          <Link href="/profile" className="text-xs text-primary-400 hover:text-primary-600 transition">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="container max-w-3xl py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-primary-200 p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-rose-600">{progressPercentage}%</div>
            <div className="text-xs text-primary-500 mt-1">Overall Progress</div>
          </div>
          <div className="bg-white rounded-2xl border border-primary-200 p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-teal-600">{masteredCount}</div>
            <div className="text-xs text-primary-500 mt-1">Skills Mastered</div>
          </div>
          <div className="bg-white rounded-2xl border border-primary-200 p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary-700">{totalSkills}</div>
            <div className="text-xs text-primary-500 mt-1">Total Skills</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-primary-200 p-6 shadow-sm mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-primary-700 font-medium">Your Journey Progress</span>
            <span className="text-rose-600 font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-primary-400 mt-2">
            <span>Start</span>
            <span>{masteredCount} of {totalSkills} skills mastered</span>
            <span>Goal</span>
          </div>
        </div>

        {/* Skills Section */}
        {roadmap?.skill_gaps && roadmap.skill_gaps.length > 0 && (
          <div className="bg-white rounded-2xl border border-primary-200 p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-primary-900">Skills to Develop</h2>
              <span className="text-xs text-primary-400">{totalSkills} skills</span>
            </div>
            <div className="space-y-4">
              {roadmap.skill_gaps.map((gap, index) => {
                const isMastered = gap.gap === 0;
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-primary-800">{gap.skill}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                          isMastered 
                            ? 'bg-teal-50 text-teal-700' 
                            : gap.gap <= 1 
                              ? 'bg-primary-100 text-primary-700' 
                              : 'bg-primary-50 text-primary-400'
                        }`}>
                          {isMastered ? 'Mastered' : gap.gap <= 1 ? 'Almost there' : 'In progress'}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-primary-500">
                        {gap.current} / {gap.required}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isMastered ? 'bg-teal-500' : gap.gap <= 1 ? 'bg-primary-500' : 'bg-rose-500'
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
        <div className="bg-white rounded-2xl border border-primary-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-primary-900 mb-6">Learning Roadmap</h2>
          
          {roadmap?.structured?.months && roadmap.structured.months.length > 0 ? (
            <div className="space-y-0">
              {roadmap.structured.months.map((month, index) => {
                const isFirst = index === 0;
                const isLast = index === roadmap.structured.months.length - 1;
                return (
                  <div key={index} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-[19px] top-[34px] bottom-0 w-[2px] bg-gradient-to-b from-rose-200 to-primary-200" />
                    )}
                    {/* Timeline Dot */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      isFirst 
                        ? 'bg-rose-600 ring-4 ring-rose-100' 
                        : isLast 
                          ? 'bg-teal-500 ring-4 ring-teal-100' 
                          : 'bg-primary-400 ring-4 ring-primary-100'
                    }`}>
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-primary-900">{month.month}</h3>
                        {isFirst && (
                          <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Current</span>
                        )}
                        {isLast && (
                          <span className="text-[10px] font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Goal</span>
                        )}
                      </div>
                      <div className="text-sm text-primary-500 leading-relaxed whitespace-pre-wrap">
                        {month.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-primary-400 text-sm">No learning roadmap available yet.</p>
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