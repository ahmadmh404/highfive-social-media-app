# HighFive Social Media App - AI Development Guide

## Project Overview

This is a Next.js 16 social media application using the App Router pattern with TypeScript and TailwindCSS. The project follows modern React patterns and Next.js best practices.

## Tech Stack

- Next.js 16.0.1 with App Router
- React 19.2.0
- TypeScript
- TailwindCSS v4
- ESLint v9

## Project Structure

```
src/
  app/           # Next.js App Router directory
    layout.tsx   # Root layout with font configuration
    page.tsx     # Homepage
    globals.css  # Global styles
```

## Key Conventions

### Styling

- Uses TailwindCSS for styling
- Custom fonts: Geist Sans and Geist Mono configured in `layout.tsx`
- Global styles in `globals.css`

### TypeScript

- Strict mode enabled
- Type definitions in `next-env.d.ts`
- Use `Readonly` for props interfaces

### Development Workflow

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Component Patterns

- Use functional components with TypeScript
- Props interfaces should use `Readonly<{}>` pattern
- Font configuration using `next/font/google`

### File Naming

- React components: PascalCase `.tsx` files
- Pages and layouts: lowercase `.tsx` files in the App Router structure
- Type definitions: PascalCase `.d.ts` files

## Common Tasks

1. Adding a new page: Create a new directory under `src/app` with `page.tsx`
2. Styling: Use Tailwind classes directly in components
3. Font usage: Import from `next/font/google` and configure in layout files

## Important Notes

- The project uses Next.js 16's built-in TypeScript, ESLint, and Tailwind support
- Always use the App Router patterns, not the older Pages Router
- Fonts are configured globally through the root layout
