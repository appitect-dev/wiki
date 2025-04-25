---
sidebar_position: 1
---

# Project Setup and Configuration

This guide covers how to set up a new Next.js project and understand its basic configuration.

## Prerequisites

Before starting, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm (comes with Node.js)
- A code editor (VS Code recommended)

## Creating a New Project

```bash
# Create a new Next.js project with TypeScript
npx create-next-app@latest my-app --typescript --tailwind --eslint

# Navigate to project directory
cd my-app

# Start the development server
npm run dev
```

## Project Structure

```plaintext
my-app/
├── .env                 # Environment variables
├── .env.local          # Local environment variables (git ignored)
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── public/            # Static files (images, fonts, etc.)
├── src/
│   ├── app/           # App router pages and layouts
│   ├── components/    # Reusable React components
│   ├── lib/          # Utility functions and shared logic
│   ├── styles/       # Global styles and CSS modules
│   └── types/        # TypeScript type definitions
└── node_modules/     # Project dependencies
```

## Important Configuration Files

### package.json

The `package.json` file manages your project's dependencies and scripts:

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "autoprefixer": "^10.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json

TypeScript configuration for your project:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Environment Variables

### Local Development

Create a `.env.local` file for local development:

```plaintext
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_VERSION=v1

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_CLIENT_ID=your-client-id

# Feature Flags
NEXT_PUBLIC_ENABLE_FEATURE_X=true
```

Note: Only variables prefixed with `NEXT_PUBLIC_` are accessible in the browser.

### Production Environment

Create a `.env.production` file for production:

```plaintext
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_API_VERSION=v1
```

## Next Steps

1. Learn about [Backend Integration](./backend-integration.md)
2. Explore [Component Development](./components.md)
3. Study [State Management](./state-management.md) 