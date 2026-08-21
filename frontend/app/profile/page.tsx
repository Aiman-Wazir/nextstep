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

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

    try {
      const response = await fetch('http://localhost:8000/api/v1/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: formData.skills,
          interests: formData.interests,
          education: formData.education,
          experience_level: formData.experience_level
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Store recommendations in session storage
        sessionStorage.setItem('recommendations', JSON.stringify(data.recommendations));
        router.push('/recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Education</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Statistics">Statistics</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Technical Skills (Rate 1-5)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SKILLS.map(skill => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-28 truncate">{skill}</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.skills[skill] || 0}
                    onChange={(e) => handleSkillChange(skill, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{formData.skills[skill] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Interests</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {INTERESTS.map(interest => (
                <label key={interest} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Analyzing...' : 'Get Career Recommendations'}
          </button>
        </form>
      </div>
    </main>
  );
}