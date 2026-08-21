'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/auth';
import { apiClient } from '@/services/api';

interface Skill {
  name: string;
  level: number;
}

interface ProfileFormData {
  name: string;
  education: string;
  experience_level: number;
  skills: Skill[];
  interests: string[];
  career_preferences: {
    remote_preference: 'remote' | 'hybrid' | 'onsite';
    job_type: 'full_time' | 'part_time' | 'contract';
    preferred_area: string;
  };
}

const SKILL_OPTIONS = [
  'python', 'javascript', 'sql', 'machine_learning', 'deep_learning',
  'tensorflow', 'pytorch', 'react', 'nodejs', 'docker', 'kubernetes',
  'aws', 'gcp', 'azure', 'git', 'nlp', 'computer_vision',
  'data_visualization', 'statistics', 'rest_apis'
];

const INTEREST_OPTIONS = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Web Development', 'Mobile Development', 'Cloud Computing',
  'Cybersecurity', 'Data Analytics', 'UI/UX', 'Software Engineering'
];

const EDUCATION_OPTIONS = [
  'Computer Science', 'Data Science', 'AI/ML', 'Software Engineering',
  'Information Technology', 'Mathematics', 'Statistics', 'Other'
];

const ProfileForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    education: '',
    experience_level: 1,
    skills: [],
    interests: [],
    career_preferences: {
      remote_preference: 'hybrid',
      job_type: 'full_time',
      preferred_area: ''
    }
  });

  useEffect(() => {
    // Load existing profile if user is logged in
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await apiClient.get('/profile/' + user?.uid);
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSkillChange = (skillName: string, level: number) => {
    setFormData(prev => {
      const existingSkill = prev.skills.find(s => s.name === skillName);
      if (existingSkill) {
        return {
          ...prev,
          skills: prev.skills.map(s =>
            s.name === skillName ? { ...s, level } : s
          )
        };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, { name: skillName, level }]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/profile/' + user?.uid, formData);
      if (response.status === 200) {
        router.push('/recommendations');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Create Your Profile
        </h2>

        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Education
            </label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select your education</option>
              {EDUCATION_OPTIONS.map(edu => (
                <option key={edu} value={edu}>{edu}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Experience Level
            </label>
            <select
              value={formData.experience_level}
              onChange={(e) => setFormData({ ...formData, experience_level: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value={0}>Entry Level</option>
              <option value={1}>Junior</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Senior</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Technical Skills
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Rate your proficiency for each skill (1-5)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILL_OPTIONS.map(skill => {
            const currentSkill = formData.skills.find(s => s.name === skill);
            const level = currentSkill?.level || 0;
            return (
              <div key={skill} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                  {skill}
                </span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={level}
                  onChange={(e) => handleSkillChange(skill, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {level || '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interests Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Interests
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {INTEREST_OPTIONS.map(interest => (
            <label key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      interests: [...formData.interests, interest]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      interests: formData.interests.filter(i => i !== interest)
                    });
                  }
                }}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Career Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Career Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remote Preference
            </label>
            <select
              value={formData.career_preferences.remote_preference}
              onChange={(e) => setFormData({
                ...formData,
                career_preferences: {
                  ...formData.career_preferences,
                  remote_preference: e.target.value as 'remote' | 'hybrid' | 'onsite'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Type
            </label>
            <select
              value={formData.career_preferences.job_type}
              onChange={(e) => setFormData({
                ...formData,
                career_preferences: {
                  ...formData.career_preferences,
                  job_type: e.target.value as 'full_time' | 'part_time' | 'contract'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Get Recommendations'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;