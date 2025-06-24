# ESLint Mobile-First Interactive Feedback Rule

## Overview

Custom ESLint plugin that prevents hover-only interaction patterns and enforces mobile-first
accessibility compliance. This rule ensures that hover states are always accompanied by
corresponding active and focus-visible states for touch device users and keyboard navigation.

## Installation

The plugin is already configured in `eslint.config.js` and ready to use. No additional installation
required.

## Rule: `mobile-first/hover-without-active`

### Purpose

Detects and prevents hover-only interaction patterns that create accessibility gaps for:

- Touch device users (mobile/tablet)
- Keyboard navigation users
- Screen reader users

### Configuration

```javascript
'mobile-first/hover-without-active': [
  'error',
  {
    requireFocusVisible: true,    // Require focus-visible states for keyboard navigation
    requireActive: true,          // Require active states for touch feedback
    allowExceptions: [            // Array of hover patterns to exclude from checking
      'hover:scale-*',
      'hover:rotate-*',
      'hover:transform',
    ]
  }
]
```

### Detected Violations

The rule detects these common patterns:

#### ❌ Hover-Only Violations

```tsx
// Missing both active and focus-visible states
<button className="bg-blue-500 hover:bg-blue-600">
  Button
</button>

// Missing active state
<a className="text-primary hover:underline focus-visible:underline">
  Link
</a>

// Missing focus-visible state
<div className="opacity-70 hover:opacity-100 active:opacity-100">
  Container
</div>
```

#### ✅ Correct Mobile-First Patterns

```tsx
// Complete interaction states
<button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus-visible:bg-blue-700">
  Button
</button>

// Complete link states
<a className="text-primary hover:underline active:underline focus-visible:underline transition-colors duration-200">
  Link
</a>

// Container with focus-within for child focus
<div className="bg-background/60 hover:bg-background/70 active:bg-background/75 focus-within:bg-background/75">
  <input type="text" />
</div>
```

### Error Messages

The rule provides specific error messages:

- `missingBothStates`: When both active and focus-visible states are missing
- `missingActiveState`: When only active state is missing
- `missingFocusState`: When only focus-visible state is missing

### Auto-Fix Support

The rule includes basic auto-fix functionality that will:

1. Detect hover classes
2. Generate corresponding active and focus-visible classes
3. Add them to the className attribute

Example auto-fix:

```tsx
// Before (triggers error)
<button className="hover:bg-blue-600">Button</button>

// After auto-fix
<button className="hover:bg-blue-600 active:bg-blue-600 focus-visible:bg-blue-600">Button</button>
```

### Context7-Validated Patterns

The rule enforces patterns validated against official Tailwind CSS documentation:

#### Background Changes

```tsx
// Pattern: hover:bg-background/70
// Required: hover:bg-background/70 active:bg-background/75 focus-within:bg-background/75
```

#### Link Underlines

```tsx
// Pattern: hover:underline
// Required: hover:underline active:underline focus-visible:underline
```

#### Opacity Changes

```tsx
// Pattern: hover:opacity-100
// Required: hover:opacity-100 active:opacity-100 focus-visible:opacity-100
```

#### Color/Text Changes

```tsx
// Pattern: hover:text-foreground
// Required: hover:text-foreground active:text-foreground focus-visible:text-foreground
```

#### Border Changes

```tsx
// Pattern: hover:border-primary/50
// Required: hover:border-primary/50 active:border-primary/60 focus-visible:border-primary/60
```

#### Shadow Changes

```tsx
// Pattern: hover:shadow-md
// Required: hover:shadow-md active:shadow-md focus-visible:shadow-md
```

### Exceptions

Configure exceptions for special cases where active/focus states might not be appropriate:

```javascript
allowExceptions: [
  'hover:scale-*', // Scale transformations
  'hover:rotate-*', // Rotation transformations
  'hover:transform', // Generic transforms
  'hover:animate-*', // Animations
];
```

### Integration with Development Workflow

1. **Pre-commit hooks**: The rule runs automatically with ESLint in pre-commit hooks
2. **CI/CD pipeline**: Prevents hover-only patterns from reaching production
3. **IDE integration**: Real-time feedback in VS Code and other editors
4. **Auto-fix on save**: Can be configured to auto-fix violations on file save

### Benefits

- **Prevents accessibility regressions**: Catches hover-only patterns before they reach users
- **Educational**: Helps developers learn mobile-first interaction patterns
- **Consistent UX**: Ensures uniform interaction feedback across the application
- **Zero configuration**: Works out of the box with sensible defaults
- **Performance**: Minimal impact on linting performance

### Testing the Rule

To test the rule on a specific file:

```bash
npx eslint path/to/your/file.tsx
```

To run with auto-fix:

```bash
npx eslint path/to/your/file.tsx --fix
```

### Troubleshooting

#### Rule not triggering

1. Ensure the plugin is properly imported in `eslint.config.js`
2. Check that the rule is enabled in the configuration
3. Verify the file is included in ESLint's file patterns

#### False positives

1. Add specific patterns to `allowExceptions` array
2. Use ESLint disable comments for special cases:
   ```tsx
   {
     /* eslint-disable-next-line mobile-first/hover-without-active */
   }
   <div className="hover:scale-105">Special case</div>;
   ```

#### Template literal support

The rule supports basic template literal detection but may miss complex expressions. For complex
cases, consider extracting classes to variables or using disable comments.

## Future Enhancements

- Support for conditional classes (cn(), clsx(), etc.)
- Enhanced template literal parsing
- Integration with Tailwind CSS IntelliSense
- Custom message templates
- Performance optimizations for large codebases
