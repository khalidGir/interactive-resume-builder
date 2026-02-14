import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  resumeData: ResumeData;
}

const MinimalTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  const { profile, experiences, education, skills, projects, languages } = resumeData;

  return (
    <div className="font-sans text-base bg-white p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="pb-6 mb-6 border-b">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-4">{profile.jobTitle}</p>

        <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>• {profile.phone}</span>}
          {profile.location && <span>• {profile.location}</span>}
        </div>
      </header>

      <div className="space-y-8">
        {/* Summary Section */}
        {profile.summary && (
          <section>
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider mb-3 border-b pb-1">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider mb-3 border-b pb-1">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider mb-3 border-b pb-1">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                      {edu.gpa && `, GPA: ${edu.gpa}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider mb-3 border-b pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm"
                >
                  {skill.name} {skill.level && `(${skill.level})`}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider mb-3 border-b pb-1">Projects</h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider mb-3 border-b pb-1">Languages</h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang, index) => (
                <div key={index}>
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <span className="text-gray-600"> - {lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
          }
          .font-sans {
            font-family: Arial, sans-serif;
          }
        }
      `}</style>
    </div>
  );
};

export default MinimalTemplate;