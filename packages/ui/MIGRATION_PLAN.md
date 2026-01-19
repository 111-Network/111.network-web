# Migration Plan: apps/website → packages/ui

This document outlines the safe, incremental migration of shared components from `apps/website` to `packages/ui`.

## Migration Strategy

**Principle**: Copy first, switch imports, verify, then delete. Never break the live site.

## Phase 1: Setup (✅ Complete)
- [x] Create `packages/ui` package structure
- [x] Set up shared theme CSS
- [x] Create Tailwind preset
- [x] Set up shadcn utilities
- [x] Create base layout components

## Phase 2: Add packages/ui to apps (✅ Complete)
- [x] Add `@111-network/ui` dependency to `apps/website`
- [x] Add `@111-network/ui` dependency to `apps/map`
- [x] Update Next.js configs to transpile `@111-network/ui`
- [x] Update Tailwind configs to use preset
- [x] Import shared styles in both apps
- [ ] Verify both apps build ⬅️ **DO THIS FIRST**

## Phase 3: Component Migration (Safe, Incremental)

### Table of Files to Migrate

| Source File | Target Location | Action | Status | Notes |
|------------|----------------|--------|--------|-------|
| `apps/website/lib/utils.ts` | `packages/ui/src/lib/utils.ts` | ✅ Already copied | ✅ Complete | Core utility function |
| `apps/website/components/ui/button.tsx` | `packages/ui/src/components/ui/button.tsx` | ✅ Already copied | ✅ Complete | shadcn Button component |
| `apps/website/components/container.tsx` | `packages/ui/src/components/layout/container.tsx` | ✅ Already copied | ✅ Complete | Layout component |
| `apps/website/components/theme-provider.tsx` | `packages/ui/src/components/layout/theme-provider.tsx` | ✅ Already copied | ✅ Complete | Theme wrapper |
| `apps/website/components/theme-toggle.tsx` | `packages/ui/src/components/layout/theme-toggle.tsx` | ✅ Already copied | ✅ Complete | Theme switcher |
| `apps/website/components/navigation.tsx` | `packages/ui/src/components/layout/navigation.tsx` | ✅ Already copied | ⚠️ Modified | Made configurable with props |
| `apps/website/components/footer.tsx` | `packages/ui/src/components/layout/footer.tsx` | ✅ Already copied | ⚠️ Modified | Made configurable with props |
| `apps/website/app/globals.css` | `packages/ui/src/styles/globals.css` | ✅ Already copied | ✅ Complete | All design tokens |
| `apps/website/tailwind.config.ts` | `packages/ui/tailwind-preset.ts` | ✅ Already copied | ✅ Complete | Shared Tailwind config |

### Files to Keep in apps/website (App-Specific)

These files should **NOT** be migrated as they are app-specific:

- `apps/website/components/glitch-text.tsx` - App-specific animation component
- `apps/website/components/gradient-background.tsx` - App-specific background
- `apps/website/components/hero216.tsx` - App-specific hero section
- `apps/website/components/animated-section.tsx` - App-specific animation
- `apps/website/components/section.tsx` - App-specific section wrapper
- `apps/website/components/typewriter-text.tsx` - App-specific text effect
- `apps/website/components/terms-banner.tsx` - App-specific banner
- `apps/website/components/magicui/*` - App-specific UI components
- `apps/website/lib/theme.ts` - App-specific theme logic (if any)

## Phase 4: Incremental Migration Steps

### Step 1: Add packages/ui without changing website (Safe)
1. ✅ Install `@111-network/ui` in `apps/website/package.json`
2. ✅ Update `apps/website/next.config.ts` to transpile `@111-network/ui`
3. ✅ Update `apps/website/tailwind.config.ts` to use preset
4. ✅ Import `@111-network/ui/styles` in `apps/website/app/globals.css`
5. ✅ Verify `apps/website` builds successfully
6. ✅ Deploy to Vercel preview and verify site works

### Step 2: Migrate Button Component (Low Risk)
1. Update `apps/website` imports:
   - Change: `import { Button } from "@/components/ui/button"`
   - To: `import { Button } from "@111-network/ui"`
2. Verify all Button usages work
3. Build and test
4. **After verification**: Delete `apps/website/components/ui/button.tsx`

### Step 3: Migrate Container Component (Low Risk)
1. Update `apps/website` imports:
   - Change: `import { Container } from "@/components/container"`
   - To: `import { Container } from "@111-network/ui"`
2. Verify all Container usages work
3. Build and test
4. **After verification**: Delete `apps/website/components/container.tsx`

### Step 4: Migrate Theme Components (Low Risk)
1. Update `apps/website/app/layout.tsx`:
   - Change: `import { ThemeProvider } from "@/components/theme-provider"`
   - To: `import { ThemeProvider } from "@111-network/ui"`
2. Update theme toggle imports similarly
3. Build and test
4. **After verification**: Delete theme component files

### Step 5: Migrate Navigation Component (Medium Risk - Customization Needed)
1. Update `apps/website` to use new Navigation props:
   ```tsx
   // Before
   <Navigation />
   
   // After
   <Navigation
     logo={<GlitchText>111 Network</GlitchText>}
     items={[
       { label: "Home", href: "/" },
       { label: "Network", href: "/network" },
       // ... etc
     ]}
     ctaItems={
       <>
         <Link href="/broadcast">Broadcast</Link>
         <a href="https://github.com/111-Network">Get Involved</a>
       </>
     }
   />
   ```
2. Build and test thoroughly
3. **After verification**: Delete `apps/website/components/navigation.tsx`

### Step 6: Migrate Footer Component (Low Risk)
1. Update `apps/website` to use new Footer props:
   ```tsx
   <Footer
     copyright="© 2024 111 Network. Open Source."
     links={[
       { label: "Terms", href: "/terms" }
     ]}
   />
   ```
2. Build and test
3. **After verification**: Delete `apps/website/components/footer.tsx`

### Step 7: Remove Duplicate Utils (Low Risk)
1. Update all `@/lib/utils` imports to `@111-network/ui`
2. Build and test
3. **After verification**: Delete `apps/website/lib/utils.ts` (or keep as re-export if needed)

### Step 8: Clean Up (Final)
1. Remove unused `components/ui/.gitkeep` if empty
2. Update any remaining imports
3. Final build verification
4. Deploy to production

## Rollback Plan

If any step fails:
1. Revert the import changes in that step
2. Keep the old component files
3. Document the issue
4. Fix in `packages/ui` and retry

## Verification Checklist

After each migration step:
- [ ] `pnpm build` succeeds in `apps/website`
- [ ] `pnpm build` succeeds in `apps/map`
- [ ] `pnpm dev` works in both apps
- [ ] No TypeScript errors
- [ ] No runtime errors in browser console
- [ ] Visual regression check (compare before/after)
- [ ] Vercel preview deployment works (for website)

## Notes

- The Navigation and Footer components in `packages/ui` are more flexible than the originals
- Apps can pass custom props to customize behavior without forking components
- All design tokens are centralized in `packages/ui/src/styles/globals.css`
- Tailwind preset ensures consistent theming across all apps

---

# 🚀 MANUAL MIGRATION STEPS - DO THIS NOW

## ⚠️ BEFORE YOU START

**IMPORTANT**: Do these steps in order. Test after each step before moving to the next one.

---

## STEP 0: Initial Verification (Do This First!)

**Goal**: Make sure everything is set up correctly before migrating components.

### 0.1 Install Dependencies
```bash
# In the root folder (main directory)
pnpm install
```

### 0.2 Verify Builds Work
```bash
# In the root folder
pnpm build
```

**Expected**: Both `apps/website` and `apps/map` should build successfully without errors.

**If it fails**: Check the error message. Common issues:
- Missing dependencies → Run `pnpm install` again
- TypeScript errors → Check that `packages/ui` is properly linked
- Import errors → Verify `next.config.ts` has `transpilePackages: ["@111-network/ui"]`

### 0.3 Test Development Servers
```bash
# In the root folder
pnpm dev
```

**Expected**: 
- `apps/website` should run (usually on http://localhost:3000)
- `apps/map` should run (usually on http://localhost:3001)
- Both should look the same as before (no visual changes yet)

**✅ Once this works, proceed to Step 1**

---

## STEP 1: Migrate ThemeProvider (Easiest - Start Here)

**Files to change**: `apps/website/app/layout.tsx`

### 1.1 Update the import
**File**: `apps/website/app/layout.tsx`

**Find this line (around line 3):**
```tsx
import { ThemeProvider } from "@/components/theme-provider";
```

**Replace with:**
```tsx
import { ThemeProvider } from "@111-network/ui";
```

### 1.2 Test
```bash
# In root folder
pnpm build
pnpm dev
```

**Check**: 
- Website should look exactly the same
- Theme toggle should still work
- No console errors

### 1.3 Delete old file (only after verification)
```bash
# Delete this file:
rm apps/website/components/theme-provider.tsx
```

**✅ Mark as complete and move to Step 2**

---

## STEP 2: Migrate Container Component

**Files to change**: Multiple files use Container

### 2.1 Find all Container imports
**Files that need updating:**
- `apps/website/app/page.tsx`
- `apps/website/app/about/page.tsx`
- `apps/website/app/broadcast/page.tsx`
- `apps/website/app/network/page.tsx`
- `apps/website/app/resources/page.tsx`
- `apps/website/app/terms/page.tsx`
- `apps/website/components/footer.tsx`

### 2.2 Update each file
**In each file, find:**
```tsx
import { Container } from "@/components/container";
```

**Replace with:**
```tsx
import { Container } from "@111-network/ui";
```

### 2.3 Test
```bash
pnpm build
pnpm dev
```

**Check**: All pages should look the same, no errors

### 2.4 Delete old file (only after verification)
```bash
rm apps/website/components/container.tsx
```

**✅ Mark as complete and move to Step 3**

---

## STEP 3: Migrate Button Component

**Files to change**: `apps/website/components/hero216.tsx`

### 3.1 Update the import
**File**: `apps/website/components/hero216.tsx`

**Find:**
```tsx
import { Button } from "@/components/ui/button";
```

**Replace with:**
```tsx
import { Button } from "@111-network/ui";
```

### 3.2 Test
```bash
pnpm build
pnpm dev
```

**Check**: Any buttons should look and work the same

### 3.3 Delete old file (only after verification)
```bash
rm apps/website/components/ui/button.tsx
```

**✅ Mark as complete and move to Step 4**

---

## STEP 4: Migrate ThemeToggle Component

**Files to change**: `apps/website/components/footer.tsx`

### 4.1 Update the import
**File**: `apps/website/components/footer.tsx`

**Find:**
```tsx
import { ThemeToggle } from "./theme-toggle";
```

**Replace with:**
```tsx
import { ThemeToggle } from "@111-network/ui";
```

### 4.2 Test
```bash
pnpm build
pnpm dev
```

**Check**: Theme toggle in footer should still work

### 4.3 Delete old file (only after verification)
```bash
rm apps/website/components/theme-toggle.tsx
```

**✅ Mark as complete and move to Step 5**

---

## STEP 5: Migrate Navigation Component (More Complex)

**Files to change**: All page files that use Navigation

### 5.1 Files that need updating:
- `apps/website/app/page.tsx`
- `apps/website/app/about/page.tsx`
- `apps/website/app/broadcast/page.tsx`
- `apps/website/app/network/page.tsx`
- `apps/website/app/resources/page.tsx`
- `apps/website/app/terms/page.tsx`

### 5.2 Update each file

**For each file, find this:**
```tsx
import { Navigation } from "@/components/navigation";
```

**Replace with:**
```tsx
import { Navigation } from "@111-network/ui";
import { GlitchText } from "@/components/glitch-text";
import Link from "next/link";
```

**Then find this usage:**
```tsx
<Navigation />
```

**Replace with:**
```tsx
<Navigation
  logo={
    <Link href="/" className="block">
      <GlitchText
        className="font-mono text-xl font-semibold"
        intensity="medium"
        randomTiming={true}
      >
        111 Network
      </GlitchText>
    </Link>
  }
  items={[
    { label: "Home", href: "/" },
    { label: "Network", href: "/network" },
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
  ]}
  ctaItems={
    <>
      <Link
        href="/broadcast"
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error pulse-glow flex-shrink-0"></span>
        <span className="flex items-center justify-center">Broadcast</span>
      </Link>
      <a
        href="https://github.com/111-Network"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <GlitchText intensity="low">Get Involved</GlitchText>
      </a>
    </>
  }
/>
```

### 5.3 Test thoroughly
```bash
pnpm build
pnpm dev
```

**Check**: 
- Navigation should look exactly the same
- All links work
- Active page highlighting works
- CTA buttons work

### 5.4 Delete old file (only after verification)
```bash
rm apps/website/components/navigation.tsx
```

**✅ Mark as complete and move to Step 6**

---

## STEP 6: Migrate Footer Component

**Files to change**: All page files that use Footer

### 6.1 Files that need updating:
- `apps/website/app/page.tsx`
- `apps/website/app/about/page.tsx`
- `apps/website/app/broadcast/page.tsx`
- `apps/website/app/network/page.tsx`
- `apps/website/app/resources/page.tsx`
- `apps/website/app/terms/page.tsx`

### 6.2 Update each file

**For each file, find:**
```tsx
import { Footer } from "@/components/footer";
```

**Replace with:**
```tsx
import { Footer } from "@111-network/ui";
```

**Then find this usage:**
```tsx
<Footer />
```

**Replace with:**
```tsx
<Footer
  copyright={`© ${new Date().getFullYear()} 111 Network. Open Source.`}
  links={[
    { label: "Terms", href: "/terms" },
  ]}
  showThemeToggle={true}
>
  <p className="text-sm text-muted-foreground">
    Status: <span className="font-mono text-warning">In Development</span>
  </p>
</Footer>
```

### 6.3 Test
```bash
pnpm build
pnpm dev
```

**Check**: Footer should look the same with copyright, status, terms link, and theme toggle

### 6.4 Delete old file (only after verification)
```bash
rm apps/website/components/footer.tsx
```

**✅ Mark as complete and move to Step 7**

---

## STEP 7: Migrate Utils (cn function)

**Files to change**: Any file that imports from `@/lib/utils`

### 7.1 Find all utils imports
Run this to see all files:
```bash
# In root folder
grep -r "@/lib/utils" apps/website
```

### 7.2 Update each file
**Find:**
```tsx
import { cn } from "@/lib/utils";
```

**Replace with:**
```tsx
import { cn } from "@111-network/ui";
```

### 7.3 Test
```bash
pnpm build
pnpm dev
```

**Check**: Everything should still work

### 7.4 Optional: Keep utils.ts as re-export
**File**: `apps/website/lib/utils.ts`

**Replace entire file with:**
```tsx
// Re-export from shared package
export { cn } from "@111-network/ui";
```

**OR delete it if you've updated all imports:**
```bash
rm apps/website/lib/utils.ts
```

**✅ Mark as complete and move to Step 8**

---

## STEP 8: Final Cleanup

### 8.1 Check for empty directories
```bash
# If components/ui is empty, you can remove .gitkeep
rm apps/website/components/ui/.gitkeep
```

### 8.2 Final verification
```bash
# Build everything
pnpm build

# Test dev
pnpm dev

# Check for any TypeScript errors
cd apps/website
pnpm typecheck  # if this script exists
```

### 8.3 Commit your changes
```bash
git add .
git commit -m "Migrate shared components to @111-network/ui"
```

### 8.4 Deploy to Vercel (for website)
- Push to your branch
- Create a preview deployment
- Test the preview thoroughly
- If everything works, merge to main

**✅ Migration Complete!**

---

## 🆘 Troubleshooting

### Build fails with "Cannot find module @111-network/ui"
- Run `pnpm install` in root folder
- Check `apps/website/package.json` has `"@111-network/ui": "workspace:*"`

### TypeScript errors about missing types
- Check `next.config.ts` has `transpilePackages: ["@111-network/ui"]`
- Restart your TypeScript server in your IDE

### Styles look broken
- Check `apps/website/app/globals.css` imports `@111-network/ui/styles`
- Check `tailwind.config.ts` uses the preset and includes `packages/ui` in content

### Component doesn't look the same
- Compare props being passed
- Check if you're using the new configurable props correctly
- Look at browser console for errors

---

## ✅ Completion Checklist

After completing all steps:
- [ ] All imports updated to `@111-network/ui`
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` works
- [ ] Website looks identical to before
- [ ] All functionality works (navigation, theme toggle, etc.)
- [ ] Old component files deleted
- [ ] Committed to git
- [ ] Tested on Vercel preview
- [ ] Ready to merge to production
