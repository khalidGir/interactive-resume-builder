import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Check, 
  Zap, 
  Star, 
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Button, Card, CardContent, Badge } from '../components/ui';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(true);
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Free',
      description: 'Get started with the basics',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: '1 resume', included: true },
        { text: '3 basic templates', included: true },
        { text: 'Basic editor', included: true },
        { text: 'PDF export with watermark', included: true },
        { text: 'Email support', included: true },
        { text: 'Unlimited resumes', included: false },
        { text: 'Premium templates', included: false },
        { text: 'AI writing assistant', included: false },
        { text: 'Cover letter builder', included: false },
        { text: 'No watermark', included: false },
      ],
      cta: 'Get Started Free',
      variant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For serious job seekers',
      monthlyPrice: 9,
      yearlyPrice: 89,
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited resumes', included: true },
        { text: '20+ premium templates', included: true },
        { text: 'AI writing assistant', included: true },
        { text: 'Cover letter builder', included: true },
        { text: 'LinkedIn import', included: true },
        { text: 'Priority support', included: true },
        { text: 'No watermark', included: true },
        { text: 'Resume analytics', included: true },
        { text: 'Custom sections', included: true },
      ],
      cta: 'Start Pro Trial',
      variant: 'primary' as const,
      popular: true,
    },
    {
      name: 'Teams',
      description: 'For career centers & schools',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Admin dashboard', included: true },
        { text: 'User management', included: true },
        { text: 'Analytics & reporting', included: true },
        { text: 'Custom branding', included: true },
        { text: 'SSO integration', included: true },
        { text: 'API access', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Training sessions', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      cta: 'Contact Sales',
      variant: 'secondary' as const,
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your Pro subscription at any time. Your access will continue until the end of your billing period. You\'ll still be able to download and access your resumes even after canceling.',
    },
    {
      question: 'What happens to my resumes if I cancel?',
      answer: 'Your resumes are yours forever! Even after canceling Pro, you\'ll keep access to all your resumes. You can download them as PDFs at any time. You just won\'t be able to create new resumes or edit existing ones without Pro.',
    },
    {
      question: 'Do you offer student discounts?',
      answer: 'Yes! Students with a valid .edu email address can get 50% off our Pro plan. Simply verify your student status during checkout to apply the discount.',
    },
    {
      question: 'What\'s included in the AI assistant?',
      answer: 'Our AI assistant helps you write better bullet points, suggests relevant skills, improves your professional summary, and provides real-time feedback on your resume content. It\'s like having a career coach built into your editor.',
    },
    {
      question: 'Is there a free trial for Pro?',
      answer: 'Yes! We offer a 14-day free trial of our Pro plan. You\'ll get full access to all Pro features, and you can cancel anytime during the trial without being charged.',
    },
    {
      question: 'Can I switch from monthly to yearly?',
      answer: 'Absolutely! You can switch to yearly billing at any time to save 20%. The change will take effect at your next billing cycle.',
    },
  ];

  const featureComparison = [
    { feature: 'Number of resumes', free: '1', pro: 'Unlimited', teams: 'Unlimited' },
    { feature: 'Templates', free: '3 basic', pro: '20+ premium', teams: '20+ premium' },
    { feature: 'AI writing assistant', free: '5 suggestions/mo', pro: 'Unlimited', teams: 'Unlimited' },
    { feature: 'Cover letter builder', free: '—', pro: 'Included', teams: 'Included' },
    { feature: 'PDF watermark', free: 'Yes', pro: 'None', teams: 'None' },
    { feature: 'LinkedIn import', free: '—', pro: 'Included', teams: 'Included' },
    { feature: 'Resume analytics', free: '—', pro: 'Included', teams: 'Advanced' },
    { feature: 'Custom sections', free: '—', pro: 'Included', teams: 'Included' },
    { feature: 'Priority support', free: '—', pro: 'Email', teams: 'Dedicated' },
    { feature: 'Admin dashboard', free: '—', pro: '—', teams: 'Included' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
            Choose Your Plan
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Start free and upgrade when you're ready. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-gray-100 rounded-xl">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isYearly 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular 
                    ? 'border-2 border-primary-500 shadow-soft-lg md:scale-105 md:-my-4' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary" size="lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="flex-1 p-6 lg:p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-500">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-500">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && plan.yearlyPrice > 0 && (
                      <p className="text-sm text-success-600 mt-2">
                        Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice} per year
                      </p>
                    )}
                  </div>

                  <Button
                    variant={plan.variant}
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/register')}
                    rightIcon={plan.popular ? <ArrowRight className="w-5 h-5" /> : undefined}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-display">
            Feature Comparison
          </h2>
          
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-primary-600">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Teams</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 px-6 text-gray-700">{row.feature}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.free}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 text-primary-600 font-medium">
                          {row.pro === 'Included' || row.pro === 'Unlimited' ? (
                            <Check className="w-4 h-4" />
                          ) : null}
                          {row.pro}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.teams}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setShowFaq(showFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <span className={`transform transition-transform ${showFaq === idx ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {showFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
            Still Have Questions?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="white" 
              size="lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => window.location.href = 'mailto:support@resumeai.com'}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PricingPage;
