import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Check, 
  Lock,
  ArrowRight,
  Star,
  LayoutGrid,
  List
} from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Button, Card, CardContent, Badge } from '../components/ui';

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates', count: 24 },
    { id: 'professional', label: 'Professional', count: 8 },
    { id: 'modern', label: 'Modern', count: 6 },
    { id: 'creative', label: 'Creative', count: 5 },
    { id: 'minimal', label: 'Minimal', count: 3 },
    { id: 'academic', label: 'Academic', count: 2 },
  ];

  const templates = [
    {
      id: 'modern-pro',
      name: 'Modern Professional',
      category: 'professional',
      description: 'Clean and professional design perfect for corporate roles',
      features: ['ATS-Optimized', '2-Column Layout', 'Skills Highlight'],
      popular: true,
      isPro: false,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'executive',
      name: 'Executive Classic',
      category: 'professional',
      description: 'Traditional layout ideal for senior positions',
      features: ['Classic Layout', 'Timeline Format', 'Executive Summary'],
      popular: true,
      isPro: true,
      color: 'from-gray-600 to-gray-700',
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      category: 'minimal',
      description: 'Simple and elegant for a distraction-free look',
      features: ['Whitespace Focus', 'Minimal Design', 'Easy to Read'],
      popular: false,
      isPro: false,
      color: 'from-gray-400 to-gray-500',
    },
    {
      id: 'creative-bold',
      name: 'Creative Bold',
      category: 'creative',
      description: 'Stand out with unique colors and layouts',
      features: ['Color Accents', 'Modern Typography', 'Visual Elements'],
      popular: true,
      isPro: true,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'tech-modern',
      name: 'Tech Modern',
      category: 'modern',
      description: 'Perfect for software engineers and tech roles',
      features: ['Skills Grid', 'Project Highlights', 'Tech-Focused'],
      popular: false,
      isPro: true,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'academic-cv',
      name: 'Academic CV',
      category: 'academic',
      description: 'Comprehensive format for academic positions',
      features: ['Publications Section', 'Research Focus', 'Extended Format'],
      popular: false,
      isPro: true,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              20+ Professional Templates
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">
              Choose Your Perfect Template
            </h1>
            
            <p className="text-lg text-gray-600">
              ATS-friendly designs crafted by hiring managers and career experts
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                  <span className="ml-2 text-xs opacity-70">({category.count})</span>
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'sm:grid-cols-2 lg:grid-cols-3' 
                : 'max-w-3xl mx-auto'
            }`}>
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`group cursor-pointer overflow-hidden transition-all duration-300 ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary-500' : ''
                  } ${viewMode === 'list' ? 'flex flex-row' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {/* Template Preview */}
                  <div className={`relative bg-gradient-to-br ${template.color} ${
                    viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[3/4]'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 backdrop-blur-sm" />
                        <div className="h-2 bg-white/30 rounded w-3/4 mx-auto mb-2" />
                        <div className="h-2 bg-white/30 rounded w-1/2 mx-auto" />
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {template.popular && (
                        <Badge variant="secondary" size="sm">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      )}
                      {template.isPro && (
                        <Badge variant="primary" size="sm">
                          <Lock className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="white" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/register');
                        }}
                      >
                        Preview Template
                      </Button>
                    </div>
                  </div>

                  <CardContent className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {template.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                          >
                            <Check className="w-3 h-3" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant={template.isPro ? 'outline' : 'primary'}
                        fullWidth
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/register');
                        }}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {template.isPro ? 'Upgrade to Use' : 'Use Template'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Can't Decide? Start with Any Template
          </h2>
          <p className="text-gray-600 mb-8">
            You can switch templates anytime. Your content automatically reformats to fit the new design.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/register')}
          >
            Create Your Resume
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default TemplatesPage;
