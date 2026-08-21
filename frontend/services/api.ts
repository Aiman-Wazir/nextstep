import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 429:
          // Rate limited - show message
          alert('Too many requests. Please try again later.');
          break;
        default:
          // Show error message
          const message = error.response.data.detail || 'An error occurred';
          alert(message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      alert('Network error. Please check your connection.');
    } else {
      // Other errors
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Service functions
export const api = {
  // Health check
  health: () => apiClient.get('/health'),
  
  // Careers
  getCareers: () => apiClient.get('/careers'),
  getCareer: (id: string) => apiClient.get(`/careers/${id}`),
  
  // Recommendations
  getRecommendations: (data: any) => apiClient.post('/recommend', data),
  
  // Roadmap
  generateRoadmap: (data: any) => apiClient.post('/roadmap', data),
  
  // Skill Gap
  analyzeSkillGap: (data: any) => apiClient.post('/skill-gap', data),
  
  // Profile
  getProfile: (userId: string) => apiClient.get(`/profile/${userId}`),
  updateProfile: (userId: string, data: any) => apiClient.put(`/profile/${userId}`, data),
  
  // Progress
  getProgress: (userId: string) => apiClient.get(`/progress/${userId}`),
  updateProgress: (userId: string, data: any) => apiClient.post(`/progress/${userId}`, data),
};