import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Education } from '../types';

interface EducationItemProps {
  education: Education;
  index: number;
  onRemove: (index: number) => void;
}

const EducationItem: React.FC<EducationItemProps> = ({ education, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `education-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
          <h4 className="font-bold text-gray-800">{education.degree} in {education.fieldOfStudy}</h4>
          <p className="text-gray-600">{education.institution}</p>
          <p className="text-sm text-gray-500">
            {education.startDate} - {education.endDate || 'Present'}
          </p>
          {education.gpa && <p className="text-sm text-gray-500">GPA: {education.gpa}</p>}
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
    </div>
  );
};

export default EducationItem;