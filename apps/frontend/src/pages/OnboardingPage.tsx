import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Briefcase, 
  GraduationCap, 
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Button, Card, Input, Badge } from '../components/ui';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [selectedTemplate, setSelectedTemplate] = useState('modern-pro');
  const [jobTitle, setJobTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [major, setMajor] = useState('');
  const [hasExperience, setHasExperience] = useState<boolean | null>(null);
  const [experience, setExperience] = useState({ company: '', role: '', achievement: '' });

  const totalSteps = 4;

  const templates = [
    { id: 'modern-pro', name: 'Modern Professional', category: 'Professional', color: 'from-blue-500 to-blue-600' },
    { id: 'minimal', name: 'Clean Minimal', category: 'Minimal', color: 'from-gray-500 to-gray-600' },
    { id: 'creative', name: 'Creative Bold', category: 'Creative', color: 'from-purple-500 to-pink-500' },
  ];

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      setIsLoading(true);
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate && jobTitle;
      case 2:
        return firstName && lastName && email;
      case 3:
        return hasExperience !== null;
      case 4:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">ResumeAI</span>
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <Badge variant="primary" className="mb-4">Step 1</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">
                  Let's Create Your First Resume
                </h1>
                <p className="text-gray-600">
                  Choose a template and tell us about your target role. This takes less than 2 minutes.
                </p>
              </div>

              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose a Template
                  </label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTemplate === template.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`aspect-[3/4] rounded-lg bg-gradient-to-br ${template.color} mb-3`} />
                        <p className="font-semibold text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-500">{template.category}</p>
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Title */}
                <Input
                  label="What's your target job title?"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  leftIcon={<Briefcase className="w-5 h-5" />}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Quick Profile */}
          {currentStep === 2 && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <Badge variant="primary" className="mb-4">Step 2</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">
                  Tell Us About Yourself
                </h1>
                <p className="text-gray-600">
                  We'll use this to personalize your resume and suggestions.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    leftIcon={<User className="w-5 h-5" />}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Education
                  </label>
                  <div className="space-y-4">
                    <Input
                      label="School/University"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="e.g., Stanford University"
                      leftIcon={<GraduationCap className="w-5 h-5" />}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Major/Field of Study"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                      <Input
                        label="Graduation Year"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        placeholder="e.g., 2024"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <Badge variant="primary" className="mb-4">Step 3</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">
                  Any Work Experience?
                </h1>
                <p className="text-gray-600">
                  Don't worry if you don't have any yet. You can always add it later.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setHasExperience(true)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      hasExperience === true
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Yes, I have experience</h3>
                    <p className="text-sm text-gray-500">Add internships, part-time jobs, or volunteer work</p>
                  </button>

                  <button
                    onClick={() => setHasExperience(false)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      hasExperience === false
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4">
                      <GraduationCap className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">No experience yet</h3>
                    <p className="text-sm text-gray-500">Focus on your education, skills, and projects</p>
                  </button>
                </div>

                {hasExperience && (
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4 animate-fade-in">
                    <h4 className="font-semibold text-gray-900">Add your most recent experience</h4>
                    <Input
                      label="Company/Organization"
                      value={experience.company}
                      onChange={(e) => setExperience({ ...experience, company: e.target.value })}
                      placeholder="e.g., Google"
                    />
                    <Input
                      label="Role/Position"
                      value={experience.role}
                      onChange={(e) => setExperience({ ...experience, role: e.target.value })}
                      placeholder="e.g., Software Engineering Intern"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Key Achievement
                      </label>
                      <textarea
                        value={experience.achievement}
                        onChange={(e) => setExperience({ ...experience, achievement: e.target.value })}
                        placeholder="e.g., Improved application performance by 40% through code optimization"
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Preview & Complete */}
          {currentStep === 4 && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <Badge variant="success" className="mb-4">Final Step</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">
                  You're All Set!
                </h1>
                <p className="text-gray-600">
                  Here's a preview of your resume. You can edit it anytime in the dashboard.
                </p>
              </div>

              <Card className="mb-6">
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                  {/* Mock Resume Preview */}
                  <div className="space-y-6">
                    <div className="text-center border-b border-gray-200 pb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{firstName} {lastName}</h2>
                      <p className="text-primary-600 font-medium">{jobTitle}</p>
                      <p className="text-gray-500 text-sm mt-1">{email}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                      <p className="text-gray-700">{school}</p>
                      <p className="text-gray-500 text-sm">{major} • Expected Graduation: {graduationYear}</p>
                    </div>

                    {hasExperience && experience.company && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                        <p className="text-gray-700 font-medium">{experience.role}</p>
                        <p className="text-gray-500 text-sm">{experience.company}</p>
                        {experience.achievement && (
                          <p className="text-gray-600 text-sm mt-1">• {experience.achievement}</p>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        <span>AI will suggest improvements as you edit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="bg-primary-50 rounded-xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-gray-600 text-sm">
                    Your resume is now in your dashboard. Click "Edit" to add more sections like skills, 
                    projects, and customize it further with our AI assistant.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentStep < totalSteps && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                >
                  Skip for now
                </Button>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                isLoading={isLoading}
                rightIcon={isLoading ? undefined : <ArrowRight className="w-5 h-5" />}
              >
                {currentStep === totalSteps ? 'Go to Dashboard' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
