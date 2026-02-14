import React from 'react';
import { ResumeData } from '../types';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template?: 'modern' | 'classic' | 'minimal';
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, template = 'modern' }) => {
  switch (template) {
    case 'classic':
      return <ClassicTemplate resumeData={resumeData} />;
    case 'minimal':
      return <MinimalTemplate resumeData={resumeData} />;
    case 'modern':
    default:
      return <ModernTemplate resumeData={resumeData} />;
  }
};

export default ResumePreview;