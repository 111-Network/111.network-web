# @111-network/ui

Shared UI components and design system for the 111 Network monorepo.

## Overview

This package contains:
- **Shared shadcn/ui components** (Button, etc.)
- **Layout components** (Container, Navigation, Footer, AppShell)
- **Theme system** (ThemeProvider, ThemeToggle)
- **Design tokens** (CSS variables, Tailwind preset)
- **Utilities** (cn function for className merging)

## Installation

This package is automatically available in the monorepo workspace. No manual installation needed.

## Usage

### Importing Components

```tsx
import { Button, Container, Navigation, Footer } from "@111-network/ui";
```

### Using Shared Styles

Import the shared styles in your app's `globals.css`:

```css
@import "tailwindcss";
@import "@111-network/ui/styles";
```

### Using Tailwind Preset

In your `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import tailwindPreset from "@111-network/ui/tailwind-preset";

const config: Config = {
  presets: [tailwindPreset],
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
```

### Next.js Configuration

Add to `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ["@111-network/ui"],
};
```

## Components

### Layout Components

#### Container
A responsive container component with size variants.

```tsx
import { Container } from "@111-network/ui";

<Container size="lg">
  <p>Content here</p>
</Container>
```

#### Navigation
Configurable navigation bar with logo, items, and CTAs.

```tsx
import { Navigation } from "@111-network/ui";

<Navigation
  logo={<Logo />}
  items={[
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]}
  ctaItems={<Button>Get Started</Button>}
/>
```

#### Footer
Configurable footer component.

```tsx
import { Footer } from "@111-network/ui";

<Footer
  copyright="© 2024 111 Network"
  links={[
    { label: "Terms", href: "/terms" },
  ]}
  showThemeToggle={true}
/>
```

#### AppShell
Complete app shell with navigation, main content, and footer.

```tsx
import { AppShell } from "@111-network/ui";

<AppShell
  navigation={{ logo: <Logo />, items: [...] }}
  footer={{ copyright: "..." }}
  enableThemeProvider={true}
>
  <YourAppContent />
</AppShell>
```

### UI Components

#### Button
shadcn/ui Button component with variants.

```tsx
import { Button } from "@111-network/ui";

<Button variant="default" size="lg">Click me</Button>
```

### Theme Components

#### ThemeProvider
Wraps your app to enable theme switching.

```tsx
import { ThemeProvider } from "@111-network/ui";

<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>
```

#### ThemeToggle
Button to toggle between light/dark themes.

```tsx
import { ThemeToggle } from "@111-network/ui";

<ThemeToggle />
```

## Adding New Components

When adding new shadcn/ui components:

1. Use `pnpm dlx shadcn@latest add [component]` in this package directory
2. Update `components.json` if needed
3. Export from `src/index.ts`
4. Document in this README

## Design Tokens

All design tokens are defined in `src/styles/globals.css`:
- Colors (primary, secondary, accent, etc.)
- Spacing (section padding, etc.)
- Typography (fonts, sizes)
- Animations (fade-in, slide-in, etc.)
- Border radius
- Transitions

These are available as CSS variables and Tailwind utilities.

## Development

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── layout/       # Layout components
│   ├── lib/
│   │   └── utils.ts     # Utilities (cn function)
│   ├── styles/
│   │   └── globals.css  # Design tokens & base styles
│   └── index.ts         # Barrel exports
├── tailwind-preset.ts   # Shared Tailwind config
├── components.json      # shadcn/ui config
└── package.json
```
