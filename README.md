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

- **Frontend**: React 19.1.0, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query, React Context
- **Testing**: Vitest, React Testing Library

## Project Structure

```
src/
├── components/        # Reusable UI components
├── features/         # Feature-based modules (tasks, users, auth)
├── lib/             # Utilities, API services, and configurations
├── hooks/           # Custom React hooks
├── schemas/         # Zod validation schemas
├── types/           # TypeScript type definitions
└── styles/          # CSS and styling files
```

## Performance Features

- **Code Splitting**: Heavy components loaded on-demand
- **Image Optimization**: Automatic compression and WebP support
- **Bundle Optimization**: Lazy loading for form components and image processing
- **Caching**: Intelligent query caching with TanStack Query

## Development

This project uses modern development practices including TypeScript strict mode, comprehensive
testing, and performance monitoring.

For detailed development guidelines, see the `CLAUDE.md` file and documentation in the
`.cursor/rules/` directory.
