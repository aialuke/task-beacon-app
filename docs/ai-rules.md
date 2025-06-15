# AI Rules Documentation

## Rule Hierarchy and Organization

This project uses a structured approach to AI assistant rules, organized in a hierarchical directory
structure under `.cursor/rules/`. The rules are designed to provide focused, non-overlapping
guidance for different aspects of the codebase.

### Directory Structure

```
.cursor/rules/
├── core/                    # Fundamental development patterns
│   ├── react-typescript.mdc # React + TypeScript best practices
│   └── performance.mdc      # Performance optimization guidelines
├── tech-specific/           # Technology-specific rules
│   ├── supabase.mdc        # Database and authentication patterns
│   └── tailwind.mdc        # CSS and UI component guidelines
└── general/                 # General development guidelines
    ├── code-style.mdc      # Code organization and naming
    └── ai-behavior.mdc     # AI assistant behavior guidelines
```

## Rule Application

Each rule file includes specific file glob patterns that determine when the rule applies:

### Core Rules

- **react-typescript.mdc**: Applies to `src/**/*.{tsx,jsx,ts}`, `src/components/**/*`,
  `src/features/**/*`, `src/hooks/**/*`, `src/pages/**/*`
- **performance.mdc**: Applies to `src/**/*`, `vite.config.ts`, `tailwind.config.js`

### Tech-Specific Rules

- **supabase.mdc**: Applies to `src/lib/supabase/**/*`, `src/services/**/*`,
  `src/hooks/**/use*Query*`, `src/hooks/**/use*Mutation*`
- **tailwind.mdc**: Applies to `src/**/*.{tsx,jsx,ts}`, `src/components/**/*`, `tailwind.config.js`,
  `src/styles/**/*.css`

### General Rules

- **code-style.mdc**: Applies to `src/**/*.{ts,tsx,js,jsx}`, `*.config.{ts,js}`,
  `src/**/*.test.{ts,tsx}`
- **ai-behavior.mdc**: Applies to all file operations and code assistance

## Rule Precedence

1. **Most Specific First**: Tech-specific rules take precedence when they conflict with general
   rules
2. **Core Over General**: Core development patterns override general guidelines
3. **Explicit Over Implicit**: Specific file glob matches take precedence over broader patterns

## Key Principles

### No Duplication

- Each rule file covers distinct aspects of development
- Common patterns are consolidated into focused files
- Overlapping guidance has been merged into comprehensive rules

### Clarity and Focus

- Terminology is clarified (e.g., "classes" refers to CSS utility classes, not OOP classes)
- Each rule file has a single, well-defined purpose
- Guidelines are actionable and specific

### Technology Alignment

- Rules reflect the actual tech stack (React 18, TypeScript, Supabase, Tailwind)
- Patterns align with modern best practices
- Framework-specific guidance is properly segregated

## Maintenance

### Adding New Rules

1. Determine the appropriate category (core, tech-specific, or general)
2. Use specific file glob patterns to target relevant files
3. Ensure no overlap with existing rules
4. Update this documentation

### Updating Existing Rules

1. Maintain the established directory structure
2. Keep file glob patterns accurate and specific
3. Avoid reintroducing duplicate guidance
4. Test rule changes with relevant file patterns

### Rule Validation

- Rules should be testable against actual codebase files
- File glob patterns should match the intended scope
- Guidelines should be actionable and measurable
- Conflicts between rules should be resolved before deployment

## Integration with Development Workflow

These rules are designed to work with Cursor's AI assistant to provide:

- Context-aware code suggestions
- Consistent styling and patterns
- Proper error handling and performance optimization
- Technology-specific best practices
- Maintainable code organization

The rule structure supports both individual developer productivity and team consistency across the
entire codebase.
