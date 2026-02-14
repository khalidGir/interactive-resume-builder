import React, { useState } from 'react';
import { Profile } from '../types';
import AiSuggestionModal from './AiSuggestionModal';

interface PersonalInfoFormProps {
  profile: Profile;
  onChange: (profile: Profile) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ profile, onChange }) => {
  const [formData, setFormData] = useState<Profile>(profile);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedProfile = {
      ...formData,
      [name]: value
    };
    setFormData(updatedProfile);
    onChange(updatedProfile);
  };

  const handleAiImprove = () => {
    if (formData.summary) {
      setShowAiModal(true);
    }
  };

  const handleApplyAiSuggestion = (improvedText: string) => {
    const updatedProfile = { ...formData, summary: improvedText };
    setFormData(updatedProfile);
    onChange(updatedProfile);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Professional Summary
          </label>
          {formData.summary && (
            <button
              type="button"
              onClick={handleAiImprove}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-1">✨</span> Improve with AI
            </button>
          )}
        </div>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showAiModal && formData.summary && (
        <AiSuggestionModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          originalText={formData.summary}
          onApply={handleApplyAiSuggestion}
          title="AI Professional Summary Improvement"
          description="Our AI has generated an improved version of your professional summary:"
        />
      )}
    </div>
  );
};

export default PersonalInfoForm;