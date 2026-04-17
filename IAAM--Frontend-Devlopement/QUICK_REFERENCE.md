# Quick Reference Guide

## Essential Commands

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build           # Create production build
npm run start           # Start production server
npm run lint            # Check code quality
```

### Git
```bash
git status              # Check current status
git add .               # Stage all changes
git commit -m "msg"     # Create commit
git push origin main    # Push to remote
git pull origin main    # Pull latest changes
git checkout -b feature # Create feature branch
```

### Docker
```bash
docker build -t iaam-website .                    # Build image
docker run -p 3000:3000 iaam-website              # Run locally
docker tag iaam-website:latest ACCOUNT.dkr.ecr... # Tag image
docker push ACCOUNT.dkr.ecr...                    # Push to ECR
```

### AWS CLI
```bash
aws configure                    # Setup credentials
aws sts get-caller-identity      # Verify authentication
aws ecs describe-services ...    # Check ECS service
aws logs tail /ecs/iaam-website  # View logs
aws cloudwatch ...               # Monitor metrics
aws amplify deploy ...           # Deploy to Amplify
```

---

## Project Structure Quick Map

```
src/
├── app/          → Pages & API routes
├── components/   → React components
├── types/        → TypeScript types
├── hooks/        → Custom React hooks
└── lib/          → Utilities & helpers

Configuration
├── package.json         → Dependencies
├── next.config.ts       → Next.js config
├── tsconfig.json        → TypeScript config
├── tailwind.config.js   → Tailwind config
└── .env                 → Environment variables
```

---

## Environment Variables

### Development
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### AWS Staging
```
NEXT_PUBLIC_STRAPI_URL=http://13.53.89.25:1337
```

### Production
```
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
```

---

## File Locations

### Key Files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page |
| `src/app/layout.tsx` | Root layout |
| `src/app/api/` | API routes |
| `src/components/` | React components |
| `src/types/` | TypeScript types |
| `next.config.ts` | Next.js config |
| `tailwind.config.js` | Tailwind config |
| `.env` | Environment variables |

---

## Common Tasks

### Create New Page
1. Create file: `src/app/[pagename]/page.tsx`
2. Export React component
3. Add TypeScript types in `src/types/`

### Create New Component
1. Create file: `src/components/[ComponentName].tsx`
2. Define props interface
3. Import and use in pages

### Fetch Strapi Data
```typescript
const data = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/endpoint`
);
const response = await data.json();
```

### Style with Tailwind
```typescript
<div className="flex gap-4 p-6 bg-blue-500 text-white rounded-lg">
  Content
</div>
```

---

## Deployment Quick Start

### AWS Amplify (Easiest)
1. Connect GitHub repository
2. Amplify auto-detects Next.js
3. Review build settings
4. Deploy automatically on git push

### ECS/Fargate
1. Create Docker image
2. Push to ECR
3. Create task definition
4. Create ECS service

### App Runner
1. Connect GitHub
2. Create app.runner-config.yaml
3. Deploy via console

---

## Monitoring & Logs

### View Logs
```bash
aws logs tail /ecs/iaam-website --follow
```

### Check Service Status
```bash
aws ecs describe-services --cluster iaam-cluster --services iaam-service
```

### View Metrics
- AWS CloudWatch Dashboard
- CloudFront metrics
- ECS performance metrics

### Create Alert
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name IAAM-HighCPU \
  --threshold 75
```

---

## Troubleshooting Checklist

### Not Working?
- [ ] Check environment variables
- [ ] Check internet connectivity
- [ ] Review recent logs
- [ ] Verify API endpoints
- [ ] Test with curl/Postman
- [ ] Check GitHub Actions/CI status
- [ ] Verify AWS permissions

### Build Failing?
- [ ] Clear .next folder: `rm -rf .next`
- [ ] Reinstall dependencies: `rm -rf node_modules && npm install`
- [ ] Check TypeScript: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`

### API Errors?
- [ ] Verify Strapi is running
- [ ] Check NEXT_PUBLIC_STRAPI_URL
- [ ] Test endpoint with curl
- [ ] Check network tab in DevTools

---

## API Endpoints

### Strapi Base URL
```
http://13.53.89.25:1337/api
```

### Common Endpoints
```
GET  /api/events           → All events
GET  /api/events/1         → Single event
GET  /api/news             → All news/articles
GET  /api/pages            → Dynamic pages
POST /api/[resource]       → Create (requires auth)
```

### Pagination
```
GET /api/events?pagination[page]=1&pagination[pageSize]=10
```

### Filter
```
GET /api/events?filters[status][$eq]=published
```

### Sort
```
GET /api/events?sort=date:desc
```

---

## TypeScript Cheat Sheet

### Basic Types
```typescript
interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
}

type Status = 'published' | 'draft' | 'archived';
```

### Component Props
```typescript
interface ComponentProps {
  title: string;
  items: string[];
  onClick?: () => void;
}

export default function Component(props: ComponentProps) {
  return <div>{props.title}</div>;
}
```

### Async Component
```typescript
export default async function Page() {
  const data = await fetch(...);
  return <div>{data}</div>;
}
```

---

## Tailwind CSS Cheat Sheet

### Flexbox
```html
<div class="flex gap-4">                    <!-- Row, 1rem gap -->
<div class="flex flex-col gap-2">          <!-- Column -->
<div class="flex justify-between">         <!-- Space between -->
<div class="flex items-center">            <!-- Vertical center -->
```

### Grid
```html
<div class="grid grid-cols-3 gap-4">       <!-- 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2"> <!-- Responsive -->
```

### Spacing
```html
p-4                  <!-- Padding: 1rem -->
m-2                  <!-- Margin: 0.5rem -->
gap-6                <!-- Gap: 1.5rem -->
pt-4                 <!-- Padding top -->
```

### Colors
```html
bg-blue-500          <!-- Background -->
text-white           <!-- Text color -->
border-gray-300      <!-- Border -->
hover:bg-blue-600    <!-- Hover state -->
```

### Responsive
```html
md:text-2xl          <!-- Medium screens and up -->
lg:grid-cols-3       <!-- Large screens and up -->
xl:w-1/2             <!-- Extra large screens -->
```

---

## Git Workflow

### Create Feature
```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
```

### Commit Changes
```bash
git add .
git commit -m "feat: add new feature"
```

### Push & Create PR
```bash
git push origin feature/my-feature
# Create PR on GitHub
```

### Merge
```bash
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main
```

---

## AWS Services Summary

| Service | Purpose |
|---------|---------|
| **Amplify** | Git-based deployment |
| **ECS/Fargate** | Container orchestration |
| **CloudFront** | CDN for static content |
| **S3** | Static file storage |
| **Route 53** | DNS management |
| **CloudWatch** | Monitoring & logging |
| **RDS** | Database (if used) |
| **IAM** | Access control |
| **Secrets Manager** | Secure credential storage |

---

## Cost Estimation (Monthly)

| Service | Estimate |
|---------|----------|
| **ECS/Fargate** | $30-100 |
| **CloudFront** | $10-50 |
| **RDS** | $20-100 (if used) |
| **Route 53** | $0.50 |
| **Amplify** | $0-100 |
| **Total** | $60-350 |

*Varies based on traffic and usage*

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [AWS Amplify Docs](https://docs.aws.amazon.com/amplify/)
- [Strapi Docs](https://docs.strapi.io)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension
- [Figma](https://figma.com) - Design
- [ChatGPT](https://chat.openai.com) - Development help

### Learning
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [React Patterns](https://reactpatterns.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| **Team Lead** | [Email/Phone] |
| **DevOps** | [Email/Phone] |
| **DB Admin** | [Email/Phone] |
| **AWS Support** | AWS Console Support Tab |

---

## Useful Links

- GitHub Repo: [https://github.com/techlead-shootorder/iiam](https://github.com/techlead-shootorder/iiam)
- AWS Console: [https://console.aws.amazon.com](https://console.aws.amazon.com)
- Strapi Admin: [http://13.53.89.25:1337/admin](http://13.53.89.25:1337/admin)
- Local Dev: [http://localhost:3000](http://localhost:3000)

---

## Remember

✅ **DO:**
- Commit frequently with clear messages
- Test locally before pushing
- Review logs when debugging
- Keep secrets out of code
- Document important changes
- Use feature branches

❌ **DON'T:**
- Commit secrets or API keys
- Force push to main
- Skip testing
- Ignore errors/warnings
- Make large unrelated changes
- Deploy without testing

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Production Ready
