import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExperienceSection from '../ExperienceSection';
import { Experience } from '../../../types';

describe('ExperienceSection', () => {
  const mockOnChange = jest.fn();
  const mockExperiences: Experience[] = [
    {
      id: '1',
      company: 'Test Company',
      position: 'Test Position',
      startDate: '2020-01',
      endDate: '2021-01',
      description: 'Test description',
      currentlyWorking: false
    }
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders the ExperienceSection component', () => {
    render(<ExperienceSection experiences={mockExperiences} onChange={mockOnChange} />);
    
    expect(screen.getByText(/Work Experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date \*/i)).toBeInTheDocument();
  });

  it('displays existing experiences', () => {
    render(<ExperienceSection experiences={mockExperiences} onChange={mockOnChange} />);
    
    expect(screen.getByText('Test Position')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('allows adding a new experience', () => {
    render(<ExperienceSection experiences={[]} onChange={mockOnChange} />);
    
    fireEvent.change(screen.getByLabelText(/Company \*/i), {
      target: { value: 'New Company' }
    });
    fireEvent.change(screen.getByLabelText(/Position \*/i), {
      target: { value: 'New Position' }
    });
    fireEvent.change(screen.getByLabelText(/Start Date \*/i), {
      target: { value: '2022-01' }
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'New description' }
    });
    
    fireEvent.click(screen.getByText(/Add Experience/i));
    
    expect(mockOnChange).toHaveBeenCalledWith([
      expect.objectContaining({
        company: 'New Company',
        position: 'New Position',
        startDate: '2022-01',
        description: 'New description'
      })
    ]);
  });

  it('allows removing an experience', () => {
    render(<ExperienceSection experiences={mockExperiences} onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText(/Remove/i));
    
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});