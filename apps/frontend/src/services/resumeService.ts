import apiClient from './api';
import { Resume, ResumeData } from '../types';

// Mock resume data for demonstration
let MOCK_RESUMES: Resume[] = [];

export const resumeService = {
  // Get all resumes for the authenticated user
  async getAllResumes(token: string): Promise<Resume[]> {
    try {
      const response = await apiClient.get<Resume[]>('/resumes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock resumes for demo purposes');
      return MOCK_RESUMES;
    }
  },

  // Get a specific resume by ID
  async getResumeById(id: string, token: string): Promise<Resume> {
    try {
      const response = await apiClient.get<Resume>(`/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock resume for demo purposes');
      const resume = MOCK_RESUMES.find(r => r.id === id);
      if (!resume) {
        throw new Error('Resume not found');
      }
      return resume;
    }
  },

  // Create a new resume
  async createResume(resumeData: ResumeData, token: string): Promise<Resume> {
    try {
      const response = await apiClient.post<Resume>('/resumes', { data: resumeData }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock resume creation for demo purposes');
      const newResume: Resume = {
        id: String(Date.now()),
        userId: 'mock-user-id',
        data: resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_RESUMES.push(newResume);
      return newResume;
    }
  },

  // Update an existing resume
  async updateResume(id: string, resumeData: ResumeData, token: string): Promise<Resume> {
    try {
      const response = await apiClient.put<Resume>(`/resumes/${id}`, { data: resumeData }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock resume update for demo purposes');
      const index = MOCK_RESUMES.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Resume not found');
      }
      const updatedResume = {
        ...MOCK_RESUMES[index],
        data: resumeData,
        updatedAt: new Date().toISOString()
      };
      MOCK_RESUMES[index] = updatedResume;
      return updatedResume;
    }
  },

  // Delete a resume
  async deleteResume(id: string, token: string): Promise<void> {
    try {
      await apiClient.delete(`/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock resume deletion for demo purposes');
      MOCK_RESUMES = MOCK_RESUMES.filter(r => r.id !== id);
    }
  },

  // Export resume as PDF
  async exportResumeAsPdf(id: string, token: string): Promise<Blob> {
    try {
      const response = await apiClient.post<Blob>(
        `/resumes/${id}/export/pdf`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for handling binary data
        }
      );

      return response.data;
    } catch (error) {
      // If API fails, return a mock blob
      console.log('Using mock PDF export for demo purposes');
      return new Blob(['Mock PDF content'], { type: 'application/pdf' });
    }
  }
};