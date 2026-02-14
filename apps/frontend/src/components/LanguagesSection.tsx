import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Language } from '../types';
import LanguageItem from './LanguageItem';

interface LanguagesSectionProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages, onChange }) => {
  const [languageName, setLanguageName] = useState('');
  const [proficiency, setProficiency] = useState<'Elementary' | 'Limited' | 'Professional' | 'Native'>('Professional');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddLanguage = () => {
    if (!languageName.trim()) {
      alert('Please enter a language name');
      return;
    }

    const newLanguage = {
      language: languageName.trim(),
      proficiency: proficiency
    };

    onChange([...languages, newLanguage]);
    setLanguageName('');
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    onChange(updatedLanguages);
  };

  const handleProficiencyChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], proficiency: e.target.value as any };
    onChange(updatedLanguages);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Extract indices from the IDs
      const oldIndex = Number(active.id.split('-')[1]);
      const newIndex = Number(over.id.split('-')[1]);
      
      const updatedLanguages = arrayMove(languages, oldIndex, newIndex);
      onChange(updatedLanguages);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Languages</h2>

        {/* Form to add new language */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Add New Language</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="languageName" className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <input
                type="text"
                id="languageName"
                value={languageName}
                onChange={(e) => setLanguageName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., English, Spanish, French"
                required
              />
            </div>

            <div>
              <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency
              </label>
              <select
                id="proficiency"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Elementary">Elementary</option>
                <option value="Limited">Limited</option>
                <option value="Professional">Professional</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddLanguage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Language
          </button>
        </div>

        {/* List of existing languages */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Current Languages</h3>

          {languages.length === 0 ? (
            <p className="text-gray-500 italic">No languages added yet</p>
          ) : (
            <SortableContext 
              items={languages.map((_, index) => `language-${index}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proficiency
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {languages.map((lang, index) => (
                      <LanguageItem 
                        key={`language-${index}`} 
                        language={lang} 
                        index={index}
                        onRemove={handleRemoveLanguage}
                        onProficiencyChange={handleProficiencyChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default LanguagesSection;