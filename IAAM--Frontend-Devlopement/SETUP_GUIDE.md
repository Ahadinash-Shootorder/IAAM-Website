# Local Development Setup Guide

## Prerequisites

### System Requirements
- **macOS**: 10.14+, or **Linux**: Ubuntu 18.04+, or **Windows**: 10/11 with WSL2
- **Node.js**: 18.17+ (18.18+, 19, or 20 recommended)
- **npm**: 9.6.7+
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Check Your System
```bash
node --version        # Should be v18.17.0 or higher
npm --version        # Should be 9.6.7 or higher
git --version        # Should be latest
```

## Installation Steps

### 1. Clone Repository
```bash
# Clone the project
git clone https://github.com/techlead-shootorder/iiam.git

# Navigate to project directory
cd iiam

# Check current branch
git branch -a
```

### 2. Install Dependencies
```bash
# Clear npm cache (optional but recommended)
npm cache clean --force

# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

Expected output should show:
```
iaam-website@0.1.0
├── clsx@2.1.1
├── lucide-react@0.562.0
├── next@16.1.1
├── react@19.2.3
├── react-dom@19.2.3
├── react-icons@5.5.0
├── tailwind-merge@3.4.0
└── (dev dependencies...)
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env .env.local

# Edit with your values
nano .env.local
# or
code .env.local
```

Content should be:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Note**: During development, Strapi runs on localhost:1337. For production, this will be the AWS EC2 instance.

### 4. Start Development Server
```bash
# Start development server
npm run dev

# Output should show:
# > iaam-website@0.1.0 dev
# > next dev
#
# ▲ Next.js 16.1.1
# - Local:        http://localhost:3000
# - Environments: .env.local
```

Open browser and visit: **http://localhost:3000**

## Strapi CMS Setup

### Option A: Using Existing AWS Instance (Recommended for Development)

The Strapi backend is already running on: `http://13.53.89.25:1337`

To use the production Strapi during development:
```bash
# In .env.local, set:
NEXT_PUBLIC_STRAPI_URL=http://13.53.89.25:1337
```

### Option B: Local Strapi Setup

If you need to run Strapi locally:

```bash
# Install Strapi globally
npm install -g @strapi/cli

# Create new Strapi project
strapi new iiam-cms --quickstart

# Navigate to CMS directory
cd iiam-cms

# Start Strapi server
npm run develop

# Strapi admin available at: http://localhost:1337/admin
```

**Database**: SQLite (default, for development)

## Verify Installation

### Run Tests & Linting
```bash
# Run linter
npm run lint

# Expected: No errors (ESLint warnings OK for now)
```

### Build for Production
```bash
# Test production build locally
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ...

# View build output
du -sh .next/
```

### Start Production Server
```bash
# Run production server
npm start

# Visit: http://localhost:3000
```

## Development Workflow

### Create a Feature Branch
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Example: git checkout -b feature/add-dark-mode
```

### Development Cycle
```bash
# 1. Make changes to files in src/
# 2. Dev server auto-reloads

# 3. Run linter periodically
npm run lint

# 4. Build to check for type errors
npm run build

# 5. Commit changes
git add .
git commit -m "feat: description of changes"

# 6. Push to remote
git push origin feature/your-feature-name

# 7. Create Pull Request on GitHub
```

## Common Tasks

### Adding a New Page
```typescript
// src/app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about IAAM',
};

export default function AboutPage() {
  return (
    <main>
      <h1>About IAAM</h1>
      {/* Page content */}
    </main>
  );
}
```

### Creating a New Component
```typescript
// src/components/CustomSection.tsx
interface CustomSectionProps {
  title: string;
  content: string;
}

export default function CustomSection({ title, content }: CustomSectionProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p>{content}</p>
      </div>
    </section>
  );
}
```

### Fetching Data from Strapi
```typescript
// src/lib/strapi.ts
export async function fetchStrapiData(endpoint: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${endpoint}`
  );
  
  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.statusText}`);
  }
  
  return response.json();
}
```

Usage in components:
```typescript
// src/components/EventsList.tsx
import { fetchStrapiData } from '@/lib/strapi';

export default async function EventsList() {
  const { data: events } = await fetchStrapiData('events');
  
  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

### Using Tailwind CSS
```typescript
// Example: Styling with Tailwind
<div className="flex flex-col md:flex-row gap-4 p-6">
  <div className="w-full md:w-1/2 bg-blue-500 text-white p-4 rounded-lg">
    <h2 className="text-2xl font-bold mb-2">Heading</h2>
    <p className="text-sm">Content here</p>
  </div>
</div>
```

### Type Safety
```typescript
// Define types for Strapi responses
// src/types/strapi.ts
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
}

// Use in components
import { StrapiResponse, Event } from '@/types/strapi';

const response: StrapiResponse<Event> = await fetchStrapiData('events');
```

## Debugging

### VS Code Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    }
  ]
}
```

### Browser DevTools
- **Chrome/Edge**: F12 or Right-click → Inspect
- **React DevTools**: Install browser extension
- **Network Tab**: Monitor API calls
- **Console**: View errors and logs

### Logging
```typescript
// Add console logs strategically
console.log('Data:', data);
console.error('Error:', error);
console.time('fetchTime');
// ... code ...
console.timeEnd('fetchTime');
```

### Check Environment Variables
```bash
# Create debug route
// src/app/api/debug/route.ts
export async function GET() {
  return Response.json({
    strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
  });
}

# Visit http://localhost:3000/api/debug
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Error
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start again
npm run dev
```

### Strapi Connection Issues
```bash
# Check if Strapi is running
curl http://13.53.89.25:1337/api/health

# Check environment variable
echo $NEXT_PUBLIC_STRAPI_URL

# Test API endpoint
curl http://13.53.89.25:1337/api/events
```

### Build Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting errors
npm run lint

# Fix fixable errors
npx eslint . --fix
```

### Memory Issues
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## IDE Setup

### VS Code Extensions (Recommended)
1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **ESLint**
5. **Thunder Client** or **REST Client**
6. **Git Graph**
7. **GitHub Copilot** (optional)

### Settings (`.vscode/settings.json`)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Performance Tips

### Development
- Use `npm run dev` for development (fast refresh)
- Keep DevTools closed unless debugging
- Clear browser cache periodically
- Use separate terminal for log monitoring

### Code
- Lazy load images with `next/image`
- Use React.memo for expensive components
- Avoid inline functions in render
- Minimize bundle size with dynamic imports

```typescript
// Example: Dynamic import
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

## Git Workflow

### Commit Message Format
```
type(scope): subject

feat(header): add dark mode toggle
fix(events): correct date formatting
docs(readme): update setup instructions
style(buttons): adjust padding
refactor(types): simplify interfaces
test(events): add unit tests
```

### Before Pushing
```bash
# Update from main
git fetch origin
git rebase origin/main

# Lint and build
npm run lint
npm run build

# Push changes
git push origin feature/your-feature
```

## Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Strapi Documentation](https://docs.strapi.io)

### Learning Resources
- [Next.js by Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [React Patterns](https://reactpatterns.com)
- [Tailwind UI Components](https://tailwindui.com)

### Tools
- [Excalidraw](https://excalidraw.com): Diagrams
- [Figma](https://figma.com): Design
- [Postman](https://postman.com): API testing
- [jsoncrack.com](https://jsoncrack.com): JSON visualization

## Additional Help

### Get Help
```bash
# View Next.js help
npx next --help

# Check version compatibility
npm outdated

# Update packages (be careful!)
npm update
```

### Report Issues
If you encounter issues:
1. Check existing GitHub issues
2. Check this documentation
3. Post on project discussions
4. Contact team members

---

**Last Updated**: January 2025
**Node.js Version**: 18.17+ recommended
**Next.js Version**: 16.1.1
