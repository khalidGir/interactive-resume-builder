import apiClient from './api';
import { 
  BulletImprovementRequest, 
  BulletImprovementResponse,
  Experience,
  Project,
  Profile
} from '../types';

export const aiService = {
  // Improve a resume bullet point
  async improveBulletPoint(request: BulletImprovementRequest): Promise<BulletImprovementResponse> {
    const response = await apiClient.post<BulletImprovementResponse>('/ai/improve-bullet', request);
    return response.data;
  },

  // Improve experience description
  async improveExperienceDescription(description: string, role?: string): Promise<BulletImprovementResponse> {
    const request: BulletImprovementRequest = {
      text: description,
      role: role || 'professional'
    };
    return this.improveBulletPoint(request);
  },

  // Improve project description
  async improveProjectDescription(description: string): Promise<BulletImprovementResponse> {
    const request: BulletImprovementRequest = {
      text: description,
      role: 'professional'
    };
    return this.improveBulletPoint(request);
  },

  // Improve professional summary
  async improveSummary(summary: string): Promise<BulletImprovementResponse> {
    const request: BulletImprovementRequest = {
      text: summary,
      role: 'professional'
    };
    return this.improveBulletPoint(request);
  }
};