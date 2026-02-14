import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  resumeData: ResumeData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  const { profile, experiences, education, skills, projects, languages } = resumeData;

  return (
    <div className="font-sans text-sm bg-white p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="border-b-2 border-blue-600 pb-6 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-xl text-blue-600 font-semibold mb-4">{profile.jobTitle}</p>

          <div className="flex justify-center space-x-6 text-gray-600">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>• {profile.phone}</span>}
            {profile.location && <span>• {profile.location}</span>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Summary, Skills, Languages */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary Section */}
          {profile.summary && (
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-blue-600 border-b pb-2 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
            </section>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-blue-600 border-b pb-2 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill.name} {skill.level && `(${skill.level})`}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-blue-600 border-b pb-2 mb-3">Languages</h2>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Experience, Education, Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience Section */}
          {experiences && experiences.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Experience</h2>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Education</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
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

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Projects</h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                        <p className="text-gray-700 mt-1">{project.description}</p>
                        
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
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
        </div>
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

export default ModernTemplate;