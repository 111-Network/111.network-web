# AI Agent Mode Rules

## Project Context

This is the **111 Network website** - a Next.js 16 frontend application built with:
- **Framework**: Next.js 16.1+ (App Router)
- **React**: 19.0+
- **TypeScript**: 5.7+
- **Styling**: Tailwind CSS 4.1+
- **Theme**: Dark mode by default, using `next-themes`
- **Fonts**: Geist Sans (primary), Geist Mono (monospace)

## Code Standards

### TypeScript
- Use strict TypeScript with full type coverage
- Avoid `any` - use proper types or `unknown`
- Define interfaces for component props
- Use type inference where appropriate

### React Components
- Use functional components with hooks
- Prefer `"use client"` directive only when needed (interactivity, hooks, browser APIs)
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use React.memo() sparingly, only for performance-critical components

### File Organization
- Components: `components/` directory
- Pages/Routes: `app/` directory (App Router)
- Utilities: `lib/` directory
- Types: Co-locate with components or in `lib/types.ts` if shared
- Styles: Tailwind classes (prefer utility classes over custom CSS)

### Styling Guidelines
- Use Tailwind utility classes exclusively
- Follow mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Use design tokens from `globals.css` (CSS variables)
- Theme colors: `primary`, `accent`, `muted`, `foreground`, `background`
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Component Patterns
- Export components as named exports
- Use TypeScript interfaces for props
- Include `className?: string` prop for styling flexibility
- Use `cn()` for merging class names
- **shadcn/ui components**: When using shadcn/ui components, refer to [shadcnblocks.com](https://docs.shadcnblocks.com/) for block patterns and examples

### Performance
- Use Next.js Image component for images
- Implement code splitting with dynamic imports when appropriate
- Avoid unnecessary re-renders (use React hooks properly)
- Clean up event listeners and subscriptions in useEffect cleanup

### Accessibility
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain WCAG 2.1 AA compliance target

## Development Workflow

### Before Making Changes
1. Check existing components for patterns to follow
2. Review `docs/specs/` for feature requirements
3. Check `docs/adr/` for architectural decisions
4. Ensure TypeScript types are correct

### When Creating Components
1. Create in `components/` directory
2. Use PascalCase for component files (`ComponentName.tsx`)
3. Export as named export
4. Include TypeScript interface for props
5. Add `"use client"` only if needed

### When Modifying Pages
1. Pages are in `app/` directory
2. Use Server Components by default
3. Add `"use client"` only when needed
4. Follow Next.js 16 App Router conventions

## Important Notes

### Summary Format (CRITICAL)
**After each Agent Mode session, provide a SHORT summary:**
- Use bullet points only
- Keep it concise (3-5 bullets max)
- **Only mention items that need user attention** (errors, warnings, decisions needed)
- Skip routine confirmations like "all changes completed successfully"
- Example format:
  ```
  - Fixed navigation button alignment
  - Updated hero section layout
  - ⚠️ Need decision: color scheme for new component
  ```

### Error Handling
- Always check for linter errors after making changes
- Fix TypeScript errors immediately
- Handle edge cases in components
- Validate user inputs

### Testing
- Ensure changes don't break existing functionality
- Test responsive behavior on different screen sizes
- Verify dark/light theme compatibility (if applicable)

## Common Patterns

### Component Structure
```typescript
"use client"; // Only if needed

import * as React from "react";
import { cn } from "@/lib/utils";

interface ComponentProps {
  className?: string;
  // other props
}

export function Component({ className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  );
}
```

### Using Theme Colors
```typescript
// In Tailwind classes
className="bg-primary text-primary-foreground"
className="border-border"
className="text-muted-foreground"

// In CSS/globals.css
color: hsl(var(--primary));
```

### Responsive Design
```typescript
className="text-base sm:text-lg md:text-xl lg:text-2xl"
className="flex-col md:flex-row"
```

## What NOT to Do

- ❌ Don't create unnecessary wrapper components
- ❌ Don't use inline styles (use Tailwind classes)
- ❌ Don't ignore TypeScript errors
- ❌ Don't commit secrets or API keys
- ❌ Don't create components without TypeScript types
- ❌ Don't use `any` type
- ❌ Don't forget to clean up event listeners
- ❌ Don't create overly long components (split if >200 lines)

## Project-Specific Conventions

- Navigation uses `GlitchText` component for special effects
- Theme provider is configured in `app/layout.tsx`
- Use `AnimatedSection` for scroll-triggered animations
- Container component provides consistent max-width
- Section component handles spacing and layout
- **UI Components**: Reference [shadcnblocks.com](https://docs.shadcnblocks.com/) for shadcn/ui block patterns and implementation examples
