import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  resumeData: ResumeData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  const { profile, experiences, education, skills, projects, languages } = resumeData;

  return (
    <div className="font-serif text-base bg-white p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="border-b-2 border-black pb-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-black mb-2">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-lg text-black font-normal mb-4">{profile.jobTitle}</p>

        <div className="flex justify-center space-x-6 text-black text-sm">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>• {profile.phone}</span>}
          {profile.location && <span>• {profile.location}</span>}
        </div>
      </header>

      <div className="space-y-8">
        {/* Summary Section */}
        {profile.summary && (
          <section>
            <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">Summary</h2>
            <p className="text-black leading-relaxed">{profile.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-4">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-black text-base">{exp.position}</h3>
                      <p className="text-black font-medium">{exp.company}</p>
                    </div>
                    <span className="text-black text-sm">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && <p className="mt-2 text-black">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-black text-base">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className="text-black font-medium">{edu.institution}</p>
                    </div>
                    <span className="text-black text-sm">
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
            <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-black px-3 py-1 rounded text-sm font-medium"
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
            <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-4">Projects</h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-black text-base">{project.title}</h3>
                      <p className="text-black mt-1">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-gray-100 text-black px-2 py-0.5 rounded text-xs"
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
                        className="text-black hover:underline text-sm"
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
            <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">Languages</h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="flex">
                  <span className="font-medium text-black">{lang.language}</span>
                  <span className="text-black"> - {lang.proficiency}</span>
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
          .font-serif {
            font-family: Georgia, serif;
          }
        }
      `}</style>
    </div>
  );
};

export default ClassicTemplate;