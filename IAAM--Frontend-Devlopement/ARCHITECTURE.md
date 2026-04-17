# IAAM Project Architecture

## Project Overview

The IAAM (International Association/Organization) website is a modern Next.js application that showcases organizational information, events, and news content. It uses a decoupled CMS architecture with Strapi as the backend.

## Tech Stack

```
Frontend Layer
├── Next.js 16.1.1 (React Framework)
├── React 19.2.3 (UI Library)
├── TypeScript 5 (Type Safety)
├── Tailwind CSS 4 (Styling)
├── Lucide React (Icons)
└── React Icons (Additional Icons)

Backend Layer
├── Strapi CMS (Content Management)
├── RESTful API
└── External API at: http://13.53.89.25:1337

Development Tools
├── ESLint 9 (Code Linting)
├── Babel Plugin React Compiler
├── Tailwind CSS PostCSS
└── Next.js CLI

Infrastructure
├── AWS (Hosting Options)
├── CloudFront (CDN)
├── Route 53 (DNS)
├── S3 (Static Assets)
└── EC2 (Strapi Backend)
```

## Project Structure

```
iiam/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with fonts & metadata
│   │   ├── page.tsx                 # Home page
│   │   ├── not-found.tsx            # 404 page
│   │   ├── api/                     # API routes
│   │   │   ├── image/route.ts       # Image proxy/optimization
│   │   │   └── strapi/route.ts      # Strapi API bridge
│   │   ├── events/
│   │   │   ├── page.tsx             # Events listing page
│   │   │   └── [slug]/page.tsx      # Event detail page
│   │   └── [slug]/page.tsx          # Dynamic pages (About, Association, etc.)
│   │
│   ├── components/                   # Reusable React Components
│   │   ├── HeroComp/
│   │   │   ├── HeroSection.tsx      # Hero section component
│   │   │   └── ContentSection.tsx   # Content section below hero
│   │   ├── Home/
│   │   │   ├── HeroSection.tsx      # Home page hero
│   │   │   ├── AboutSection.tsx     # About section
│   │   │   ├── NewsSection.tsx      # News/blog section
│   │   │   ├── JoinSection.tsx      # Call-to-action section
│   │   │   └── EventSection.tsx     # Events showcase
│   │   ├── Association/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── VisionMissionSection.tsx
│   │   │   ├── GlobalCommunity.tsx
│   │   │   ├── LeadershipSection.tsx
│   │   │   ├── GlobalImpactSection.tsx
│   │   │   ├── StrategicPriorities.tsx
│   │   │   ├── NetZero.tsx
│   │   │   ├── ResearchEducation.tsx
│   │   │   └── OurRoleSection.tsx
│   │   └── common/
│   │       └── [Shared components]
│   │
│   ├── types/                        # TypeScript Type Definitions
│   │   ├── home/
│   │   │   ├── heroSection.ts
│   │   │   ├── aboutSection.ts
│   │   │   ├── eventsSection.ts
│   │   │   ├── joinSection.ts
│   │   │   └── newsSection.ts
│   │   └── association/
│   │       ├── heroSection.ts
│   │       ├── aboutSection.ts
│   │       ├── visionMissionSection.ts
│   │       ├── globalCommunity.ts
│   │       ├── leadershipSection.ts
│   │       ├── globalImpactSection.ts
│   │       ├── strategicPriorities.ts
│   │       ├── netZero.ts
│   │       ├── researchEducation.ts
│   │       ├── ourRoleSection.ts
│   │       ├── contact.ts
│   │       └── [Other types]
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   └── [Custom hooks]
│   │
│   ├── lib/                          # Utility Functions & Helpers
│   │   └── [Utilities]
│   │
│   └── globals.css                   # Global Tailwind styles
│
├── public/                           # Static Assets
│   ├── favicon.ico
│   ├── images/
│   ├── videos/
│   └── [Other static files]
│
├── .next/                           # Next.js Build Output (gitignored)
├── node_modules/                    # Dependencies (gitignored)
│
├── Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── package-lock.json            # Locked dependency versions
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.ts               # Next.js configuration
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── eslint.config.mjs            # ESLint configuration
│   ├── .env                         # Environment variables (development)
│   ├── .env.local                   # Local overrides (gitignored)
│   ├── .gitignore                   # Git ignore rules
│   └── README.md                    # Project documentation
│
└── Documentation
    ├── AWS_DEPLOYMENT_GUIDE.md      # AWS deployment guide
    ├── ARCHITECTURE.md              # This file
    └── DATABASE_SCHEMA.md           # Database/API schema
```

## Data Flow

### Client-Side Rendering Flow

```
User Browser
    ↓
Next.js Application
    ├─ Static Pages (Home, About, etc.)
    │   ├─ Fetch from Strapi API
    │   └─ Render React Components
    │
    └─ Dynamic Pages ([slug])
        ├─ Generate dynamic routes
        └─ Fetch page-specific data

    ↓
Component Rendering
    ├─ HeroSection
    ├─ ContentSection
    ├─ NewsSection
    └─ [Other sections]

    ↓
Styling
    ├─ Tailwind CSS classes
    └─ Global CSS

    ↓
Browser Display
```

### API Integration

```
Next.js App
    │
    ├─→ Internal API Routes (/api/*)
    │    ├─ Image optimization (/api/image)
    │    └─ Strapi proxy (/api/strapi)
    │
    └─→ External Strapi API
         │
         └─→ http://13.53.89.25:1337
              ├─ GET /api/events
              ├─ GET /api/news
              ├─ GET /api/pages
              └─ [Other endpoints]
```

## Component Hierarchy

### Home Page Structure
```
RootLayout
└── page.tsx (Home)
    ├── HeroSection
    │   └── Hero image & title
    ├── AboutSection
    │   └── Organization overview
    ├── EventsSection
    │   └── Latest events grid
    ├── NewsSection
    │   └── Latest news/blog posts
    └── JoinSection
        └── Call-to-action
```

### Association Page Structure
```
RootLayout
└── [slug].tsx (Association)
    ├── HeroSection
    ├── AboutSection
    ├── VisionMissionSection
    ├── GlobalCommunitySection
    ├── LeadershipSection
    ├── GlobalImpactSection
    ├── StrategicPrioritiesSection
    ├── NetZeroSection
    ├── ResearchEducationSection
    └── OurRoleSection
```

### Events Page Structure
```
RootLayout
├── events/page.tsx (Events List)
│   ├── Event filters
│   ├── Event cards grid
│   └── Pagination
└── events/[slug]/page.tsx (Event Detail)
    ├── Event hero image
    ├── Event details
    ├── Event description
    └── Related events
```

## Type System

### Core Types

```typescript
// Home page sections
interface HeroSection {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: CallToAction;
}

interface AboutSection {
  title: string;
  content: string;
  image?: string;
  features?: Feature[];
}

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  attendees?: number;
}

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: Date;
  image?: string;
  author?: string;
}
```

## Configuration Details

### Next.js Configuration (`next.config.ts`)

```typescript
{
  reactCompiler: true,              // Enable React Compiler
  images: {
    unoptimized: true,              // Images not optimized (localhost)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337"                // Strapi running on port 1337
      }
    ]
  }
}
```

### TypeScript Configuration (`tsconfig.json`)

```typescript
{
  compilerOptions: {
    target: "ES2017",               // Target ECMAScript version
    lib: ["dom", "dom.iterable", "esnext"],
    strict: true,                   // Strict type checking
    jsx: "react-jsx",               // JSX transformation
    paths: {
      "@/*": ["./src/*"]            // Path alias for imports
    }
  }
}
```

### Tailwind Configuration

```javascript
// Uses Tailwind CSS 4 with PostCSS
// Custom configurations in globals.css
```

## Environment Variables

### Development (`.env`)
```
NEXT_PUBLIC_STRAPI_URL=http://13.53.89.25:1337
```

### Production (`.env.production`)
```
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
```

**Note**: `NEXT_PUBLIC_*` prefix makes variable available in browser. Use regular `NEXT_` prefix for server-only variables.

## Build & Deployment Process

### Development Build
1. `npm run dev` → Starts dev server on localhost:3000
2. Hot Module Replacement (HMR) enabled
3. Source maps generated for debugging

### Production Build
1. `npm run build`
   - Compiles TypeScript
   - Optimizes with React Compiler
   - Generates static pages
   - Creates optimized bundle

2. `npm run start`
   - Runs production server
   - Serves optimized build
   - Uses Node.js runtime

### Deployment to AWS
- Amplify: Auto-deploys on GitHub push
- ECS/Fargate: Docker container deployment
- App Runner: Git-based deployment

## Performance Optimizations

### Current Optimizations
- ✅ React Compiler enabled
- ✅ Tailwind CSS (utility-first, small footprint)
- ✅ Next.js automatic code splitting
- ✅ Image optimization enabled (remotePatterns)
- ✅ TypeScript for build-time error detection

### Potential Optimizations
- 🔄 Implement ISR (Incremental Static Regeneration)
- 🔄 Add Service Worker for offline support
- 🔄 Image optimization with next/image
- 🔄 API response caching
- 🔄 Lazy loading for below-fold sections

## Security Considerations

### Current Implementation
- ✅ TypeScript strict mode (type safety)
- ✅ ESLint for code quality
- ✅ Environment variables for sensitive data

### Recommended Additions
- 🔒 Add security headers via Next.js middleware
- 🔒 Implement CORS properly
- 🔒 Add rate limiting to API routes
- 🔒 Input validation & sanitization
- 🔒 Content Security Policy (CSP)

## Scalability

### Current Architecture
- Horizontal scaling via load balancer
- Stateless application design
- Decoupled CMS backend

### Scaling Strategies
1. **ECS/Fargate**: Auto-scaling task count based on metrics
2. **CloudFront**: CDN caching for static assets
3. **API Caching**: Cache Strapi API responses
4. **Database**: RDS read replicas for high-traffic scenarios

## Integration Points

### Strapi CMS Integration
- **URL**: http://13.53.89.25:1337
- **API Path**: /api/*
- **Authentication**: API tokens (if required)
- **Content Types**: Events, News, Pages, etc.

### External Services
- **AWS Services**: For hosting & infrastructure
- **DNS Provider**: For domain management
- **Email Service**: (If notification feature added)

## Development Workflow

### Local Development
```bash
1. npm install              # Install dependencies
2. npm run dev             # Start development server
3. npm run lint            # Check code quality
4. npm run build           # Test production build
5. npm run start           # Run production server
```

### Git Workflow
- Main branch: Production-ready code
- Feature branches: Development branches
- Pull requests: Code review before merge

### Deployment
- Push to main → Auto-deploy on Amplify
- Or manually push Docker image to ECR
- Or use GitHub Actions for CI/CD

## Monitoring & Analytics

### Recommended Tools
- **AWS CloudWatch**: Logs, metrics, alarms
- **AWS X-Ray**: Distributed tracing
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring

## Future Enhancements

### Planned Features
- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Search functionality
- [ ] User comments/interactions
- [ ] Admin dashboard
- [ ] Automated testing
- [ ] Storybook for component library

### Technical Debt
- [ ] Add comprehensive test coverage
- [ ] Implement E2E testing
- [ ] Optimize images further
- [ ] Add sitemap generation
- [ ] Implement XML feeds
- [ ] Add PWA support

---

**Last Updated**: January 2025
**Next.js Version**: 16.1.1
**React Version**: 19.2.3
