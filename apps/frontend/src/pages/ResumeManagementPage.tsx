import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resumeService } from '../services/resumeService';
import { Resume } from '../types';
import { FileTextIcon, PlusIcon, DownloadIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumeManagementPage: React.FC = () => {
  const { token } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const fetchedResumes = await resumeService.getAllResumes(token);
        setResumes(fetchedResumes);
      } catch (err) {
        setError('Failed to load resumes');
        console.error('Error loading resumes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [token]);

  const handleCreateNewResume = () => {
    // For now, we'll just navigate to the editor which will start with a blank resume
    navigate('/resumes/edit');
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    if (!token) return;

    try {
      await resumeService.deleteResume(id, token);
      setResumes(resumes.filter(resume => resume.id !== id));
    } catch (err) {
      setError('Failed to delete resume');
      console.error('Error deleting resume:', err);
    }
  };

  const handleExportResume = async (id: string) => {
    if (!token) return;

    try {
      const blob = await resumeService.exportResumeAsPdf(id, token);
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export resume as PDF');
      console.error('Error exporting resume:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
        <button
          onClick={handleCreateNewResume}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Create New Resume
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No resumes</h3>
          <p className="mt-1 text-gray-500">Get started by creating a new resume.</p>
          <div className="mt-6">
            <button
              onClick={handleCreateNewResume}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create New Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FileTextIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-800">Resume #{resume.id.substring(0, 8)}</h2>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Created:</span> {new Date(resume.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Updated:</span> {new Date(resume.updatedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => navigate('/resumes/edit')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleExportResume(resume.id)}
                    className="flex items-center text-green-600 hover:text-green-800"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                  </button>
                  
                  <button
                    onClick={() => handleDeleteResume(resume.id)}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeManagementPage;