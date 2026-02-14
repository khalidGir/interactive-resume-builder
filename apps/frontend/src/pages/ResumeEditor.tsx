import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useAuth } from '../contexts/AuthContext';
import { resumeService } from '../services/resumeService';
import { Resume, ResumeData, Profile, Experience, Education, Skill, Project, Language } from '../types';
import ResumePreview from '../components/ResumePreview';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import LanguagesSection from '../components/LanguagesSection';
import { useNavigate } from 'react-router-dom';

const ResumeEditor: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>({
    profile: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    languages: []
  });
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing resume if available
  useEffect(() => {
    const fetchResume = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const resumes = await resumeService.getAllResumes(token);
        if (resumes.length > 0) {
          // Load the first resume for editing
          setResumeData(resumes[0].data);
        }
      } catch (err) {
        setError('Failed to load resume data');
        console.error('Error loading resume:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [token]);

  const handleProfileChange = (profile: Profile) => {
    setResumeData(prev => ({
      ...prev,
      profile
    }));
  };

  const handleExperiencesChange = (experiences: Experience[]) => {
    setResumeData(prev => ({
      ...prev,
      experiences
    }));
  };

  const handleEducationChange = (education: Education[]) => {
    setResumeData(prev => ({
      ...prev,
      education
    }));
  };

  const handleSkillsChange = (skills: Skill[]) => {
    setResumeData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleProjectsChange = (projects: Project[]) => {
    setResumeData(prev => ({
      ...prev,
      projects
    }));
  };

  const handleLanguagesChange = (languages: Language[]) => {
    setResumeData(prev => ({
      ...prev,
      languages
    }));
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      // If we have an existing resume, update it; otherwise create a new one
      // For simplicity, we'll create/update a resume
      await resumeService.createResume(resumeData, token);
      alert('Resume saved successfully!');
      // Navigate back to resume management after saving
      navigate('/resumes');
    } catch (err) {
      setError('Failed to save resume');
      console.error('Error saving resume:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleDragEnd = (event: any) => {
    // This function will be expanded later to handle drag end events for different sections
    const { active, over } = event;
    
    if (!over) return;
    
    // Check if the drag happened within the same container
    if (active.id !== over.id) {
      // This is where we'll handle the reordering logic
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Resume Editor</h1>

          <div className="flex gap-6">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Resume Sections</h2>
                <nav>
                  <ul className="space-y-2">
                    {[
                      { id: 'profile', label: 'Personal Info' },
                      { id: 'experience', label: 'Experience' },
                      { id: 'education', label: 'Education' },
                      { id: 'skills', label: 'Skills' },
                      { id: 'projects', label: 'Projects' },
                      { id: 'languages', label: 'Languages' },
                    ].map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition ${
                            activeSection === section.id
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {section.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-6">
                  <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    id="template-select"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as 'modern' | 'classic' | 'minimal')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${
                      saving
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Resume'}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Editor Area and Preview */}
            <div className="flex-1 flex gap-6">
              {/* Main Editor Area */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Render active section form */}
                  {activeSection === 'profile' && (
                    <PersonalInfoForm
                      profile={resumeData.profile}
                      onChange={handleProfileChange}
                    />
                  )}
                  {activeSection === 'experience' && (
                    <ExperienceSection
                      experiences={resumeData.experiences || []}
                      onChange={handleExperiencesChange}
                    />
                  )}
                  {activeSection === 'education' && (
                    <EducationSection
                      education={resumeData.education || []}
                      onChange={handleEducationChange}
                    />
                  )}
                  {activeSection === 'skills' && (
                    <SkillsSection
                      skills={resumeData.skills || []}
                      onChange={handleSkillsChange}
                    />
                  )}
                  {activeSection === 'projects' && (
                    <ProjectsSection
                      projects={resumeData.projects || []}
                      onChange={handleProjectsChange}
                    />
                  )}
                  {activeSection === 'languages' && (
                    <LanguagesSection
                      languages={resumeData.languages || []}
                      onChange={handleLanguagesChange}
                    />
                  )}
                </div>
              </div>

              {/* Preview Panel */}
              <div className="w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow p-4 sticky top-4 h-fit">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">Preview</h2>
                  <ResumePreview resumeData={resumeData} template={template} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default ResumeEditor;