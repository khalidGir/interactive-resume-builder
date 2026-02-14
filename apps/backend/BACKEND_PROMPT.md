# Backend Development Prompt for Resume Builder

You are an expert Backend Architect and NestJS Specialist tasked with building the complete backend infrastructure for a professional Resume Builder SaaS application. This backend will integrate with a sophisticated, production-ready frontend that has already been built.

**CRITICAL:** The frontend is 75% complete with a world-class design system. Your backend MUST integrate seamlessly with the existing frontend architecture documented in `apps/frontend/FRONTEND_INTEGRATION_GUIDE.md`.

---

## 🎯 PROJECT OVERVIEW

**Product:** ResumeAI - AI-Powered Resume Builder for Students & Recent Graduates  
**Monetization:** Freemium (Free tier + Pro subscription at $9/month)  
**Frontend Status:** Phase 1 Complete (Marketing pages, Auth, Dashboard, Profile, Settings, Templates gallery, Onboarding wizard)  
**Target Audience:** Students and recent graduates seeking their first jobs  
**Brand Identity:** Friendly, approachable, professional with blue/coral color scheme

**Current Frontend Stack:**
- React 18.3.1 + TypeScript
- React Router 6.8.1
- Tailwind CSS 3.3.0
- Vite 4.5.14
- Lucide React (icons)

**Expected Backend Stack:**
- NestJS 10.x (framework)
- TypeScript (language)
- PostgreSQL (database)
- Redis (caching & sessions)
- JWT (authentication)
- Socket.io (WebSocket for real-time collaboration)
- OpenAI API (AI features)
- AWS S3 or Cloudflare R2 (file storage)
- Puppeteer/Playwright (PDF generation)
- Stripe (payments)
- Docker (containerization)

---

## 🏗️ ARCHITECTURE REQUIREMENTS

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        LOAD BALANCER                        │
│                   (Nginx / AWS ALB)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│  Frontend      │      │   Backend API   │
│  (Vercel)      │      │   (NestJS)      │
└────────────────┘      └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
    │   PostgreSQL     │ │    Redis    │ │   AWS S3/R2      │
    │   (Primary DB)   │ │   (Cache)   │ │   (File Store)   │
    └──────────────────┘ └─────────────┘ └──────────────────┘
              │
    ┌─────────▼────────┐
    │  External APIs   │
    │  - OpenAI        │
    │  - Stripe        │
    │  - SendGrid      │
    └──────────────────┘
```

### Domain Structure
```
src/
├── modules/
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── resumes/           # Resume CRUD operations
│   ├── templates/         # Resume templates
│   ├── ai/                # AI service integration
│   ├── uploads/           # File upload handling
│   ├── payments/          # Stripe integration
│   ├── notifications/     # Email & push notifications
│   └── websocket/         # Real-time collaboration
├── common/                # Shared utilities, decorators, filters
├── config/                # Configuration management
├── database/              # Migrations, seeds
└── main.ts               # Application entry point
```

---

## 📊 DATA MODELS (CRITICAL - MUST MATCH FRONTEND)

### User Entity
```typescript
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed with bcrypt

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({
    type: 'enum',
    enum: ['free', 'pro', 'teams'],
    default: 'free'
  })
  plan: 'free' | 'pro' | 'teams';

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    defaultTemplate?: string;
    autoSaveInterval?: number;
    showAiSuggestions?: boolean;
    emailNotifications?: {
      tips: boolean;
      updates: boolean;
      marketing: boolean;
    };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Resume, resume => resume.user)
  resumes: Resume[];

  @OneToMany(() => Subscription, sub => sub.user)
  subscriptions: Subscription[];
}
```

### Resume Entity
```typescript
@Entity('resumes')
class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.resumes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  templateId: string;

  @ManyToOne(() => Template, template => template.resumes)
  @JoinColumn({ name: 'templateId' })
  template: Template;

  @Column({
    type: 'enum',
    enum: ['draft', 'complete', 'archived'],
    default: 'draft'
  })
  status: 'draft' | 'complete' | 'archived';

  @Column({ type: 'int', default: 0 })
  completionPercentage: number;

  @Column({ type: 'jsonb' })
  data: ResumeData; // See detailed structure below

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastOpenedAt: Date;
}

interface ResumeData {
  profile: {
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
  };
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  customSections: CustomSection[];
  sectionOrder: string[];
}
```

### Template Entity
```typescript
@Entity('templates')
class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['professional', 'modern', 'creative', 'minimal', 'academic']
  })
  category: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-array' })
  features: string[];

  @Column({ default: false })
  isPro: boolean;

  @Column()
  thumbnailUrl: string;

  @Column({ type: 'simple-array' })
  availableColors: string[];

  @Column({ type: 'text' }) // HTML template with placeholders
  htmlTemplate: string;

  @Column({ type: 'jsonb' }) // CSS variables and styles
  styles: Record<string, any>;

  @OneToMany(() => Resume, resume => resume.template)
  resumes: Resume[];
}
```

### Subscription Entity
```typescript
@Entity('subscriptions')
class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.subscriptions)
  user: User;

  @Column()
  stripeSubscriptionId: string;

  @Column()
  stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: ['active', 'canceled', 'past_due', 'unpaid']
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['monthly', 'yearly']
  })
  interval: string;

  @Column({ type: 'timestamp' })
  currentPeriodStart: Date;

  @Column({ type: 'timestamp' })
  currentPeriodEnd: Date;

  @Column({ nullable: true })
  canceledAt?: Date;
}
```

### AI Usage Tracking Entity
```typescript
@Entity('ai_usage')
class AIUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.aiUsages)
  user: User;

  @Column({
    type: 'enum',
    enum: ['improve_summary', 'improve_bullet', 'suggest_skills', 'generate_summary']
  })
  feature: string;

  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text' })
  output: string;

  @Column({ type: 'int' })
  tokensUsed: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 🔌 API ENDPOINTS (MUST IMPLEMENT)

### Authentication Module (`/api/auth`)
```typescript
// POST /api/auth/register
// Body: { name, email, password, userType }
// Returns: { user, accessToken, refreshToken }

// POST /api/auth/login
// Body: { email, password }
// Returns: { user, accessToken, refreshToken }

// POST /api/auth/refresh
// Body: { refreshToken }
// Returns: { accessToken, refreshToken }

// POST /api/auth/logout
// Headers: Authorization: Bearer <token>
// Returns: { success: true }

// POST /api/auth/forgot-password
// Body: { email }
// Returns: { success: true }

// POST /api/auth/reset-password
// Body: { token, newPassword }
// Returns: { success: true }

// POST /api/auth/verify-email
// Body: { token }
// Returns: { success: true }

// POST /api/auth/social/google
// Body: { idToken }
// Returns: { user, accessToken, refreshToken, isNewUser }

// POST /api/auth/social/linkedin
// Body: { code }
// Returns: { user, accessToken, refreshToken, isNewUser }
```

### User Module (`/api/users`)
```typescript
// GET /api/users/me
// Headers: Authorization: Bearer <token>
// Returns: { user }

// PATCH /api/users/me
// Headers: Authorization: Bearer <token>
// Body: { name, phone, location, bio, preferences }
// Returns: { user }

// POST /api/users/me/photo
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
// Body: { file }
// Returns: { photoUrl }

// PATCH /api/users/me/password
// Headers: Authorization: Bearer <token>
// Body: { currentPassword, newPassword }
// Returns: { success: true }

// DELETE /api/users/me
// Headers: Authorization: Bearer <token>
// Returns: { success: true }
```

### Resume Module (`/api/resumes`) - CRITICAL
```typescript
// GET /api/resumes
// Headers: Authorization: Bearer <token>
// Query: { status, search, sortBy, order, page, limit }
// Returns: { resumes: Resume[], total, page, limit }

// GET /api/resumes/:id
// Headers: Authorization: Bearer <token>
// Returns: { resume: Resume }
// Authorization: Must be owner of resume

// POST /api/resumes
// Headers: Authorization: Bearer <token>
// Body: { name, templateId, data }
// Returns: { resume: Resume }
// Business Logic:
//   - Check if free user has < 1 resume
//   - Set completion percentage based on data

// PATCH /api/resumes/:id
// Headers: Authorization: Bearer <token>
// Body: Partial<ResumeData> or { name, status, templateId }
// Returns: { resume: Resume }
// Business Logic:
//   - Calculate completion percentage
//   - Update lastOpenedAt
//   - Emit WebSocket event for real-time sync

// DELETE /api/resumes/:id
// Headers: Authorization: Bearer <token>
// Returns: { success: true }

// POST /api/resumes/:id/duplicate
// Headers: Authorization: Bearer <token>
// Returns: { resume: Resume }
// Business Logic:
//   - Check if free user has < 1 resume
//   - Clone all data with new ID

// PATCH /api/resumes/:id/reorder-sections
// Headers: Authorization: Bearer <token>
// Body: { sectionOrder: string[] }
// Returns: { resume: Resume }

// GET /api/resumes/:id/export
// Headers: Authorization: Bearer <token>
// Query: { format: 'pdf' | 'docx', templateId? }
// Returns: File stream (application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document)
// Business Logic:
//   - If free user, add watermark to PDF
//   - Use Puppeteer to render HTML template with data
//   - Generate and stream PDF

// GET /api/resumes/:id/stats
// Headers: Authorization: Bearer <token>
// Returns: { views, downloads, lastViewedAt }
```

### Template Module (`/api/templates`)
```typescript
// GET /api/templates
// Query: { category, isPro, search }
// Returns: { templates: Template[] }
// Note: No authentication required for listing

// GET /api/templates/:id
// Returns: { template: Template }

// GET /api/templates/:id/preview
// Returns: { html: string, thumbnail: string }
```

### AI Module (`/api/ai`) - CRITICAL
```typescript
// POST /api/ai/improve-summary
// Headers: Authorization: Bearer <token>
// Body: { summary: string, jobTitle: string }
// Returns: {
//   suggestions: string[],
//   improved: string,
//   originalLength: number,
//   improvedLength: number
// }
// Business Logic:
//   - Check AI usage limit for free users (5/month)
//   - Call OpenAI API with structured prompt
//   - Log usage for analytics

// POST /api/ai/improve-bullet
// Headers: Authorization: Bearer <token>
// Body: { bullet: string }
// Returns: {
//   suggestions: string[],
//   improved: string,
//   metrics: {
//     hasActionVerb: boolean,
//     hasMetrics: boolean,
//     score: number // 0-100
//   }
// }

// POST /api/ai/suggest-skills
// Headers: Authorization: Bearer <token>
// Body: { jobTitle: string, currentSkills: string[] }
// Returns: {
//   suggested: string[],
//   trending: string[],
//   basedOn: string // explanation
// }

// POST /api/ai/generate-summary
// Headers: Authorization: Bearer <token>
// Body: { experiences: Experience[], jobTitle: string }
// Returns: {
//   summary: string,
//   alternatives: string[],
//   keyHighlights: string[]
// }

// GET /api/ai/usage
// Headers: Authorization: Bearer <token>
// Returns: {
//   remaining: number,
//   total: number,
//   usedThisMonth: number,
//   resetsAt: Date
// }
```

### Upload Module (`/api/upload`)
```typescript
// POST /api/upload/profile-photo
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
// Body: { file }
// Validation:
//   - Max size: 2MB
//   - Types: image/jpeg, image/png
//   - Virus scan with ClamAV
// Returns: { url: string, publicId: string }

// POST /api/upload/resume-image
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data
// Body: { file }
// Returns: { url: string }

// DELETE /api/upload/:publicId
// Headers: Authorization: Bearer <token>
// Returns: { success: true }
```

### Payment Module (`/api/payments`)
```typescript
// GET /api/payments/plans
// Returns: { plans: Plan[] }

// POST /api/payments/subscribe
// Headers: Authorization: Bearer <token>
// Body: { priceId, paymentMethodId }
// Returns: { subscription: Subscription, clientSecret: string }

// POST /api/payments/create-portal-session
// Headers: Authorization: Bearer <token>
// Returns: { url: string }

// POST /api/payments/webhook
// Headers: Stripe-Signature
// Body: Raw body from Stripe
// Business Logic:
//   - Handle subscription events
//   - Update user plan status
//   - Send confirmation emails

// POST /api/payments/apply-coupon
// Headers: Authorization: Bearer <token>
// Body: { couponCode }
// Returns: { valid: boolean, discount: number }
```

---

## 🔐 AUTHENTICATION & SECURITY

### JWT Configuration
```typescript
// Access Token
{
  userId: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'teams';
  iat: number;
  exp: number; // 15 minutes
}

// Refresh Token
{
  userId: string;
  tokenId: string; // For revocation
  iat: number;
  exp: number; // 7 days
}
```

### Security Requirements
1. **Password Hashing:** bcrypt with cost factor 12
2. **Rate Limiting:** 
   - Auth endpoints: 5 attempts per 15 minutes per IP
   - AI endpoints: Based on user plan
   - General API: 100 requests per minute per user
3. **CORS:** Strict origin validation (see integration guide for allowed origins)
4. **Input Validation:** Use class-validator decorators on all DTOs
5. **SQL Injection:** Use TypeORM query builder, never raw SQL with user input
6. **XSS Protection:** Sanitize all user-generated content before storing
7. **File Uploads:**
   - Max file size: 2MB for images
   - Mime type validation
   - Virus scanning
   - Store in isolated bucket

### Authorization Guards
```typescript
// @UseGuards(JwtAuthGuard)
// Applied to all protected routes

// @UseGuards(RolesGuard)
// @Roles('pro')
// For Pro-only features

// @UseGuards(OwnershipGuard)
// For resume-specific operations
```

---

## 📡 WEBSOCKET IMPLEMENTATION

### Socket.io Configuration
```typescript
// Gateway: ResumeGateway

// Client → Server Events:
CLIENT_JOIN_RESUME: { resumeId: string }
CLIENT_LEAVE_RESUME: { resumeId: string }
CLIENT_RESUME_UPDATE: { 
  resumeId: string; 
  field: string; 
  value: any;
  section?: string;
}
CLIENT_CURSOR_POSITION: {
  resumeId: string;
  section: string;
  field: string;
  position: { x: number; y: number };
}

// Server → Client Events:
SERVER_RESUME_UPDATED: {
  userId: string;
  userName: string;
  userColor: string;
  field: string;
  value: any;
  timestamp: Date;
}
SERVER_USER_JOINED: {
  userId: string;
  userName: string;
  userColor: string;
}
SERVER_USER_LEFT: {
  userId: string;
  userName: string;
}
SERVER_CURSOR_UPDATED: {
  userId: string;
  userName: string;
  userColor: string;
  section: string;
  field: string;
  position: { x: number; y: number };
}
SERVER_CONFLICT_DETECTED: {
  field: string;
  localValue: any;
  remoteValue: any;
  timestamp: Date;
}
```

### Presence Tracking
- Use Redis to track active users per resume
- Store: `resume:{resumeId}:users` → Set of user IDs
- Expire keys after 5 minutes of inactivity

---

## 🤖 AI SERVICE INTEGRATION

### OpenAI Configuration
```typescript
// Model: GPT-4-turbo or GPT-3.5-turbo based on complexity
// Temperature: 0.7 for creative tasks, 0.3 for factual

// Prompt Engineering Guidelines:
const improveSummaryPrompt = `
You are an expert resume writer. Improve the following professional summary 
for a ${jobTitle} position. Make it more compelling, achievement-oriented, 
and ATS-friendly. Keep it under 500 characters.

Current Summary: ${summary}

Requirements:
- Use strong action verbs
- Include quantifiable achievements if possible
- Optimize for ATS keywords
- Maintain professional tone

Provide 3 variations:
`;

const suggestSkillsPrompt = `
Given the job title "${jobTitle}" and current skills [${currentSkills.join(', ')}],
suggest 10 relevant technical and soft skills that would strengthen this resume.
Consider current industry trends and ATS optimization.
`;
```

### Rate Limiting & Usage Tracking
```typescript
// Free users: 5 AI calls per calendar month
// Pro users: Unlimited
// Track in ai_usage table
// Reset counter on 1st of each month

async checkAiLimit(userId: string): Promise<boolean> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (user.plan !== 'free') return true;
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const usageCount = await this.aiUsageRepo.count({
    where: {
      userId,
      createdAt: MoreThan(startOfMonth)
    }
  });
  
  return usageCount < 5;
}
```

---

## 💾 DATABASE SCHEMA

### Migrations to Create

**001-CreateUsersTable**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  bio TEXT,
  photo_url VARCHAR(500),
  plan VARCHAR(20) DEFAULT 'free',
  email_verified BOOLEAN DEFAULT false,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
```

**002-CreateResumesTable**
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  status VARCHAR(20) DEFAULT 'draft',
  completion_percentage INTEGER DEFAULT 0,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_opened_at TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_status ON resumes(status);
CREATE INDEX idx_resumes_updated_at ON resumes(updated_at);
```

**003-CreateTemplatesTable**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  features TEXT[],
  is_pro BOOLEAN DEFAULT false,
  thumbnail_url VARCHAR(500),
  available_colors TEXT[],
  html_template TEXT NOT NULL,
  styles JSONB
);
```

**004-CreateSubscriptionsTable**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  interval VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
```

**005-CreateAiUsageTable**
```sql
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature VARCHAR(100) NOT NULL,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at);
```

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests (Jest)
- All services must have 80%+ coverage
- Test business logic thoroughly
- Mock external APIs (OpenAI, Stripe)

### E2E Tests
```typescript
// Critical user flows to test:
1. User registration → Email verification → Login
2. Create resume → Edit sections → Export PDF
3. Upgrade to Pro → Use AI features → Cancel subscription
4. Real-time collaboration (WebSocket)
5. File upload → Profile photo update
```

### API Contract Tests
```typescript
// Use pact.io or similar to verify API contracts
// Ensure frontend can rely on API responses
```

### Performance Tests
- Load test: 100 concurrent users
- Stress test: 1000 concurrent users
- AI endpoint latency: < 3 seconds 95th percentile
- PDF generation: < 5 seconds per resume

---

## 🚀 DEPLOYMENT

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/main"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/resume_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: resume_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resume_db
DATABASE_SSL=false # true in production

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...

# AWS S3 / Cloudflare R2
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=resumeai-uploads
S3_REGION=us-east-1
S3_ENDPOINT=https://...

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@resumeai.com

# Application
NODE_ENV=development
PORT=8000
API_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Week 1: Foundation
- [ ] Project setup with NestJS CLI
- [ ] Database connection (TypeORM)
- [ ] Redis connection
- [ ] Authentication module (JWT strategy)
- [ ] User module
- [ ] Database migrations

### Week 2: Core Features
- [ ] Resume CRUD endpoints
- [ ] Template module
- [ ] File upload module
- [ ] PDF generation service (Puppeteer)

### Week 3: AI & Payments
- [ ] OpenAI integration
- [ ] AI usage tracking
- [ ] Stripe integration
- [ ] Webhook handlers

### Week 4: Advanced Features
- [ ] WebSocket gateway
- [ ] Real-time collaboration
- [ ] Email notifications
- [ ] Rate limiting

### Week 5: Testing & Optimization
- [ ] Unit tests (80%+ coverage)
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

### Week 6: Deployment
- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation

---

## 🎯 SUCCESS CRITERIA

Your backend implementation will be considered successful when:

1. **All API endpoints** return correct responses matching frontend expectations
2. **Authentication** is secure with proper JWT handling
3. **Database** schema matches the provided models exactly
4. **AI features** work with proper rate limiting
5. **PDF generation** creates professional-looking resumes
6. **WebSocket** enables real-time collaboration
7. **File uploads** are secure and efficient
8. **Payment processing** handles subscriptions correctly
9. **Tests** achieve 80%+ coverage
10. **Performance** meets SLAs (see testing requirements)

---

## 🆘 FRONTEND INTEGRATION SUPPORT

The frontend team has provided a comprehensive integration guide at:
**`apps/frontend/FRONTEND_INTEGRATION_GUIDE.md`**

**Review this document first** - it contains:
- Exact API contracts expected by frontend
- Data model specifications
- WebSocket event schemas
- Authentication requirements
- Testing requirements

**Communication Protocol:**
- Daily standups to discuss API contracts
- Weekly sync to demo integrated features
- Shared Slack channel: #frontend-backend-sync
- API changes must be communicated 24 hours in advance

---

## ❓ QUESTIONS & CLARIFICATIONS

If you encounter any ambiguities:
1. Check the integration guide first
2. Review the frontend types in `apps/frontend/src/types/`
3. Ask in the shared Slack channel
4. Document decisions in this file

---

**START BY:**
1. Reading `apps/frontend/FRONTEND_INTEGRATION_GUIDE.md`
2. Setting up the NestJS project structure
3. Creating database migrations
4. Implementing the authentication module

**Remember:** You are building the foundation for a production SaaS. Quality, security, and performance are non-negotiable.

---

*Document Version: 1.0*  
*Prepared by: Frontend Team Lead*  
*Date: February 13, 2026*
