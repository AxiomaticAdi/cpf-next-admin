# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal Next.js 15.5.3 project with TypeScript and Tailwind CSS v4, using the App Router architecture.

## Key Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Format code with Prettier
npm run format

# Fix all linting issues and format code
npm run fix-all
```

## Architecture & Key Patterns

### Component Structure

- Uses shadcn/ui component pattern with components stored in `/components/ui/`
- Components are built using Radix UI primitives with Tailwind CSS styling
- The `cn()` utility function in `/lib/utils.ts` is used for combining classNames with proper Tailwind CSS class merging

### Styling System

- Tailwind CSS v4 (latest version) with PostCSS configuration
- Global styles defined in `/app/globals.css` with CSS variables for theming
- Uses Geist Sans and Geist Mono fonts from Google Fonts

### Path Aliases

- `@/*` is configured as an alias for the project root, allowing imports like `@/components/ui/button`

## Important Notes

- No testing framework is currently configured
- ESLint is configured with Next.js core web vitals rules and Prettier integration
- The project follows Next.js App Router conventions with layout and page components in the `/app` directory
