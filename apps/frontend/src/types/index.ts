// User interface
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Extended user interface for auth context
export interface AuthUser extends User {
  name?: string;
  bio?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Signup data (for compatibility)
export interface SignUpData {
  email: string;
  password: string;
}

// Auth response
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Profile update data
export interface UserProfileUpdate {
  name: string;
  email: string;
  bio?: string;
}

// Resume interface matching backend structure
export interface Resume {
  id: string;
  userId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

// Resume data structure
export interface ResumeData {
  profile: Profile;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  languages?: Language[];
}

// Profile section
export interface Profile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

// Experience section
export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  currentlyWorking?: boolean;
}

// Education section
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

// Skill section
export interface Skill {
  id?: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

// Project section
export interface Project {
  id?: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

// Language section
export interface Language {
  id?: string;
  language: string;
  proficiency?: 'Elementary' | 'Limited' | 'Professional' | 'Native';
}

// AI improvement request/response
export interface BulletImprovementRequest {
  text: string;
  role?: string;
}

export interface BulletImprovementResponse {
  improvedText: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}