# Tech Stack Reference - Task Beacon App

> **Project**: Task management application with advanced image processing and real-time collaboration  
> **Architecture**: Feature-based with centralized services  
> **Last Updated**: 2025-01-18

---

## 📋 **Quick Reference**

| **Category** | **Primary Technology** | **Version** |
|--------------|------------------------|-------------|
| **Frontend Framework** | React | 19.1.0 |
| **Language** | TypeScript | 5.5.3 |
| **Build Tool** | Vite | 5.4.1 |
| **Backend/Database** | Supabase | 2.49.6 |
| **State Management** | TanStack Query | 5.56.2 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Testing** | Vitest | 3.2.2 |
| **Routing** | React Router | 7.6.2 |

---

## 🎯 **Frontend Stack**

### **Core Framework**
- **React 19.1.0** - Main UI framework with concurrent features
- **TypeScript 5.5.3** - Static typing with strict configuration
- **Vite 5.4.1** - Development server and build tool
- **React Router DOM 7.6.2** - Client-side routing

### **UI & Styling**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn UI Components** - Via Radix UI primitives:
  - `@radix-ui/react-avatar` (1.1.10)
  - `@radix-ui/react-dialog` (1.1.14)
  - `@radix-ui/react-popover` (1.1.14)
  - `@radix-ui/react-tooltip` (1.2.7)
  - `@radix-ui/react-slot` (1.2.3)
- **Tailwind Animate** (1.0.7) - Animation utilities
- **Class Variance Authority** (0.7.1) - Component variant management
- **Tailwind Merge** (2.5.2) - CSS class merging
- **Lucide React** (0.511.0) - Icon library

### **Animation & Interactions**
- **React Spring** (@react-spring/web 10.0.1) - Physics-based animations
- **Custom CSS animations** - Performance-optimized with GPU acceleration

### **Forms & Validation**
- **Zod** (3.23.8) - Schema validation and type inference
- **React Hook Form** (implied from structure) - Form state management
- **Custom validation hooks** - Feature-specific validation logic

---

## 🔧 **Backend & Infrastructure**

### **Backend-as-a-Service**
- **Supabase** (2.49.6) - Complete backend solution providing:
  - **PostgreSQL Database** - Relational database with real-time subscriptions
  - **Authentication** - Built-in auth with multiple providers
  - **Storage** - File storage for images and documents
  - **Real-time** - WebSocket-based live updates
  - **Edge Functions** - Serverless compute

### **Database Architecture**
- **PostgreSQL** - Via Supabase with:
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Auto-generated TypeScript types
  - Database functions and triggers

### **API Layer**
- **Supabase Client** - Type-safe database client
- **Standardized API Services** - Centralized in `src/lib/api/`
- **Error Handling** - Unified error management
- **Query Optimization** - Intelligent caching and retry logic

---

## 📊 **State Management**

### **Server State**
- **TanStack Query v5** (5.56.2) - Powerful data fetching with:
  - 5-minute stale time default
  - 3-attempt retry logic
  - Optimistic updates
  - Background refetching
  - Cache invalidation

### **Client State**
- **React Context** - For UI state:
  - Theme management
  - Authentication status
  - Mobile/desktop detection
  - Task UI state

### **Form State**
- **Zod-based validation** - Type-safe form schemas
- **Custom hooks** - Feature-specific form logic
- **Real-time validation** - Immediate feedback

---

## 🧪 **Testing Framework**

### **Test Runner**
- **Vitest** (3.2.2) - Fast unit test runner with:
  - JSDOM environment for DOM testing
  - V8 coverage provider
  - Hot reload testing
  - Concurrent test execution

### **Testing Libraries**
- **React Testing Library** (16.3.0) - Component testing
- **Jest DOM** (6.6.3) - Extended DOM matchers
- **JSDOM** (26.1.0) - DOM simulation

### **Test Organization**
```bash
# Test Commands
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
npm run test:components   # Component tests
npm run test:hooks        # Hook tests
npm run test:api          # API tests
npm run test:critical     # Critical path tests
npm run test:coverage     # Coverage reports
npm run test:ci           # CI with JUnit output
```

### **Coverage Targets**
- **Global**: 75% statements, 65% branches, 75% functions/lines
- **API Layer**: 85% across all metrics
- **Hooks**: 70% across all metrics

---

## 🏗️ **Build & Development Tools**

### **Build System**
- **Vite 5.4.1** - Lightning-fast builds with:
  - Hot Module Replacement (HMR)
  - Bundle splitting optimization
  - Source maps (hidden in production)
  - ES modules support
  - SWC for React compilation

### **Bundle Optimization**
```typescript
// Manual chunk splitting in vite.config.ts
manualChunks: {
  vendor: ['react', 'react-dom'],
  tanstack: ['@tanstack/react-query'],
  ui: ['@radix-ui/*'],
  icons: ['lucide-react'],
  router: ['react-router-dom']
}
```

### **Code Quality**
- **ESLint** (9.9.0) - Advanced linting with:
  - React hooks rules
  - Accessibility checks (jsx-a11y)
  - Import organization
  - Tailwind CSS validation
  - Promise best practices
- **Prettier** (3.5.3) - Code formatting with Tailwind plugin
- **TypeScript ESLint** (8.33.1) - TypeScript-specific rules
- **Knip** (5.59.1) - Dead code detection and removal

### **CSS Tools**
- **PostCSS** (8.5.4) - CSS processing
- **Autoprefixer** (10.4.21) - Vendor prefix automation
- **Stylelint** (16.20.0) - CSS linting

---

## 📁 **Architecture Patterns**

### **Feature-Based Structure**
```
src/
├── features/           # Feature modules
│   ├── auth/          # Authentication
│   ├── tasks/         # Task management
│   ├── users/         # User management
│   ├── dashboard/     # Dashboard views
│   └── profile/       # User profiles
├── components/        # Shared UI components
├── lib/              # Utilities & services
├── hooks/            # Global hooks
├── types/            # Type definitions
└── styles/           # CSS organization
```

### **Component Organization**
```
features/{feature}/
├── components/       # Feature UI components
├── hooks/           # Feature-specific hooks
├── services/        # API services
├── types/           # Type definitions
├── context/         # Feature contexts
└── utils/           # Feature utilities
```

### **Styling Architecture**
```
src/styles/
├── base/            # Reset, typography, accessibility
├── components/      # Component-specific styles
├── tokens/          # Design system tokens
├── utilities/       # Custom utilities
└── architecture/    # CSS variables, performance
```

---

## ⚡ **Performance Features**

### **Bundle Optimization**
- **Code Splitting** - Route-based and component-based
- **Tree Shaking** - Dead code elimination
- **Manual Chunks** - Vendor, UI, and feature splitting
- **Dynamic Imports** - Lazy loading for heavy components

### **Image Processing**
- **Enhanced Image Utils** - Located in `src/lib/utils/image/`
- **WebP Conversion** - Automatic format optimization
- **Canvas Processing** - Client-side image manipulation
- **Metadata Extraction** - EXIF and image properties
- **Compression** - Quality and size optimization

### **Runtime Optimizations**
- **GPU Acceleration** - CSS transforms with `transform-gpu`
- **Animation Performance** - React Spring physics-based animations
- **Memory Management** - Intelligent query caching
- **Network Optimization** - Request deduplication

---

## 🔐 **Security & Accessibility**

### **Security**
- **Row Level Security (RLS)** - Database-level permissions
- **Type Safety** - End-to-end TypeScript coverage
- **Input Validation** - Zod schema validation
- **Environment Variables** - Secure configuration management

### **Accessibility**
- **WCAG Compliance** - Comprehensive a11y implementation
- **Screen Reader Support** - Enhanced `.sr-only` utilities
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast** - Windows High Contrast Mode support
- **Reduced Motion** - `prefers-reduced-motion` handling
- **Focus Management** - Advanced focus indicators

---

## 🚀 **Development Workflow**

### **Environment**
- **Node.js** - Version 22+ recommended
- **Development Server** - `http://localhost:8080`
- **Hot Reload** - Instant code updates
- **TypeScript** - Strict mode with path mapping

### **Key Commands**
```bash
# Development
npm run dev              # Start dev server (port 8080)
npm run build            # Production build
npm run build:dev        # Development build

# Code Quality
npm run lint             # ESLint check
npm run format           # Prettier formatting
npm run analyze          # Dead code analysis

# Testing
npm run test             # Interactive testing
npm run test:coverage    # Coverage reports
npm run test:critical    # Critical path validation
```

### **Configuration Files**
- `vite.config.ts` - Build and dev server config
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Styling configuration
- `package.json` - Dependencies and scripts
- `CLAUDE.md` - Project-specific development guidance

---

## 📚 **Key Dependencies Summary**

### **Production Dependencies (26 total)**
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "typescript": "^5.5.3",
  "@supabase/supabase-js": "^2.49.6",
  "@tanstack/react-query": "^5.56.2",
  "react-router-dom": "^7.6.2",
  "tailwindcss": "^3.4.17",
  "zod": "^3.23.8",
  "lucide-react": "^0.511.0",
  "@react-spring/web": "^10.0.1"
}
```

### **Development Dependencies (33 total)**
```json
{
  "vite": "^5.4.1",
  "vitest": "^3.2.2",
  "@vitejs/plugin-react-swc": "^3.5.0",
  "@testing-library/react": "^16.3.0",
  "eslint": "^9.9.0",
  "prettier": "^3.5.3",
  "knip": "^5.59.1"
}
```

---

## 🎯 **Use This Reference For**

1. **Onboarding new developers** - Complete tech stack overview
2. **Architecture decisions** - Understanding current patterns
3. **Dependency updates** - Version tracking and compatibility
4. **Performance optimization** - Leveraging existing tools
5. **Testing strategy** - Understanding coverage and tools
6. **Build optimization** - Bundle splitting and configuration
7. **Code quality** - Linting and formatting setup
8. **Feature development** - Following established patterns

---

**Last Updated**: 2025-01-18  
**Project Version**: 0.0.0  
**Node Version**: 22+  
**Package Manager**: npm