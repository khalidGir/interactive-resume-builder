import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Experience } from '../types';
import ExperienceItem from './ExperienceItem';

interface ExperienceSectionProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, onChange }) => {
  const [formData, setFormData] = useState<Experience>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    currentlyWorking: false
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddExperience = () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      alert('Please fill in required fields: Company, Position, and Start Date');
      return;
    }

    onChange([...experiences, { ...formData }]);
    // Reset form
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      currentlyWorking: false
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    onChange(updatedExperiences);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Extract indices from the IDs
      const oldIndex = Number(active.id.split('-')[1]);
      const newIndex = Number(over.id.split('-')[1]);
      
      const updatedExperiences = arrayMove(experiences, oldIndex, newIndex);
      onChange(updatedExperiences);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Work Experience</h2>

        {/* Form to add new experience */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Add New Experience</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                disabled={formData.currentlyWorking}
              />
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="currentlyWorking"
                    checked={formData.currentlyWorking}
                    onChange={handleInputChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleAddExperience}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Experience
          </button>
        </div>

        {/* List of existing experiences */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Current Experiences</h3>

          {experiences.length === 0 ? (
            <p className="text-gray-500 italic">No experiences added yet</p>
          ) : (
            <SortableContext 
              items={experiences.map((_, index) => `experience-${index}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <ExperienceItem 
                    key={`experience-${index}`} 
                    experience={exp} 
                    index={index}
                    onRemove={handleRemoveExperience}
                    onUpdate={(idx, updatedExp) => {
                      const updatedExperiences = [...experiences];
                      updatedExperiences[idx] = updatedExp;
                      onChange(updatedExperiences);
                    }}
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

export default ExperienceSection;