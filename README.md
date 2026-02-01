# Interactive Resume Builder

An interactive resume builder application with a Next.js frontend and NestJS backend, organized as a monorepo.

## Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running with Docker](#running-with-docker)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)

## Project Structure
```
├── apps/                   # Application services
│   ├── backend/            # NestJS backend API (root level)
│   └── frontend/           # Next.js frontend
├── packages/               # Shared packages
│   └── shared/             # Shared utilities and types
├── docker/                 # Docker configurations (future use)
├── .github/workflows/      # CI/CD pipeline configuration
├── docker-compose.yml      # Docker configuration for local development
├── docker-compose.prod.yml # Docker configuration for production
└── render.yaml             # Render deployment configuration
```

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd interactive-resume-builder
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your specific configuration if needed.

3. Build and start the services:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

### Local Development

For local development without Docker:

1. Navigate to the backend directory and install dependencies:
   ```bash
   # Backend is at root level
   npm install
   ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd apps/frontend
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env.local` in the frontend directory and `.env` in the backend directory)

4. Start the backend:
   ```bash
   # From root directory
   npm run start:dev
   ```

5. In a new terminal, start the frontend:
   ```bash
   cd apps/frontend
   npm run dev
   ```

## Running with Docker

### Development
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Production
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

### Frontend (apps/frontend/.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Interactive Resume Builder
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Backend (.env)
```bash
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/resume_db
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

## Development

### Monorepo Scripts
This monorepo uses a simple structure without complex monorepo tooling like Lerna or Nx. Each app manages its own dependencies and scripts.

### Frontend Development
The frontend is built with Next.js. To run in development mode:
```bash
cd apps/frontend
npm run dev
```

### Backend Development
The backend is built with NestJS. To run in development mode:
```bash
# From root directory
npm run start:dev
```

### Shared Package
The shared package contains utilities and types used across both frontend and backend:
```bash
packages/shared/
```

## Deployment

### Deploying to Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set the Root Directory to `apps/frontend`
3. Set the build command to `npm run build`
4. Set the output directory to `.next`
5. Add environment variables in the Vercel dashboard

### Deploying to Render (Backend)
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the runtime to Node.js
4. Add the build command: `npm install && npm run build`
5. Set the start command to: `npm run start:prod`
6. Add environment variables in the Render dashboard

### Docker-based Deployment
Both applications can be deployed using the provided Dockerfiles to platforms that support containerized deployments.

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
- Tests the frontend and backend code
- Builds Docker images
- Runs linting and type checking
- Performs automated builds on push to main/develop branches

The workflow configuration is located at `.github/workflows/ci.yml`.

## Useful Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View service logs
docker-compose logs -f <service-name>

# Run tests in Docker
docker-compose exec backend npm test
docker-compose exec frontend npm test

# Build specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and start specific service
docker-compose up --build <service-name>
```

## Troubleshooting

### Common Issues
1. **Port already in use**: Make sure ports 3000, 8000, and 5432 are available
2. **Database connection errors**: Ensure the PostgreSQL service is running and credentials are correct
3. **Environment variables not loaded**: Check that .env files are properly configured

### Resetting the Development Environment
```bash
docker-compose down -v
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes in the appropriate app directory
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request