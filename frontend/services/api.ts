import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Use relative path for Next.js rewrites or direct URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
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
      console.error('API Error:', error.response.data);
      
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 429:
          alert('Too many requests. Please try again later.');
          break;
        default:
          const message = error.response.data.detail || 'An error occurred';
          alert(message);
      }
    } else if (error.request) {
      console.error('Network Error:', error.request);
      alert('Network error. Please check your connection.');
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