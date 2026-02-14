import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  Palette, 
  FileCheck, 
  Eye, 
  Download,
  CheckCircle2,
  ArrowRight,
  Star,
  Quote,
  ChevronRight,
  Play
} from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Button } from '../components/ui';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Writing',
      description: 'Get intelligent suggestions to improve your bullet points, summary, and skills based on your target role.',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from 20+ ATS-friendly templates designed by career experts and hiring managers.',
      color: 'bg-secondary-100 text-secondary-600',
    },
    {
      icon: Zap,
      title: 'Easy Customization',
      description: 'Drag-and-drop sections, real-time preview, and one-click styling make resume building effortless.',
      color: 'bg-success-100 text-success-600',
    },
    {
      icon: FileCheck,
      title: 'ATS-Friendly',
      description: 'Our templates are optimized to pass Applicant Tracking Systems used by 99% of Fortune 500 companies.',
      color: 'bg-warning-100 text-warning-600',
    },
    {
      icon: Eye,
      title: 'Real-time Preview',
      description: 'See exactly how your resume looks as you build it with our live preview feature.',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Download,
      title: 'Export to PDF',
      description: 'Download your resume as a high-quality PDF, ready to send to employers. No watermarks on Pro.',
      color: 'bg-secondary-100 text-secondary-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose a Template',
      description: 'Browse our collection of professional templates and pick one that matches your style.',
      time: '30 seconds',
    },
    {
      step: '02',
      title: 'Fill in Your Info',
      description: 'Add your experience, education, and skills. Our AI helps you write compelling content.',
      time: '5 minutes',
    },
    {
      step: '03',
      title: 'Download & Apply',
      description: 'Preview your resume, make final tweaks, and export as PDF. Start applying today!',
      time: 'Instant',
    },
  ];

  const templates = [
    { name: 'Modern Professional', category: 'Professional', popular: true },
    { name: 'Clean Minimal', category: 'Minimal', popular: false },
    { name: 'Creative Bold', category: 'Creative', popular: false },
    { name: 'Executive Classic', category: 'Executive', popular: true },
  ];

  const testimonials = [
    {
      quote: "I landed 3 interviews in my first week of applying! The AI suggestions helped me highlight achievements I would have never thought of.",
      author: "Sarah Chen",
      role: "Software Engineering Graduate",
      company: "Stanford University",
      rating: 5,
    },
    {
      quote: "As a career changer, I was struggling to present my transferable skills. ResumeAI made it so easy to create a compelling narrative.",
      author: "Michael Rodriguez",
      role: "Marketing Manager",
      company: "Career Changer",
      rating: 5,
    },
    {
      quote: "The templates are beautiful and the ATS optimization actually works. Got callbacks from companies that previously ghosted me.",
      author: "Emily Watson",
      role: "Recent Graduate",
      company: "NYU",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Is ResumeAI really free?",
      answer: "Yes! You can create one resume with basic templates completely free. Upgrade to Pro for unlimited resumes, premium templates, and AI features.",
    },
    {
      question: "Will my resume pass ATS systems?",
      answer: "Absolutely! All our templates are designed and tested to be ATS-friendly. We follow best practices for formatting, fonts, and structure.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro subscription at any time. Your resumes will remain accessible, and you can download them even after canceling.",
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students with a valid .edu email can get 50% off our Pro plan. Just verify your student status during checkout.",
    },
    {
      question: "How does the AI assistant work?",
      answer: "Our AI analyzes your experience and suggests powerful action verbs, quantifiable achievements, and relevant skills based on your target job title.",
    },
  ];

  return (
    <MainLayout showFooter={true} transparentNavbar={true}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Resume Builder</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-display">
                Land Your Dream Job with a{' '}
                <span className="text-gradient">Resume That Stands Out</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Create a professional resume in minutes with AI-powered suggestions and stunning templates designed for students and recent graduates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Create Free Resume
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/templates')}
                  leftIcon={<Play className="w-5 h-5" />}
                >
                  View Templates
                </Button>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                  <span>50,000+ users</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Preview */}
            <div className="relative lg:pl-8 animate-fade-in animation-delay-200">
              <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
                {/* Mock Resume Preview */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">JD</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
                      <p className="text-primary-600">Software Engineer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>

                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">Software Intern</p>
                          <p className="text-sm text-gray-500">Tech Company</p>
                        </div>
                        <span className="text-xs text-gray-400">2023</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {['React', 'TypeScript', 'Node.js'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-bounce-soft">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">ATS Score</p>
                      <p className="text-lg font-bold text-success-600">98%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Universities */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider font-medium">
            Trusted by students from leading universities
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Harvard', 'Stanford', 'MIT', 'Berkeley', 'CMU', 'NYU'].map((uni) => (
              <span key={uni} className="text-xl font-bold text-gray-400">
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Everything You Need to Build a{' '}
              <span className="text-gradient">Winning Resume</span>
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed to help you create a professional resume that gets you hired.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`
                  bg-white rounded-2xl p-6 lg:p-8 shadow-soft border border-gray-100
                  hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300
                  ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-animate className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Create Your Resume in{' '}
              <span className="text-gradient">3 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600">
              No complicated software. No design skills needed. Just answer a few questions and let our AI do the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`
                  relative text-center
                  ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-300" />
                )}
                
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 mb-6">
                  <span className="text-3xl font-bold text-primary-600">{step.step}</span>
                </div>
                
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium mb-4">
                  <Zap className="w-3 h-3" />
                  {step.time}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" data-animate className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700 ${isVisible['templates'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
                Professional Templates for{' '}
                <span className="text-gradient">Every Industry</span>
              </h2>
              <p className="text-lg text-gray-600">
                Choose from our collection of ATS-friendly templates designed by hiring managers.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/templates')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View All Templates
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <div
                key={template.name}
                className={`
                  group cursor-pointer
                  ${isVisible['templates'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => navigate('/templates')}
              >
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden group-hover:shadow-soft-lg group-hover:-translate-y-1 transition-all duration-300">
                  {/* Template Preview Placeholder */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                      <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto" />
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-medium">Preview Template</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.popular && (
                        <span className="px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{template.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" data-animate className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Loved by{' '}
              <span className="text-gradient">50,000+ Job Seekers</span>
            </h2>
            <p className="text-lg text-gray-600">
              See what students and professionals are saying about ResumeAI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className={`
                  bg-gray-50 rounded-2xl p-6 lg:p-8 relative
                  ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Quote className="w-10 h-10 text-primary-200 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-600">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-xs text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" data-animate className="section bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">
              Start Free, Upgrade When You're Ready
            </h2>
            <p className="text-lg text-primary-100">
              No credit card required to get started. Upgrade to unlock premium features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transition-all duration-700 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-primary-200 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold mb-6">$0</div>
              
              <ul className="space-y-3 mb-8">
                {['1 resume', '3 basic templates', 'Basic editor', 'PDF export with watermark'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <span className="text-primary-100">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="outline" 
                fullWidth
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
            </div>

            {/* Pro Plan */}
            <div className={`bg-white rounded-2xl p-8 relative transition-all duration-700 delay-100 ${isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-secondary-500 text-white rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-500 mb-6">For serious job seekers</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $9<span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {['Unlimited resumes', '20+ premium templates', 'AI writing assistant', 'No watermark', 'Cover letter builder'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => navigate('/register')}
              >
                Start Pro Trial
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                14-day free trial, cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" data-animate className="section bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible['faq'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about ResumeAI.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className={`
                  group bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden
                  ${isVisible['faq'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-3xl p-8 sm:p-12 lg:p-16 border border-gray-100">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Ready to Get Hired?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who've landed their dream jobs with ResumeAI. Start building your professional resume today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Create Free Resume
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/templates')}
              >
                Browse Templates
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Free forever plan available. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
