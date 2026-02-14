import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResumeEditor from '../../pages/ResumeEditor';
import { AuthContext } from '../../contexts/AuthContext';
import { resumeService } from '../../services/resumeService';
import { ResumeData } from '../../types';

// Mock the services and contexts
jest.mock('../../services/resumeService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockGetAllResumes = resumeService.getAllResumes as jest.MockedFunction<typeof resumeService.getAllResumes>;
const mockCreateResume = resumeService.createResume as jest.MockedFunction<typeof resumeService.createResume>;

describe('ResumeEditor', () => {
  const mockToken = 'test-token';
  const mockResumeData: ResumeData = {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      location: 'New York, NY',
      summary: 'Experienced software engineer'
    },
    experiences: [
      {
        company: 'ABC Corp',
        position: 'Frontend Developer',
        startDate: '2020-01',
        endDate: '2022-01',
        description: 'Developed web applications',
        currentlyWorking: false
      }
    ],
    education: [],
    skills: [],
    projects: [],
    languages: []
  };

  const mockAuthContextValue = {
    token: mockToken,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    user: { id: '1', email: 'test@example.com', name: 'Test User' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllResumes.mockResolvedValue([{
      id: '1',
      userId: '1',
      data: mockResumeData,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }]);
    mockCreateResume.mockResolvedValue(undefined);
  });

  it('renders the ResumeEditor component', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ResumeEditor />
      </AuthContext.Provider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Resume Editor/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Personal Info/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Education/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Languages/i)).toBeInTheDocument();
  });

  it('loads existing resume data when available', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ResumeEditor />
      </AuthContext.Provider>
    );

    // Wait for the resume data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
  });

  it('switches between sections', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ResumeEditor />
      </AuthContext.Provider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/Resume Editor/i)).toBeInTheDocument();
    });

    // Click on Experience section
    fireEvent.click(screen.getByText(/Experience/i));

    // Verify that experience form elements are present
    expect(screen.getByLabelText(/Company \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position \*/i)).toBeInTheDocument();

    // Click on Skills section
    fireEvent.click(screen.getByText(/Skills/i));

    // Verify that skills form elements are present
    expect(screen.getByLabelText(/Skill Name \*/i)).toBeInTheDocument();
  });

  it('updates profile information', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ResumeEditor />
      </AuthContext.Provider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/Resume Editor/i)).toBeInTheDocument();
    });

    // Change first name
    fireEvent.change(screen.getByLabelText(/First Name \*/i), {
      target: { value: 'Jane' }
    });

    // Verify the change
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
  });

  it('shows template selector', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ResumeEditor />
      </AuthContext.Provider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/Resume Editor/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Template/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('allows template selection', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ResumeEditor />
      </AuthContext.Provider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/Resume Editor/i)).toBeInTheDocument();
    });

    // Select a different template
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'classic' }
    });

    // Verify the selection
    expect(screen.getByRole('combobox')).toHaveValue('classic');
  });
});