# Quick-Start Deployment Guide

## Interactive Resume Builder

This guide provides the fastest path to deploy your Interactive Resume Builder application using free tier services.

## Prerequisites

1. A GitHub/GitLab/Bitbucket account with your code pushed to a repository
2. Accounts on Vercel and Render (both offer free tiers)
3. Basic familiarity with environment variables and deployment concepts

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to a public or private repository
2. Verify that the `render.yaml` file exists in the root directory
3. Update the `vercel.json` file in the `apps/frontend` directory with the correct configuration:

```json
{
  "framework": "vite",
  "buildCommand": "cd ../.. && npm ci && cd apps/frontend && npm run build",
  "outputDirectory": "dist",
  "installCommand": "cd ../.. && npm ci"
}
```

### Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect to your GitHub/GitLab/Bitbucket account
4. Select your Interactive Resume Builder repository
5. Render will automatically detect the `render.yaml` file
6. Complete the setup process
7. Note the URL of your deployed backend service (e.g., `https://your-app-name.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Sign in and click "Add New Project"
3. Import your repository
4. Change the Root Directory to `apps/frontend`
5. Add the following environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: Your Render backend URL from Step 2 (e.g., `https://your-app-name.onrender.com`)
6. Click "Deploy"

### Step 4: Configure CORS (Backend)

Update your backend's CORS settings to allow your Vercel frontend domain:

1. In your NestJS main.ts file, update the CORS configuration:
```typescript
app.enableCors({
  origin: [
    'https://your-frontend-url.vercel.app', // Replace with your Vercel URL
    'http://localhost:5173' // For local development
  ],
  credentials: true,
});
```

2. Redeploy your backend to Render

### Step 5: Run Database Migrations

After both services are deployed, run your database migrations:

1. On Render, go to your backend service
2. In the "Manual Deploy" section, add the following command to run migrations:
   ```
   npm run build && npx typeorm migration:run -d dist/src/data-source.js
   ```

### Step 6: Test Your Deployment

1. Visit your Vercel frontend URL
2. Verify that API calls to your Render backend are working
3. Test all major functionality of your application

## Important Notes

- **Free Tier Limitations**: Both Vercel and Render put services to sleep after periods of inactivity on free tiers
- **Environment Variables**: Ensure all required environment variables are set in both platforms
- **Custom Domains**: You can add custom domains later in both platforms' dashboards
- **Auto-deployment**: Enable auto-deployment from your Git repository for continuous deployment

## Troubleshooting

### Common Issues:

1. **API Calls Failing**: Check CORS configuration and ensure VITE_API_BASE_URL is set correctly
2. **Database Connection Errors**: Verify DATABASE_URL is properly configured in Render
3. **Build Failures**: Check that all dependencies are properly defined in package.json files

### Quick Fixes:

1. **Redeploy**: Sometimes a fresh deployment resolves issues
2. **Check Logs**: Use the logs section in both Vercel and Render dashboards
3. **Environment Variables**: Double-check all environment variables are set correctly

## Next Steps

1. Monitor your application's performance
2. Set up error tracking and monitoring
3. Plan for scaling as your user base grows
4. Consider upgrading to paid plans when usage exceeds free tier limits

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)

Your Interactive Resume Builder should now be successfully deployed and accessible online!