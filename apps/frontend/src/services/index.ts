// API service factory that can switch between real API and mock API
// based on environment configuration

import { authService as realAuthService } from './authService';
import { resumeService as realResumeService } from './resumeService';
import { aiService as realAiService } from './aiService';
import { 
  mockAuthService, 
  mockResumeService, 
  mockAiService, 
  initializeMockData 
} from './mockApi';

// Check if we're in mock mode
const IS_MOCK_MODE = process.env.REACT_APP_API_MOCKING === 'true' || 
                   process.env.NODE_ENV === 'development' && 
                   process.env.REACT_APP_API_MOCKING !== 'false';

// Initialize mock data if in mock mode
if (IS_MOCK_MODE) {
  initializeMockData();
}

// Export services based on mode
export const authService = IS_MOCK_MODE ? mockAuthService : realAuthService;
export const resumeService = IS_MOCK_MODE ? mockResumeService : realResumeService;
export const aiService = IS_MOCK_MODE ? mockAiService : realAiService;

// Export the mode for debugging
export { IS_MOCK_MODE };

// Also export the raw services if needed
export {
  realAuthService,
  realResumeService,
  realAiService,
  mockAuthService,
  mockResumeService,
  mockAiService
};