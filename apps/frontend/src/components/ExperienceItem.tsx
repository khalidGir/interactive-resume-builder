import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Experience } from '../types';
import AiSuggestionModal from './AiSuggestionModal';

interface ExperienceItemProps {
  experience: Experience;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedExperience: Experience) => void;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience, index, onRemove, onUpdate }) => {
  const [showAiModal, setShowAiModal] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `experience-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAiImprove = () => {
    if (experience.description) {
      setShowAiModal(true);
    }
  };

  const handleApplyAiSuggestion = (improvedText: string) => {
    const updatedExperience = { ...experience, description: improvedText };
    onUpdate(index, updatedExperience);
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
        <div>
          <h4 className="font-bold text-gray-800">{experience.position}</h4>
          <p className="text-gray-600">{experience.company}</p>
          <p className="text-sm text-gray-500">
            {experience.startDate} - {experience.currentlyWorking ? 'Present' : experience.endDate || 'Not specified'}
          </p>
          {experience.description && (
            <div className="mt-2">
              <p className="text-gray-700">{experience.description}</p>
              <button
                type="button"
                onClick={handleAiImprove}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span className="mr-1">✨</span> Improve with AI
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
      <div className="mt-2 text-gray-500 text-xs">
        Drag to reorder
      </div>

      {showAiModal && experience.description && (
        <AiSuggestionModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          originalText={experience.description}
          onApply={handleApplyAiSuggestion}
          title="AI Experience Description Improvement"
          description="Our AI has generated an improved version of your experience description:"
        />
      )}
    </div>
  );
};

export default ExperienceItem;