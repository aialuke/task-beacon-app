# Task Beacon - Modern Task Management App

A comprehensive task management Progressive Web Application (PWA) built with React, TypeScript, and
Supabase.

## Features

- **Task Management**: Create, edit, delete, and organize tasks with due dates
- **Photo Attachments**: Add photos to tasks with automatic compression
- **User Collaboration**: Assign tasks to team members
- **Real-time Updates**: Live synchronization across devices
- **Responsive Design**: Optimized for desktop and mobile
- **Performance Optimized**: Bundle splitting and lazy loading for fast load times

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query, React Context
- **Testing**: Vitest, React Testing Library
- **Routing**: React Router v7

## Project Structure

```
src/
├── features/         # Feature-based modules (tasks, users, auth, dashboard, profile)
│   └── tasks/        # Task management feature
│       ├── components/   # Task-specific components
│       ├── hooks/        # Task-related hooks
│       ├── services/     # Task API services
│       └── types/        # Task type definitions
├── shared/           # Shared resources across features
│   ├── components/   # Reusable UI components (shadcn/ui)
│   ├── services/     # API services and Supabase integration
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities and helpers
├── pages/            # Route components (React Router v7)
├── hooks/            # Global custom React hooks
├── lib/              # Core utilities and configurations
├── test/             # Testing utilities and setup
└── styles/           # Global CSS and styling files
```

## Architecture Highlights

- **Feature-First Organization**: Each feature is self-contained with its own components, hooks,
  services, and types
- **Service Layer Abstraction**: Clean API boundaries with centralized Supabase integration
- **Lazy Loading**: Feature modules load on-demand for optimal performance
- **Centralized Testing**: Unified testing utilities and patterns
- **Type Safety**: Comprehensive TypeScript coverage with strict mode

## Performance Features

- **Code Splitting**: Heavy components loaded on-demand
- **Image Optimization**: Automatic compression and WebP support
- **Bundle Optimization**: Feature-based lazy loading and service chunking
- **Caching**: Intelligent query caching with TanStack Query
- **Build Performance**: Sub-3-second builds with optimal chunking

## Development

This project uses modern development practices including:

- TypeScript strict mode with comprehensive type coverage
- Feature-first architecture for scalable team collaboration
- Comprehensive testing with Vitest and React Testing Library
- Performance monitoring and bundle optimization
- Code quality tools (ESLint, Prettier, Knip)

For detailed development guidelines, see the documentation in the `docs/` directory.
