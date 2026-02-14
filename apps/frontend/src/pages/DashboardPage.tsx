import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Download, 
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Zap,
  Lightbulb,
  ArrowRight,
  LayoutGrid,
  List
} from 'lucide-react';
import { Card, CardContent, Button, Badge, Skeleton } from '../components/ui';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [resumes, setResumes] = useState<any[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setResumes([
        {
          id: '1',
          name: 'Software Engineer Resume',
          targetRole: 'Software Engineer',
          template: 'Modern Professional',
          lastEdited: '2 hours ago',
          completion: 85,
          status: 'in-progress',
        },
        {
          id: '2',
          name: 'Marketing Specialist',
          targetRole: 'Marketing Manager',
          template: 'Creative Bold',
          lastEdited: '3 days ago',
          completion: 100,
          status: 'complete',
        },
      ]);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const tips = [
    { icon: Lightbulb, text: 'Add quantifiable achievements to stand out', color: 'text-warning-500' },
    { icon: Sparkles, text: 'Use action verbs like "Led", "Created", "Improved"', color: 'text-primary-500' },
    { icon: Zap, text: 'Tailor your resume for each job application', color: 'text-secondary-500' },
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(r => r.id !== id));
    setShowActionMenu(null);
  };

  const handleDuplicate = (resume: any) => {
    const newResume = { ...resume, id: Date.now().toString(), name: `${resume.name} (Copy)` };
    setResumes([newResume, ...resumes]);
    setShowActionMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="mt-1 text-gray-600">
                You're <span className="font-semibold text-primary-600">85%</span> closer to landing your dream job
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/resumes/new')}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary Action Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Create New Resume Card */}
              <Card 
                className="relative overflow-hidden group cursor-pointer border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50/30"
                onClick={() => navigate('/resumes/new')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Create New Resume</h3>
                      <p className="text-sm text-gray-600">Start from scratch or use AI assistance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Editing Card */}
              {resumes.length > 0 && !isLoading && (
                <Card className="relative overflow-hidden group cursor-pointer hover:shadow-soft-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                        <Edit3 className="w-6 h-6 text-secondary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Continue Editing</h3>
                        <p className="text-sm text-gray-600 mb-2">{resumes[0].name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-secondary-500 rounded-full"
                              style={{ width: `${resumes[0].completion}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{resumes[0].completion}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* My Resumes Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Resumes</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-40 w-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
                    <p className="text-gray-500 mb-6">Create your first resume to get started</p>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/resumes/new')}
                      leftIcon={<Plus className="w-5 h-5" />}
                    >
                      Create Resume
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'sm:grid-cols-2' : ''}`}>
                  {resumes.map((resume) => (
                    <Card key={resume.id} className="group hover:shadow-soft-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                              <p className="text-sm text-gray-500">{resume.targetRole}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === resume.id ? null : resume.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>
                            {showActionMenu === resume.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10 animate-scale-in">
                                <button
                                  onClick={() => navigate(`/resumes/edit?id=${resume.id}`)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDuplicate(resume)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                  <Copy className="w-4 h-4" />
                                  Duplicate
                                </button>
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                  <Download className="w-4 h-4" />
                                  Export PDF
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                  onClick={() => handleDelete(resume.id)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 w-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {resume.lastEdited}
                            </span>
                            <Badge variant={resume.status === 'complete' ? 'success' : 'warning'} size="sm">
                              {resume.status === 'complete' ? (
                                <><CheckCircle2 className="w-3 h-3 mr-1" /> Complete</>
                              ) : (
                                <><AlertCircle className="w-3 h-3 mr-1" /> In Progress</>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{resume.completion}%</span>
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${resume.completion === 100 ? 'bg-success-500' : 'bg-primary-500'}`}
                                style={{ width: `${resume.completion}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Start</h3>
                <div className="space-y-3">
                  {['Modern Professional', 'Clean Minimal', 'Creative Bold'].map((template) => (
                    <button
                      key={template}
                      onClick={() => navigate('/resumes/new')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{template}</p>
                        <p className="text-xs text-gray-500">Popular template</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
                <Link 
                  to="/templates"
                  className="flex items-center justify-center gap-2 mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all templates
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Resume Tips */}
            <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Resume Tip</h3>
                </div>
                <div className="min-h-[60px]">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 transition-all duration-500 ${
                        index === currentTip ? 'opacity-100' : 'opacity-0 absolute'
                      }`}
                    >
                      <tip.icon className={`w-5 h-5 ${tip.color} flex-shrink-0 mt-0.5`} />
                      <p className="text-sm text-gray-700">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Prompt */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-secondary-400" />
                  <h3 className="font-semibold">Unlock Pro Features</h3>
                </div>
                <ul className="space-y-2 mb-4 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    Unlimited resumes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    AI writing assistant
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    Premium templates
                  </li>
                </ul>
                <Button 
                  variant="secondary" 
                  fullWidth
                  onClick={() => navigate('/pricing')}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Resume updated', item: 'Software Engineer Resume', time: '2 hours ago', icon: Edit3 },
                    { action: 'Template changed', item: 'Modern Professional', time: '1 day ago', icon: FileText },
                    { action: 'Profile completed', item: 'Personal information', time: '3 days ago', icon: CheckCircle2 },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500 truncate">{activity.item}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
