import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, HomeIcon, CogIcon, LogOutIcon, FileTextIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">ResumeBuilder</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <HomeIcon className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  <HomeIcon className="h-6 w-6" />
                </Link>
                <Link
                  to="/resumes"
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  <FileTextIcon className="h-6 w-6" />
                </Link>
                <Link
                  to="/profile"
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  <UserIcon className="h-6 w-6" />
                </Link>

                <div className="relative ml-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                      {user?.name || user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <LogOutIcon className="mr-1 h-5 w-5" />
                      <span className="hidden md:block">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;