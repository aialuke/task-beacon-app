# Task Beacon - Task Management PWA

A modern, accessible task management Progressive Web Application built with React, TypeScript, and Supabase. Features real-time updates, responsive design, and comprehensive accessibility support.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks with due dates
- **Real-time Updates**: Live synchronization across devices using Supabase realtime
- **Task Status Tracking**: Visual countdown timers and status indicators
- **Follow-up Tasks**: Create related tasks with parent-child relationships
- **Pin Important Tasks**: Quick access to priority tasks
- **User Profiles**: Avatar support and user management

### Technical Features
- **Progressive Web App**: Works offline and installable on mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Performance**: Lazy loading, code splitting, and optimized bundle sizes
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Error Handling**: Centralized error management with user-friendly messages

## 🏗️ Architecture & Code Quality

This project follows modern React and TypeScript best practices with a focus on maintainability, performance, and developer experience.

### Recent Improvements ✨

- ✅ **Utils Standardization Complete** - All utility imports migrated to `@/lib/utils/*` pattern
- ✅ **Zero `any` Types** - Complete TypeScript strict typing throughout codebase  
- ✅ **Error Handling Standardized** - Consistent error handling with proper logging and user feedback
- ✅ **Performance Optimized** - React Query, memoization, and monitoring utilities
- ✅ **Accessibility Enhanced** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Comprehensive Testing** - Unit tests with >80% coverage using Vitest

### Utils Organization 📁

All utilities are now organized under `src/lib/utils/` with standardized imports:

```typescript
// Animation utilities
import { calculateTimerOffset, setupAnimationVariables } from '@/lib/utils/animation';

// Performance monitoring
import { performanceMonitor, measureFunctionPerformance } from '@/lib/utils/performance';

// Error handling
import { handleApiError, setupGlobalErrorHandlers } from '@/lib/utils/error';

// Image processing
import { compressAndResizePhoto, validateImage } from '@/lib/utils/image';

// Notifications & feedback
import { toast, triggerHapticFeedback, showBrowserNotification } from '@/lib/utils/notification';
```

**Legacy imports still work** thanks to re-export compatibility, ensuring zero breaking changes during the transition.

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Animations**: React Spring
- **State Management**: React Query (TanStack Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Testing**: Vitest, Testing Library
- **Build**: Vite with TypeScript

## 📱 Getting Started

### Prerequisites
- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Start development server**
```bash
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |
| `npm run type-check` | TypeScript type checking |

## 🧪 Testing

### Test Coverage
Our testing strategy covers:
- **Unit Tests**: Individual functions and hooks
- **Component Tests**: UI component behavior and accessibility
- **Integration Tests**: Feature workflows and API interactions
- **E2E Tests**: Complete user journeys (planned)

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm run test src/hooks/useTaskMutations.test.ts
```

### Test Files
- `**/*.test.ts(x)` - Unit and integration tests
- `**/__tests__/**` - Component tests
- `src/test/setup.ts` - Test configuration

### Testing Utilities
- **Mock Providers**: Pre-configured test providers for React Query, Auth
- **Test Utilities**: Custom render functions with providers
- **Factory Functions**: Test data generation utilities

## 🔗 API Documentation

### Supabase Integration

#### Database Schema
```sql
-- Users/Profiles
profiles (
  id: uuid PRIMARY KEY,
  email: text UNIQUE NOT NULL,
  name: text,
  avatar_url: text,
  role: text DEFAULT 'user',
  created_at: timestamp,
  updated_at: timestamp
)

-- Tasks
tasks (
  id: uuid PRIMARY KEY,
  title: text NOT NULL,
  description: text,
  status: task_status DEFAULT 'pending',
  priority: task_priority DEFAULT 'medium',
  due_date: timestamp,
  owner_id: uuid REFERENCES profiles(id),
  assigned_to: uuid REFERENCES profiles(id),
  parent_task_id: uuid REFERENCES tasks(id),
  pinned: boolean DEFAULT false,
  url_link: text,
  photo_url: text,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### API Endpoints
All API calls go through Supabase client with automatic error handling:

**Tasks API** (`src/integrations/supabase/api/tasks.api.ts`)
- `getTasks(options)` - Get paginated tasks with filters
- `getTask(id)` - Get single task by ID
- `createTask(data)` - Create new task
- `updateTask(id, data)` - Update existing task
- `deleteTask(id)` - Delete task
- `toggleTaskComplete(id)` - Toggle task completion
- `toggleTaskPin(id)` - Toggle task pin status
- `createFollowUpTask(parentId, data)` - Create follow-up task

**Users API** (`src/integrations/supabase/api/users.api.ts`)
- `getAllUsers()` - Get all users (admin)
- `getUserById(id)` - Get user profile
- `updateUserProfile(data)` - Update user profile

### Error Handling
Centralized error handling via `handleApiError()`:
```typescript
import { handleApiError } from '@/lib/errorHandling';

try {
  const result = await apiCall();
} catch (error) {
  handleApiError(error, 'Operation failed', {
    showToast: true,
    logToConsole: true,
    rethrow: false
  });
}
```

## 🎨 UI Components

### Component Library
Built on [shadcn/ui](https://ui.shadcn.com/) with custom extensions:

**Base Components** (`src/components/ui/`)
- `Button` - Various button styles and states
- `Card` - Content containers
- `Dialog` - Modal dialogs
- `Form` - Form components with validation
- `Toast` - Notification system
- `Skeleton` - Loading placeholders

**Custom Components**
- `SimpleNavbar` - Animated navigation with keyboard support
- `CountdownTimer` - Task deadline visualization
- `TaskCard` - Task display with animations
- `UserProfile` - User information display

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support throughout
- **Screen Reader**: ARIA labels and semantic HTML
- **Focus Management**: Proper focus flow and indicators
- **Color Contrast**: WCAG AA compliant colors
- **Motion Preferences**: Respects `prefers-reduced-motion`

## ⚡ Performance

### Optimization Strategies
- **Code Splitting**: Lazy-loaded routes and components
- **Bundle Analysis**: Optimized chunk sizes
- **Image Optimization**: Lazy loading and WebP support
- **Caching**: React Query caching strategies
- **Memory Management**: Proper cleanup and leak prevention

### Build Optimization
- **Tree Shaking**: Dead code elimination
- **Minification**: Compressed assets
- **Gzip Compression**: Server-side compression
- **CDN Ready**: Optimized for content delivery

## 🔒 Security

### Authentication & Authorization
- **Supabase Auth**: Secure user authentication
- **Row Level Security**: Database-level permissions
- **JWT Tokens**: Secure API access
- **Role-based Access**: User role management

### Data Validation
- **Input Sanitization**: XSS prevention
- **Schema Validation**: Type-safe data handling
- **Rate Limiting**: API abuse prevention
- **CSRF Protection**: Cross-site request forgery prevention

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options

**Lovable Deployment**
1. Visit [Lovable Project](https://lovable.dev/projects/5577a4ee-c8f7-431c-876d-05403bb6de17)
2. Click Share → Publish
3. Configure custom domain if needed

**Manual Deployment**
- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repo
- **AWS S3/CloudFront**: Build and upload to S3

### Environment Variables
Required for production:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Create** a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Semantic commit messages
- **Testing**: Tests required for new features

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components have accessibility attributes
- [ ] Error handling is implemented
- [ ] Tests cover new functionality
- [ ] Performance implications considered
- [ ] Documentation updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

### Troubleshooting

**Common Issues:**
- **Build Errors**: Check Node.js version (18+ required)
- **Type Errors**: Run `npm run type-check` for detailed errors
- **Test Failures**: Ensure test environment is properly set up
- **Supabase Errors**: Verify environment variables and database setup

**Performance Issues:**
- Check React DevTools Profiler
- Analyze bundle size with `npm run build`
- Monitor real-time subscriptions for memory leaks

---

**Built with ❤️ using React, TypeScript, and Supabase**
