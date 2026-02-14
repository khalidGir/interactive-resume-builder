import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Education } from '../types';
import EducationItem from './EducationItem';

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, onChange }) => {
  const [formData, setFormData] = useState<Education>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gpa: undefined
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' && value ? parseFloat(value) : value
    }));
  };

  const handleAddEducation = () => {
    if (!formData.institution || !formData.degree || !formData.fieldOfStudy || !formData.startDate) {
      alert('Please fill in required fields: Institution, Degree, Field of Study, and Start Date');
      return;
    }

    onChange([...education, { ...formData }]);
    // Reset form
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: undefined
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    onChange(updatedEducation);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Extract indices from the IDs
      const oldIndex = Number(active.id.split('-')[1]);
      const newIndex = Number(over.id.split('-')[1]);
      
      const updatedEducation = arrayMove(education, oldIndex, newIndex);
      onChange(updatedEducation);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Education</h2>

        {/* Form to add new education */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Add New Education</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-1">
                GPA
              </label>
              <input
                type="number"
                id="gpa"
                name="gpa"
                value={formData.gpa || ''}
                onChange={handleInputChange}
                min="0"
                max="4"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="month"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddEducation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Education
          </button>
        </div>

        {/* List of existing education */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Current Education</h3>

          {education.length === 0 ? (
            <p className="text-gray-500 italic">No education added yet</p>
          ) : (
            <SortableContext 
              items={education.map((_, index) => `education-${index}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <EducationItem 
                    key={`education-${index}`} 
                    education={edu} 
                    index={index}
                    onRemove={handleRemoveEducation}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default EducationSection;