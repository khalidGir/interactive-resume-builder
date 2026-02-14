import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '../types';
import AiSuggestionModal from './AiSuggestionModal';

interface ProjectItemProps {
  project: Project;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedProject: Project) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, index, onRemove, onUpdate }) => {
  const [showAiModal, setShowAiModal] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `project-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAiImprove = () => {
    if (project.description) {
      setShowAiModal(true);
    }
  };

  const handleApplyAiSuggestion = (improvedText: string) => {
    const updatedProject = { ...project, description: improvedText };
    onUpdate(index, updatedProject);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border border-gray-200 rounded-lg p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">{project.title}</h4>
          <div className="mt-1">
            <p className="text-gray-600">{project.description}</p>
            {project.description && (
              <button
                type="button"
                onClick={handleAiImprove}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span className="mr-1">✨</span> Improve with AI
              </button>
            )}
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {project.link}
            </a>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 ml-4"
        >
          Remove
        </button>
      </div>
      <div className="mt-2 text-gray-500 text-xs">
        Drag to reorder
      </div>

      {showAiModal && project.description && (
        <AiSuggestionModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          originalText={project.description}
          onApply={handleApplyAiSuggestion}
          title="AI Project Description Improvement"
          description="Our AI has generated an improved version of your project description:"
        />
      )}
    </div>
  );
};

export default ProjectItem;