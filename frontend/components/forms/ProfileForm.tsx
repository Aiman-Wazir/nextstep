'use client';

import React, { useState } from 'react';

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

interface ProfileFormProps {
  onSubmit?: (data: ProfileFormData) => void;
  initialData?: Partial<ProfileFormData>;
}

export default function ProfileForm({ onSubmit, initialData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || '',
    education: initialData?.education || '',
    experience_level: initialData?.experience_level || 0,
    skills: initialData?.skills || [],
    interests: initialData?.interests || [],
    career_preferences: initialData?.career_preferences || {
      remote_preference: 'hybrid',
      job_type: 'full_time',
      preferred_area: ''
    }
  });

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
    setError('');

    if (!formData.name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }
    if (!formData.education) {
      setError('Please select your education');
      setLoading(false);
      return;
    }
    if (formData.skills.length === 0) {
      setError('Please rate at least one skill');
      setLoading(false);
      return;
    }
    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      setLoading(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default submission to backend
        const payload = {
          skills: formData.skills.reduce((acc, s) => ({ ...acc, [s.name]: s.level }), {}),
          interests: formData.interests,
          education: formData.education,
          experience_level: formData.experience_level
        };

        const response = await fetch('http://localhost:8000/api/v1/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('recommendations', JSON.stringify(data.recommendations));
          sessionStorage.setItem('profileData', JSON.stringify(payload));
          window.location.href = '/recommendations';
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Failed to get recommendations');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Unable to connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="card">
        <h2 className="text-xl font-bold text-primary-900 mb-6">
          Create Your Profile
        </h2>

        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="input-label">Education</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="input"
              required
            >
              <option value="">Select your education</option>
              {EDUCATION_OPTIONS.map(edu => (
                <option key={edu} value={edu}>{edu}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Experience Level</label>
            <select
              value={formData.experience_level}
              onChange={(e) => setFormData({ ...formData, experience_level: parseInt(e.target.value) })}
              className="input"
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
      <div className="card">
        <h3 className="text-xl font-semibold text-primary-900 mb-4">
          Technical Skills
        </h3>
        <p className="text-sm text-primary-500 mb-4">
          Rate your proficiency for each skill (1-5)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILL_OPTIONS.map(skill => {
            const currentSkill = formData.skills.find(s => s.name === skill);
            const level = currentSkill?.level || 0;
            const percentage = (level / 5) * 100;
            return (
              <div key={skill} className="flex items-center gap-3 group">
                <span className="text-sm font-medium text-primary-700 w-32 truncate">
                  {skill}
                </span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={level}
                  onChange={(e) => handleSkillChange(skill, parseInt(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: level > 0 
                      ? `linear-gradient(to right, #BE185D 0%, #BE185D ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`
                      : '#E2E8F0'
                  }}
                />
                <span className="text-sm font-medium text-rose-600 w-8 text-center bg-rose-50 rounded-lg px-2 py-0.5 group-hover:bg-rose-100 transition">
                  {level || '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interests Section */}
      <div className="card">
        <h3 className="text-xl font-semibold text-primary-900 mb-4">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  interests: prev.interests.includes(interest)
                    ? prev.interests.filter(i => i !== interest)
                    : [...prev.interests, interest]
                }));
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                formData.interests.includes(interest)
                  ? 'bg-primary-800 text-white shadow-sm hover:bg-primary-900'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Career Preferences */}
      <div className="card">
        <h3 className="text-xl font-semibold text-primary-900 mb-4">
          Career Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Remote Preference</label>
            <select
              value={formData.career_preferences.remote_preference}
              onChange={(e) => setFormData({
                ...formData,
                career_preferences: {
                  ...formData.career_preferences,
                  remote_preference: e.target.value as 'remote' | 'hybrid' | 'onsite'
                }
              })}
              className="input"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          <div>
            <label className="input-label">Job Type</label>
            <select
              value={formData.career_preferences.job_type}
              onChange={(e) => setFormData({
                ...formData,
                career_preferences: {
                  ...formData.career_preferences,
                  job_type: e.target.value as 'full_time' | 'part_time' | 'contract'
                }
              })}
              className="input"
            >
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3.5 text-base"
      >
        {loading ? 'Analyzing your profile...' : 'Get Career Recommendations'}
      </button>
    </form>
  );
}