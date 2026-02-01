import React from 'react';
import { exportToPDF, exportToText } from '../utils/exportUtils';

const ResumePreview = ({ resumeData }) => {
  const { personalInfo, education, experience, skills } = resumeData;

  const handleExportPDF = () => {
    exportToPDF('resume-content', `${personalInfo.fullName || 'resume'}.pdf`);
  };

  const handleExportText = () => {
    exportToText(resumeData, `${personalInfo.fullName || 'resume'}.txt`);
  };

  return (
    <div className="resume-preview">
      <div className="export-buttons">
        <button onClick={handleExportPDF} className="export-btn pdf-btn">Export to PDF</button>
        <button onClick={handleExportText} className="export-btn text-btn">Export to Text</button>
      </div>
      <div id="resume-content" className="resume-container">
        <header className="resume-header">
          <h1>{personalInfo.fullName || '[Your Name]'}</h1>
          <p className="contact-info">
            {personalInfo.email && `Email: ${personalInfo.email} | `}
            {personalInfo.phone && `Phone: ${personalInfo.phone} | `}
            {personalInfo.address && `Address: ${personalInfo.address}`}
          </p>
        </header>

        {personalInfo.summary && (
          <section className="summary">
            <h2>Professional Summary</h2>
            <p>{personalInfo.summary}</p>
          </section>
        )}

        <section className="education">
          <h2>Education</h2>
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <div key={index} className="education-item">
                <h3>{edu.degree} in {edu.fieldOfStudy}</h3>
                <p className="institution">{edu.institution}</p>
                <p className="date-range">{edu.startDate} - {edu.endDate || 'Present'}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            ))
          ) : (
            <p>No education information provided</p>
          )}
        </section>

        <section className="experience">
          <h2>Work Experience</h2>
          {experience && experience.length > 0 ? (
            experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <h3>{exp.jobTitle} at {exp.company}</h3>
                <p className="date-range">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </p>
                <p>{exp.responsibilities}</p>
              </div>
            ))
          ) : (
            <p>No work experience provided</p>
          )}
        </section>

        <section className="skills">
          <h2>Skills</h2>
          {skills && skills.length > 0 ? (
            <ul>
              {skills.filter(skill => skill.trim() !== '').map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills provided</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResumePreview;