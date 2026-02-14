// Mock API service for development without backend
// This simulates the backend API responses for local development

import { Resume, ResumeData, User, BulletImprovementRequest, BulletImprovementResponse } from '../types';

// Mock data storage
let mockUsers: User[] = [];
let mockResumes: Resume[] = [];
let mockAuthToken: string | null = null;

// Helper function to generate IDs
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper function to get current timestamp
const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Mock authentication service
export const mockAuthService = {
  async login(email: string, password: string) {
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real scenario, we'd verify the password
    // For mock, we'll just return the user
    
    // Generate a mock token
    mockAuthToken = `mock_token_${user.id}`;
    
    return {
      accessToken: mockAuthToken,
      user: user
    };
  },

  async signup(email: string, password: string) {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: generateId(),
      email,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    mockUsers.push(newUser);
    
    // Generate a mock token
    mockAuthToken = `mock_token_${newUser.id}`;
    
    return {
      accessToken: mockAuthToken,
      user: newUser
    };
  },

  async logout() {
    mockAuthToken = null;
  },

  isAuthenticated() {
    return !!mockAuthToken;
  }
};

// Mock resume service
export const mockResumeService = {
  async getAllResumes(): Promise<Resume[]> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    // Return resumes for the authenticated user
    const userId = mockAuthToken.split('_')[2]; // Extract user ID from mock token
    return mockResumes.filter(resume => resume.userId === userId);
  },

  async getResumeById(id: string): Promise<Resume> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    const resume = mockResumes.find(r => r.id === id);
    
    if (!resume) {
      throw new Error('Resume not found');
    }
    
    return resume;
  },

  async createResume(resumeData: ResumeData): Promise<Resume> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    // Extract user ID from mock token
    const userId = mockAuthToken.split('_')[2];
    
    const newResume: Resume = {
      id: generateId(),
      userId,
      data: resumeData,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    mockResumes.push(newResume);
    
    return newResume;
  },

  async updateResume(id: string, resumeData: ResumeData): Promise<Resume> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    const index = mockResumes.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Resume not found');
    }
    
    // Update the resume
    mockResumes[index] = {
      ...mockResumes[index],
      data: resumeData,
      updatedAt: getCurrentTimestamp()
    };
    
    return mockResumes[index];
  },

  async deleteResume(id: string): Promise<void> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    const index = mockResumes.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Resume not found');
    }
    
    mockResumes.splice(index, 1);
  },

  async exportResumeAsPdf(id: string): Promise<Blob> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    // In a real scenario, this would return a PDF blob
    // For mock, we'll return a simple text blob
    const content = `Mock PDF content for resume ID: ${id}`;
    return new Blob([content], { type: 'application/pdf' });
  }
};

// Mock AI service
export const mockAiService = {
  async improveBulletPoint(request: BulletImprovementRequest): Promise<BulletImprovementResponse> {
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }
    
    // Simulate AI improvement
    // In a real scenario, this would call an AI service
    const verbs = ['Spearheaded', 'Drove', 'Optimized', 'Engineered', 'Delivered'];
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    
    const improvedText = `${randomVerb} ${request.text} resulting in measurable improvements`;
    
    return {
      improvedText
    };
  }
};

// Initialize with some sample data
export const initializeMockData = () => {
  // Add a sample user
  const sampleUser: User = {
    id: 'sample_user_id',
    email: 'sample@example.com',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  
  mockUsers.push(sampleUser);
  
  // Add a sample resume
  const sampleResume: Resume = {
    id: 'sample_resume_id',
    userId: sampleUser.id,
    data: {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Software Engineer',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        location: 'New York, NY',
        summary: 'Experienced software engineer with expertise in web development.'
      },
      experiences: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01-01',
          endDate: '2023-01-01',
          description: 'Led development of web applications.',
          currentlyWorking: false
        }
      ],
      education: [
        {
          institution: 'University of Tech',
          degree: 'BS Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016-09-01',
          endDate: '2020-05-01'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Expert' },
        { name: 'React', level: 'Advanced' },
        { name: 'Node.js', level: 'Advanced' }
      ]
    },
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  
  mockResumes.push(sampleResume);
};

// Reset mock data
export const resetMockData = () => {
  mockUsers = [];
  mockResumes = [];
  mockAuthToken = null;
};