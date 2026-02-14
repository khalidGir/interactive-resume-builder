import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Language } from '../types';

interface LanguageItemProps {
  language: Language;
  index: number;
  onRemove: (index: number) => void;
  onProficiencyChange: (e: React.ChangeEvent<HTMLSelectElement>, index: number) => void;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ language, index, onRemove, onProficiencyChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `language-${index}` });

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
          <div className="text-sm font-medium text-gray-900">{language.language}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={language.proficiency || 'Professional'}
          onChange={(e) => onProficiencyChange(e, index)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Elementary">Elementary</option>
          <option value="Limited">Limited</option>
          <option value="Professional">Professional</option>
          <option value="Native">Native</option>
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

export default LanguageItem;