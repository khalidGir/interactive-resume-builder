import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../components/layout';
import { Card, CardContent, Button, Input, Badge } from '../components/ui';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Globe,
  Camera,
  Save,
  Edit3,
  CheckCircle2,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    jobTitle: '',
    company: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccessMessage('Profile updated successfully!');
    setIsLoading(false);
    setIsEditing(false);
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit3 className="w-5 h-5" />}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl text-success-700 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Photo & Basic Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  {/* Profile Photo */}
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-16 h-16 text-primary-600" />
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <Camera className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900">{profileData.name || 'Your Name'}</h2>
                  <p className="text-gray-500">{profileData.jobTitle || 'Job Title'}</p>
                  
                  {profileData.location && (
                    <p className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    {[
                      { icon: Linkedin, value: profileData.linkedin, color: 'hover:bg-[#0077b5] hover:text-white' },
                      { icon: Github, value: profileData.github, color: 'hover:bg-gray-900 hover:text-white' },
                      { icon: Twitter, value: profileData.twitter, color: 'hover:bg-[#1DA1F2] hover:text-white' },
                      { icon: Globe, value: profileData.website, color: 'hover:bg-primary-600 hover:text-white' },
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href={social.value || '#'}
                        className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 transition-colors ${social.color}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-900 font-medium">Feb 2025</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email Verified</span>
                      <CheckCircle2 className="w-5 h-5 text-success-500" />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="mt-4"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Mail className="w-5 h-5" />}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Phone className="w-5 h-5" />}
                      placeholder="+1 (555) 000-0000"
                    />
                    <Input
                      label="Location"
                      name="location"
                      value={profileData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Professional Information</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Current Job Title"
                      name="jobTitle"
                      value={profileData.jobTitle}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Briefcase className="w-5 h-5" />}
                      placeholder="e.g., Software Engineer"
                    />
                    <Input
                      label="Company/Organization"
                      name="company"
                      value={profileData.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<GraduationCap className="w-5 h-5" />}
                      placeholder="e.g., Google"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Online Presence</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Website/Portfolio"
                      name="website"
                      value={profileData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Globe className="w-5 h-5" />}
                      placeholder="https://yourwebsite.com"
                    />
                    <Input
                      label="LinkedIn"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Linkedin className="w-5 h-5" />}
                      placeholder="linkedin.com/in/username"
                    />
                    <Input
                      label="GitHub"
                      name="github"
                      value={profileData.github}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Github className="w-5 h-5" />}
                      placeholder="github.com/username"
                    />
                    <Input
                      label="Twitter"
                      name="twitter"
                      value={profileData.twitter}
                      onChange={handleChange}
                      disabled={!isEditing}
                      leftIcon={<Twitter className="w-5 h-5" />}
                      placeholder="@username"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center justify-end gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    leftIcon={<Save className="w-5 h-5" />}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
