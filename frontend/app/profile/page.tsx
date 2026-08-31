'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SKILLS = [
  'python', 'javascript', 'sql', 'machine_learning', 'deep_learning',
  'tensorflow', 'pytorch', 'react', 'nodejs', 'docker', 'kubernetes',
  'aws', 'git', 'nlp', 'computer_vision', 'data_visualization', 'statistics'
];

const INTERESTS = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Web Development', 'Cloud Computing', 'Cybersecurity',
  'Data Analytics', 'UI/UX', 'Software Engineering'
];

const EDUCATION_OPTIONS = [
  'Computer Science', 'Data Science', 'AI/ML', 'Software Engineering',
  'Information Technology', 'Mathematics', 'Statistics', 'Other'
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    experience_level: 0,
    skills: {} as Record<string, number>,
    interests: [] as string[]
  });

  const handleSkillChange = (skill: string, level: number) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: level }
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
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
    if (Object.keys(formData.skills).length === 0) {
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
      const payload = {
        skills: formData.skills,
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
        router.push('/recommendations');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Unable to connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">Create Your Profile</h1>
          <p className="section-subtitle">Fill in your details to get personalized career recommendations</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <h2 className="text-base font-semibold text-primary-900 mb-4">Personal Information</h2>
            
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
                >
                  <option value={0}>Entry Level</option>
                  <option value={1}>Junior</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Senior</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-base font-semibold text-primary-900 mb-2">Technical Skills</h2>
            <p className="text-sm text-primary-500 mb-4">Rate your proficiency from 1 (Beginner) to 5 (Expert)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SKILLS.map(skill => (
                <div key={skill} className="flex items-center gap-3 group">
                  <span className="text-sm font-medium text-primary-700 w-28 truncate">{skill}</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.skills[skill] || 0}
                    onChange={(e) => handleSkillChange(skill, parseInt(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: formData.skills[skill] && formData.skills[skill] > 0 
                        ? `linear-gradient(to right, #BE185D 0%, #BE185D ${(formData.skills[skill] / 5) * 100}%, #E2E8F0 ${(formData.skills[skill] / 5) * 100}%, #E2E8F0 100%)`
                        : '#E2E8F0'
                    }}
                  />
                  <span className="text-sm font-medium text-rose-600 w-8 text-center bg-rose-50 rounded-lg px-2 py-0.5 group-hover:bg-rose-100 transition">
                    {formData.skills[skill] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="card">
            <h2 className="text-base font-semibold text-primary-900 mb-2">Interests</h2>
            <p className="text-sm text-primary-500 mb-4">Select all that apply</p>
            
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
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

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base"
          >
            {loading ? 'Analyzing your profile...' : 'Get Career Recommendations'}
          </button>
        </form>
      </div>
    </main>
  );
}