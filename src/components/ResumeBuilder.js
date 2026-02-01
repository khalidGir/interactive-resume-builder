import React, { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import SkillsForm from './SkillsForm';
import ResumePreview from './ResumePreview';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    education: [],
    experience: [],
    skills: []
  });

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="resume-builder">
      <h2>Create Your Resume</h2>
      
      <PersonalInfoForm 
        data={resumeData.personalInfo} 
        onUpdate={(data) => updateResumeData('personalInfo', data)} 
      />
      
      <EducationForm 
        data={resumeData.education} 
        onUpdate={(data) => updateResumeData('education', data)} 
      />
      
      <ExperienceForm 
        data={resumeData.experience} 
        onUpdate={(data) => updateResumeData('experience', data)} 
      />
      
      <SkillsForm 
        data={resumeData.skills} 
        onUpdate={(data) => updateResumeData('skills', data)} 
      />
      
      <ResumePreview resumeData={resumeData} />
    </div>
  );
};

export default ResumeBuilder;