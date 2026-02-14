import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { BulletImprovementRequest } from '../types';

interface AiSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  onApply: (improvedText: string) => void;
  title?: string;
  description?: string;
}

const AiSuggestionModal: React.FC<AiSuggestionModalProps> = ({
  isOpen,
  onClose,
  originalText,
  onApply,
  title = 'AI Improvement Suggestion',
  description = 'Our AI has generated an improved version of your text:'
}) => {
  const [improvedText, setImprovedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      generateSuggestion();
    }
  }, [isOpen]);

  const generateSuggestion = async () => {
    if (!originalText.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const request: BulletImprovementRequest = {
        text: originalText,
        role: 'professional'
      };
      
      const response = await aiService.improveBulletPoint(request);
      setImprovedText(response.improvedText);
    } catch (err) {
      console.error('Error generating AI suggestion:', err);
      setError('Failed to generate AI suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (improvedText.trim()) {
      onApply(improvedText);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Original:</h3>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-gray-800">{originalText}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">AI Improved:</h3>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-gray-800">{improvedText || 'Generating suggestion...'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dismiss
            </button>
            <button
              onClick={handleApply}
              disabled={loading || !improvedText.trim()}
              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || !improvedText.trim()
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Apply Suggestion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestionModal;