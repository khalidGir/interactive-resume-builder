import React from 'react';
import { render, screen } from '@testing-library/react';
import ResumePreview from '../ResumePreview';
import { ResumeData } from '../../types';

describe('ResumePreview', () => {
  const mockResumeData: ResumeData = {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      location: 'New York, NY',
      summary: 'Experienced software engineer with expertise in React and TypeScript.'
    },
    experiences: [
      {
        id: '1',
        company: 'ABC Corp',
        position: 'Frontend Developer',
        startDate: '2020-01',
        endDate: '2022-01',
        description: 'Developed user interfaces using React and TypeScript.',
        currentlyWorking: false
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Example',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: 3.8
      }
    ],
    skills: [
      { id: '1', name: 'React', level: 'Expert' },
      { id: '2', name: 'TypeScript', level: 'Advanced' }
    ],
    projects: [
      {
        id: '1',
        title: 'Example Project',
        description: 'A sample project demonstrating React and TypeScript skills.',
        link: 'https://example.com',
        technologies: ['React', 'TypeScript', 'Tailwind CSS']
      }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Intermediate' }
    ]
  };

  it('renders the ResumePreview component with default template', () => {
    render(<ResumePreview resumeData={mockResumeData} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Experienced software engineer with expertise in React and TypeScript.')).toBeInTheDocument();
  });

  it('renders the ResumePreview component with modern template', () => {
    render(<ResumePreview resumeData={mockResumeData} template="modern" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders the ResumePreview component with classic template', () => {
    render(<ResumePreview resumeData={mockResumeData} template="classic" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders the ResumePreview component with minimal template', () => {
    render(<ResumePreview resumeData={mockResumeData} template="minimal" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('displays experience information', () => {
    render(<ResumePreview resumeData={mockResumeData} />);
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('ABC Corp')).toBeInTheDocument();
    expect(screen.getByText('Developed user interfaces using React and TypeScript.')).toBeInTheDocument();
  });

  it('displays education information', () => {
    render(<ResumePreview resumeData={mockResumeData} />);
    
    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Example')).toBeInTheDocument();
  });

  it('displays skills information', () => {
    render(<ResumePreview resumeData={mockResumeData} />);
    
    expect(screen.getByText('React (Expert)')).toBeInTheDocument();
    expect(screen.getByText('TypeScript (Advanced)')).toBeInTheDocument();
  });

  it('displays projects information', () => {
    render(<ResumePreview resumeData={mockResumeData} />);
    
    expect(screen.getByText('Example Project')).toBeInTheDocument();
    expect(screen.getByText('A sample project demonstrating React and TypeScript skills.')).toBeInTheDocument();
  });

  it('displays languages information', () => {
    render(<ResumePreview resumeData={mockResumeData} />);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });
});