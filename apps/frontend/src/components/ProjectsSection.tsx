import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Project } from '../types';
import ProjectItem from './ProjectItem';

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onChange }) => {
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    link: '',
    technologies: []
  });
  const [technologyInput, setTechnologyInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTechnology = () => {
    if (technologyInput.trim() && !formData.technologies?.includes(technologyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), technologyInput.trim()]
      }));
      setTechnologyInput('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(tech => tech !== techToRemove) || []
    }));
  };

  const handleAddProject = () => {
    if (!formData.title || !formData.description) {
      alert('Please enter a project title and description');
      return;
    }

    onChange([...projects, { ...formData }]);
    // Reset form
    setFormData({
      title: '',
      description: '',
      link: '',
      technologies: []
    });
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    onChange(updatedProjects);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Extract indices from the IDs
      const oldIndex = Number(active.id.split('-')[1]);
      const newIndex = Number(over.id.split('-')[1]);
      
      const updatedProjects = arrayMove(projects, oldIndex, newIndex);
      onChange(updatedProjects);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>

        {/* Form to add new project */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Add New Project</h3>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
              Project Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used
            </label>
            <div className="flex">
              <input
                type="text"
                value={technologyInput}
                onChange={(e) => setTechnologyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a technology (press Enter)"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            {formData.technologies && formData.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1.5 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-800 hover:bg-blue-200 hover:text-blue-900 focus:outline-none focus:bg-blue-200 focus:text-blue-900"
                    >
                      <span className="sr-only">Remove</span>
                      <span>×</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddProject}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Project
          </button>
        </div>

        {/* List of existing projects */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Current Projects</h3>

          {projects.length === 0 ? (
            <p className="text-gray-500 italic">No projects added yet</p>
          ) : (
            <SortableContext 
              items={projects.map((_, index) => `project-${index}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <ProjectItem 
                    key={`project-${index}`} 
                    project={project} 
                    index={index}
                    onRemove={handleRemoveProject}
                    onUpdate={(idx, updatedProj) => {
                      const updatedProjects = [...projects];
                      updatedProjects[idx] = updatedProj;
                      onChange(updatedProjects);
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

export default ProjectsSection;