import React, { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, CardContent, Button, Input } from '../components/ui';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Mail,
  Smartphone,
  Moon,
  Save
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-10 h-10 text-primary-600" />
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Change Photo</Button>
                          <p className="text-sm text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="First Name" defaultValue="John" />
                        <Input label="Last Name" defaultValue="Doe" />
                      </div>
                      <Input label="Email" type="email" defaultValue="john@example.com" leftIcon={<Mail className="w-5 h-5" />} />
                      <Input label="Phone" placeholder="+1 (555) 000-0000" leftIcon={<Smartphone className="w-5 h-5" />} />
                      <Input label="Location" placeholder="City, Country" leftIcon={<Globe className="w-5 h-5" />} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Resume tips and suggestions', defaultChecked: true },
                      { label: 'New features and updates', defaultChecked: true },
                      { label: 'Weekly progress reports', defaultChecked: false },
                      { label: 'Marketing emails', defaultChecked: false },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                        />
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">Dark Mode</span>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </label>
                    
                    <div className="pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Default Template</label>
                      <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Modern Professional</option>
                        <option>Clean Minimal</option>
                        <option>Creative Bold</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                    <div className="space-y-4">
                      <Input label="Current Password" type="password" />
                      <Input label="New Password" type="password" />
                      <Input label="Confirm New Password" type="password" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-error-200">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-error-600 mb-2">Danger Zone</h2>
                    <p className="text-gray-600 mb-4">Once you delete your account, there is no going back.</p>
                    <Button variant="danger">Delete Account</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
                leftIcon={<Save className="w-5 h-5" />}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
