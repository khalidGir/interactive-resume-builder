# Frontend Development Plan & API Integration Guide

**Document Owner:** Frontend Team Lead  
**Date:** February 13, 2026  
**Status:** Phase 1 Complete, Phase 2 Planned  
**Target Audience:** Backend Development Team

---

## Executive Summary

The frontend transformation is **75% complete**. We've rebuilt the entire UI/UX from scratch with a professional, conversion-focused design system. This document outlines the remaining work and provides the backend team with all necessary information for API integration.

### What's Been Delivered ✅
- Complete design system with brand identity
- 8 reusable UI components
- 4 layout components
- 6 marketing pages (Landing, Pricing, Templates, Auth)
- 4 application pages (Dashboard, Profile, Settings, Onboarding)
- Mobile-responsive design
- Accessibility compliance (WCAG 2.1 AA)

### What's Remaining 🚧
- Resume Editor (3-panel layout) - **HIGH PRIORITY**
- Resume Management enhancements
- WebSocket integration for real-time collaboration
- AI service integration
- File upload/download handlers

---

## Part 1: Architecture Overview

### 1.1 Tech Stack

```
Frontend Stack:
├── React 18.3.1 (with TypeScript)
├── React Router 6.8.1 (routing)
├── Tailwind CSS 3.3.0 (styling)
├── Zustand 4.3.6 (state management - planned)
├── Lucide React (icons)
└── Vite 4.5.14 (build tool)

Key Dependencies to Add:
├── @dnd-kit/core & sortable (drag & drop)
├── react-hot-toast (notifications)
├── html2pdf.js (PDF export)
├── axios (HTTP client - already present)
└── date-fns (date formatting)
```

### 1.2 File Structure

```
apps/frontend/src/
├── components/
│   ├── ui/              # 8 reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── TextArea.tsx
│   ├── layout/          # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   └── resume/          # [TO BE BUILT]
│       ├── ResumeEditor.tsx
│       ├── SectionEditor.tsx
│       ├── ResumePreview.tsx
│       ├── TemplateSelector.tsx
│       ├── SectionNavigator.tsx
│       └── AiAssistant.tsx
├── pages/
│   ├── LandingPage.tsx      ✅
│   ├── LoginPage.tsx        ✅
│   ├── RegisterPage.tsx     ✅
│   ├── OnboardingPage.tsx   ✅
│   ├── DashboardPage.tsx    ✅
│   ├── ProfilePage.tsx      ✅
│   ├── SettingsPage.tsx     ✅
│   ├── PricingPage.tsx      ✅
│   ├── TemplatesPage.tsx    ✅
│   ├── ResumeEditor.tsx     🚧 [PHASE 2]
│   └── ResumeManagementPage.tsx 🚧 [PHASE 2]
├── hooks/               # Custom hooks
│   ├── useAuth.ts       ✅
│   ├── useToast.ts      [TO BE BUILT]
│   ├── useResume.ts     [TO BE BUILT]
│   └── useAI.ts         [TO BE BUILT]
├── context/             # React context
│   ├── AuthContext.tsx  ✅
│   └── ToastContext.tsx [TO BE BUILT]
├── services/            # API services
│   ├── api.ts           ✅
│   ├── authService.ts   ✅
│   ├── resumeService.ts ✅
│   └── aiService.ts     [TO BE BUILT]
├── types/               # TypeScript types
│   └── index.ts         [NEEDS EXPANSION]
└── utils/               # Utilities
    ├── cn.ts            [TO BE BUILT]
    └── validators.ts    [TO BE BUILT]
```

---

## Part 2: Completed Components Reference

### 2.1 UI Components API

All UI components accept these standard props:

**Button Component**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  // + standard button HTML attributes
}
```

**Input Component**
```typescript
interface InputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  // + standard input HTML attributes
}
```

**Card Component**
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
  hover?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  // + standard div HTML attributes
}
```

### 2.2 Design Tokens

**Colors (Tailwind Config)**
```javascript
// Primary (Blue)
primary-50: '#eff6ff'   // Lightest
primary-500: '#3b82f6'  // Brand color
primary-600: '#2563eb'  // Hover state
primary-700: '#1d4ed8'  // Active state

// Secondary (Coral/Orange)
secondary-500: '#f97316'  // CTA accents
secondary-600: '#ea580c'  // Hover

// Semantic
success-500: '#10b981'   // Green
warning-500: '#f59e0b'   // Yellow/Orange
error-500: '#ef4444'     // Red
```

**Typography**
```css
font-sans: 'Inter', system-ui, sans-serif    // Body text
font-display: 'Poppins', sans-serif          // Headings
```

---

## Part 3: Remaining Work (Phase 2)

### 3.1 Priority 1: Resume Editor (CRITICAL)

**Component:** `ResumeEditor.tsx`  
**Estimated Time:** 3-4 days  
**Dependencies:** Backend API for resumes, AI suggestions

**Layout: 3-Panel Design**
```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, minimal for editor)                         │
├──────────┬───────────────────────────┬──────────────────────┤
│          │                           │                      │
│ SECTION  │     FORM EDITOR           │   LIVE PREVIEW       │
│ NAV      │     (Center 45%)          │   (Right 35%)        │
│ (Left    │                           │                      │
│  20%)    │  - Personal Info Form     │   - A4 Paper Size    │
│          │  - Experience Items       │   - Real-time render │
│  • Icon  │  - Education Items        │   - Zoom controls    │
│    +     │  - Skills Input           │   - Template switch  │
│  Label   │  - Projects               │                      │
│          │  - Rich text editors      │                      │
│          │                           │                      │
│          │                           │                      │
├──────────┴───────────────────────────┴──────────────────────┤
│  STATUS BAR (auto-save indicator, word count, etc.)         │
└─────────────────────────────────────────────────────────────┘
```

**Features Required:**
1. **Left Sidebar Navigation**
   - Section list: Personal Info, Experience, Education, Skills, Projects, Languages, Certifications
   - Progress indicators (empty ○, partial ◐, complete ●)
   - Drag-to-reorder sections
   - Click to jump to section

2. **Center Form Editor**
   - Dynamic form generation based on section type
   - Rich text editor for descriptions (bold, bullets, italic)
   - Inline validation with error messages
   - Auto-save indicator ("All changes saved ✓")
   - AI assist buttons next to text areas
   - Add/Remove/Reorder items within sections

3. **Right Preview Panel**
   - A4 paper ratio preview (210mm x 297mm)
   - Real-time updates as user types
   - Zoom controls (75%, 100%, 125%, fit-to-width)
   - Template switcher dropdown
   - Color theme picker (if template supports)
   - Download PDF button

4. **Top Action Bar**
   - Resume title (editable inline)
   - Undo/Redo buttons
   - Template selector
   - Export dropdown (PDF, Word, Share link)
   - Save & Close button

**State Management:**
```typescript
interface ResumeEditorState {
  resumeData: ResumeData;
  activeSection: string;
  selectedTemplate: string;
  zoom: number;
  isSaving: boolean;
  lastSaved: Date;
  history: ResumeData[]; // For undo/redo
  historyIndex: number;
}
```

### 3.2 Priority 2: Resume Management Enhancements

**Current:** Basic grid view  
**Needed:**
1. Search & filter functionality
2. Bulk actions (delete multiple, export multiple)
3. Sort options (last edited, name, completion %)
4. Tags/labels for resumes
5. Folder/organization system

### 3.3 Priority 3: WebSocket Integration

**Purpose:** Real-time collaboration (optional premium feature)

**Events to Handle:**
```typescript
// Client → Server
RESUME_JOIN: { resumeId: string }
RESUME_LEAVE: { resumeId: string }
RESUME_UPDATE: { resumeId: string, changes: Partial<ResumeData> }
CURSOR_POSITION: { resumeId: string, section: string, field: string }

// Server → Client
RESUME_UPDATED: { userId: string, changes: Partial<ResumeData> }
USER_JOINED: { userId: string, userName: string }
USER_LEFT: { userId: string }
CURSOR_UPDATED: { userId: string, color: string, position: CursorPosition }
CONFLICT_DETECTED: { field: string, localValue: any, remoteValue: any }
```

---

## Part 4: API Requirements for Backend Team

### 4.1 Resume API Endpoints

**Current Implementation (Already Present):**
```typescript
// GET /api/resumes
getAllResumes(token: string): Promise<Resume[]>

// POST /api/resumes
createResume(data: ResumeData, token: string): Promise<Resume>

// DELETE /api/resumes/:id
deleteResume(id: string, token: string): Promise<void>

// GET /api/resumes/:id/export
exportResumeAsPdf(id: string, token: string): Promise<Blob>
```

**NEEDED ADDITIONS:**

```typescript
// GET /api/resumes/:id
getResumeById(id: string, token: string): Promise<Resume>
// Returns full resume data for editor

// PATCH /api/resumes/:id
updateResume(id: string, data: Partial<ResumeData>, token: string): Promise<Resume>
// Partial updates for auto-save

// POST /api/resumes/:id/duplicate
duplicateResume(id: string, token: string): Promise<Resume>
// Clone existing resume

// PATCH /api/resumes/:id/reorder-sections
reorderSections(id: string, sectionOrder: string[], token: string): Promise<Resume>
// Update section order

// GET /api/resumes/:id/preview
getResumePreview(id: string, template: string, token: string): Promise<HTMLString>
// Server-side rendered preview (optional optimization)
```

### 4.2 AI Service Integration

**NEEDED NEW ENDPOINTS:**

```typescript
// POST /api/ai/improve-summary
improveSummary(summary: string, jobTitle: string): Promise<{
  suggestions: string[];
  improved: string;
}>

// POST /api/ai/improve-bullet
improveBullet(bullet: string): Promise<{
  suggestions: string[];
  improved: string;
  metrics: {
    hasActionVerb: boolean;
    hasMetrics: boolean;
    score: number;
  }
}>

// POST /api/ai/suggest-skills
suggestSkills(jobTitle: string, currentSkills: string[]): Promise<{
  suggested: string[];
  trending: string[];
}>

// POST /api/ai/generate-summary
generateSummary(experiences: Experience[], jobTitle: string): Promise<{
  summary: string;
  alternatives: string[];
}>

// GET /api/ai/suggestions-remaining
getRemainingSuggestions(token: string): Promise<{
  remaining: number;
  total: number;
  resetsAt: Date;
}>
```

**Rate Limiting:**
- Free users: 5 AI suggestions per month
- Pro users: Unlimited
- Implement rate limiting headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 4.3 File Upload/Download

**NEEDED:**

```typescript
// POST /api/upload/profile-photo
uploadProfilePhoto(file: File, token: string): Promise<{
  url: string;
  publicId: string;
}>
// Accept: image/jpeg, image/png
// Max size: 2MB

// POST /api/upload/resume-image
uploadResumeImage(file: File, token: string): Promise<{
  url: string;
}>
// For adding images to resume sections

// GET /api/resumes/:id/download
// Existing endpoint - ensure it returns proper PDF headers
// Content-Type: application/pdf
// Content-Disposition: attachment; filename="resume.pdf"
```

### 4.4 Template API

**NEEDED:**

```typescript
// GET /api/templates
getAllTemplates(): Promise<Template[]>

// GET /api/templates/:id
getTemplateById(id: string): Promise<Template>

// GET /api/templates/:id/preview
getTemplatePreview(id: string): Promise<{
  thumbnail: string;
  html: string;
}>

interface Template {
  id: string;
  name: string;
  category: 'professional' | 'modern' | 'creative' | 'minimal' | 'academic';
  description: string;
  features: string[];
  isPro: boolean;
  thumbnail: string;
  colors: string[]; // Available color schemes
  previewUrl: string;
}
```

---

## Part 5: Data Models

### 5.1 Resume Data Structure

```typescript
interface Resume {
  id: string;
  userId: string;
  name: string;
  template: string;
  data: ResumeData;
  status: 'draft' | 'complete' | 'archived';
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  lastOpenedAt: Date;
}

interface ResumeData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  customSections: CustomSection[];
  sectionOrder: string[];
}

interface Profile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  photoUrl?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string; // YYYY-MM format
  endDate: string | null; // null = present
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  gpa: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
}

interface Language {
  id: string;
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

interface CustomItem {
  id: string;
  title: string;
  description: string;
  date: string;
}
```

### 5.2 User Preferences

```typescript
interface UserPreferences {
  defaultTemplate: string;
  autoSaveInterval: number; // seconds
  showAiSuggestions: boolean;
  emailNotifications: {
    tips: boolean;
    updates: boolean;
    marketing: boolean;
  };
  editorPreferences: {
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: 'light' | 'dark' | 'system';
  };
}
```

---

## Part 6: Integration Checklist

### 6.1 Before Resume Editor Development

Backend team must provide:

- [ ] **GET /api/resumes/:id** endpoint returning full Resume object
- [ ] **PATCH /api/resumes/:id** endpoint for partial updates
- [ ] **POST /api/resumes/:id/duplicate** endpoint
- [ ] **GET /api/templates** endpoint returning all available templates
- [ ] WebSocket server setup (Socket.io or native WS)
- [ ] AI service endpoints (at minimum: improve-summary, suggest-skills)
- [ ] File upload endpoint for profile photos
- [ ] Updated database schema supporting new ResumeData structure

### 6.2 API Contract Requirements

**Response Format Standard:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Format Standard:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions - e.g., Pro feature)
- 404: Not Found
- 409: Conflict (concurrent edit)
- 429: Too Many Requests (rate limit)
- 500: Server Error

### 6.3 Authentication

**Current:** JWT in localStorage  
**Header Format:** `Authorization: Bearer <token>`

**Token Payload Should Include:**
```json
{
  "userId": "string",
  "email": "string",
  "name": "string",
  "plan": "free" | "pro" | "teams",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Part 7: Testing Requirements

### 7.1 Backend API Testing

Before frontend integration, backend endpoints should be tested for:

1. **Validation:** Reject invalid data with clear error messages
2. **Authorization:** Proper 401/403 responses
3. **Rate Limiting:** AI endpoints should track usage
4. **Concurrent Edits:** Handle simultaneous updates gracefully
5. **File Uploads:** Size limits, type validation, virus scanning
6. **PDF Export:** Consistent formatting across templates

### 7.2 Load Testing

- Resume save endpoint: 100 req/s minimum
- AI suggestions: 10 req/s per user (rate limited)
- PDF export: 5 req/s (CPU intensive, queue recommended)
- WebSocket: 1000 concurrent connections minimum

---

## Part 8: Deployment Considerations

### 8.1 Environment Variables Needed

```bash
# Frontend (.env.local)
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=ws://localhost:8000
VITE_AI_SERVICE_URL=http://localhost:8000/api/ai
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Backend should expose
/api/health          # Health check
/api/version         # API version
```

### 8.2 CORS Configuration

```javascript
// Backend CORS settings
{
  origin: [
    'http://localhost:3000',     // Local dev
    'https://app.resumeai.com',  // Production
    'https://staging.resumeai.com' // Staging
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

## Part 9: Timeline & Coordination

### 9.1 Development Phases

**Phase 2A: Core Editor (Week 1)**
- Day 1-2: Resume Editor layout & navigation
- Day 3: Form editor with section components
- Day 4: Live preview panel
- Day 5: Integration testing

**Phase 2B: Advanced Features (Week 2)**
- Day 1-2: AI integration
- Day 3: WebSocket real-time sync
- Day 4: PDF export & download
- Day 5: Polish & bug fixes

**Phase 2C: Optimization (Week 3)**
- Performance optimization
- Accessibility audit
- Mobile editor responsive design
- E2E testing

### 9.2 Coordination Points

**Daily Standup Topics:**
- API endpoint availability
- Data model changes
- WebSocket event schema
- AI service integration status

**Weekly Sync:**
- Demo of completed features
- API contract review
- Performance metrics
- Blocker resolution

---

## Part 10: Questions for Backend Team

1. **AI Service:** Are we using OpenAI, Anthropic, or a custom model? What's the latency expectation?

2. **WebSocket:** Are we implementing presence (who's viewing)? Operational transformation for conflicts?

3. **PDF Export:** Server-side (Puppeteer/Playwright) or client-side (html2pdf.js)? Server-side preferred for consistency.

4. **File Storage:** AWS S3, Cloudflare R2, or other? CDN for profile photos?

5. **Rate Limiting:** Redis-based? Need headers in responses.

6. **Search:** Full-text search for resumes? Elasticsearch or PostgreSQL full-text?

7. **Caching:** Redis for templates? CDN for static assets?

8. **Monitoring:** Error tracking (Sentry)? Performance monitoring?

---

## Appendix A: Frontend Component Usage Examples

### A.1 Using UI Components

```tsx
import { Button, Input, Card, Badge } from '../components/ui';

// Primary button with loading state
<Button 
  variant="primary" 
  size="lg"
  isLoading={isSaving}
  onClick={handleSave}
>
  Save Resume
</Button>

// Input with error handling
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  leftIcon={<Mail className="w-5 h-5" />}
/>

// Card with hover effect
<Card hover interactive onClick={handleClick}>
  <CardContent>
    <h3>Resume Title</h3>
    <Badge variant="success">Complete</Badge>
  </CardContent>
</Card>
```

### A.2 API Service Pattern

```tsx
// services/resumeService.ts
import api from './api';

export const resumeService = {
  async getById(id: string, token: string) {
    const response = await api.get(`/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async update(id: string, data: Partial<ResumeData>, token: string) {
    const response = await api.patch(`/resumes/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ... other methods
};
```

---

## Conclusion

The frontend is in excellent shape with a solid foundation. The remaining work centers on the Resume Editor, which is the core value proposition of the product.

**Next Steps:**
1. Backend team reviews this document
2. Schedule technical kickoff meeting
3. Backend provides API endpoints for Phase 2A
4. Parallel development begins
5. Daily standups for coordination

**Contact:** Frontend Team Lead  
**Slack:** #frontend-backend-sync  
**Documentation:** This document is living - updates will be tracked via Git commits

---

*Document Version: 1.0*  
*Last Updated: February 13, 2026*
