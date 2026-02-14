import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const benefits = [
    'AI-powered resume suggestions',
    'ATS-friendly templates',
    'Real-time preview',
    'Free forever plan',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-12 bg-gradient-to-br from-primary-600 to-primary-700">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-display">
              ResumeAI
            </span>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Land Your Dream Job with a Resume That Stands Out
          </h2>
          <p className="text-lg text-primary-100">
            Join thousands of students who've landed interviews at top companies.
          </p>
          
          <div className="space-y-4 pt-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-primary-200">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 font-display">
                ResumeAI
              </span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
