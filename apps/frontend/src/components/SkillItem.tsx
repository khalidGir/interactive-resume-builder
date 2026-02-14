import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Skill } from '../types';

interface SkillItemProps {
  skill: Skill;
  index: number;
  onRemove: (index: number) => void;
  onLevelChange: (e: React.ChangeEvent<HTMLSelectElement>, index: number) => void;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill, index, onRemove, onLevelChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `skill-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="mr-2" {...attributes} {...listeners}>
            ☰
          </span>
          <div className="text-sm font-medium text-gray-900">{skill.name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={skill.level || 'Intermediate'}
          onChange={(e) => onLevelChange(e, index)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-900"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default SkillItem;