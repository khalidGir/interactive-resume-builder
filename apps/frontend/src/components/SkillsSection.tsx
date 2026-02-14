import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Skill } from '../types';
import SkillItem from './SkillItem';

interface SkillsSectionProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onChange }) => {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSkill = () => {
    if (!skillName.trim()) {
      alert('Please enter a skill name');
      return;
    }

    const newSkill = {
      name: skillName.trim(),
      level: skillLevel
    };

    onChange([...skills, newSkill]);
    setSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    onChange(updatedSkills);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], level: e.target.value as any };
    onChange(updatedSkills);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Extract indices from the IDs
      const oldIndex = Number(active.id.split('-')[1]);
      const newIndex = Number(over.id.split('-')[1]);
      
      const updatedSkills = arrayMove(skills, oldIndex, newIndex);
      onChange(updatedSkills);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Skills</h2>

        {/* Form to add new skill */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Add New Skill</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., JavaScript, Project Management"
                required
              />
            </div>

            <div>
              <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Skill
          </button>
        </div>

        {/* List of existing skills */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Current Skills</h3>

          {skills.length === 0 ? (
            <p className="text-gray-500 italic">No skills added yet</p>
          ) : (
            <SortableContext 
              items={skills.map((_, index) => `skill-${index}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skill
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {skills.map((skill, index) => (
                      <SkillItem 
                        key={`skill-${index}`} 
                        skill={skill} 
                        index={index}
                        onRemove={handleRemoveSkill}
                        onLevelChange={handleLevelChange}
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

export default SkillsSection;