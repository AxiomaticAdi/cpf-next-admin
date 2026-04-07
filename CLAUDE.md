# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CPF Admin — an internal admin tool for Castle Peak Farm to create, modify, delete, and view events stored in Firebase Firestore. Built with Next.js 15.5.3 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Key Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Dev server (uses Turbopack)
npm run build      # Production build (uses Turbopack)
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run fix-all    # Prettier + ESLint --fix
```

No testing framework is configured — there are no test scripts or test files.

## Project Structure

```
app/
├── layout.tsx                  # Root layout (fonts, ThemeProvider, AuthGuard, Toaster)
├── page.tsx                    # Home — navigation hub
├── globals.css                 # Tailwind v4 config, CSS variables, theme
├── create-event/               # Create event form + preview dialog
├── modify-event/               # Select & edit future events
├── delete-event/               # Select & delete future events
└── view-all-events/            # View all events (past + future)
components/
├── auth-guard.tsx              # Client-side Firebase Auth gate + nav bar
├── event-selector.tsx          # Shared event dropdown (used by delete/modify)
├── badge-price.tsx             # Price badge overlay for event images
└── ui/                         # shadcn/ui components (button, dialog, input, etc.)
lib/
├── actions/                    # Server Actions (create, update, delete, fetch, validate)
├── hooks/use-event-selector.ts # Custom hook for event selection state
├── constants.ts                # SALES_TAX = 0.0775
├── firebase-client.ts          # Client-side Firebase Auth init
└── utils.ts                    # cn(), date formatting, CA timezone utilities
firebase.config.ts              # Server-only Firebase Admin SDK init
types.ts                        # FirebaseEventsDocument, Event types
```

## Architecture & Key Patterns

### Server/Client Split

Every route page follows the same pattern:

- `page.tsx` — async server component that fetches data from Firestore via Firebase Admin SDK
- `*-client.tsx` — co-located `"use client"` component that receives data as props and handles interactivity

No API routes exist — all mutations go through Server Actions in `lib/actions/`.

### Server Actions

All server actions live in `lib/actions/` and return `{ success: boolean, error?: string }` — they never throw to the client. After mutations, they call `revalidatePath()` to invalidate cached pages.

### Component Conventions

- Use shadcn/ui components from `/components/ui/` — prefer these over raw HTML elements
- **Never use raw `<button>` elements** — always use the shadcn `Button` component (with appropriate `variant` and `size`). The only exception is custom interactive card/tile layouts where `Button` styling would conflict.
- Always use `next/image` for images, `next/link` for links, shadcn `Button` for buttons
- Use the `cn()` utility from `/lib/utils.ts` for combining Tailwind classes
- Components use Radix UI primitives with CVA (class-variance-authority) for variants
- shadcn/ui style: `new-york`, base color: `neutral`, icon library: `lucide`

### Data Layer

- **Database:** Firebase Firestore, single `Events` collection
- **Server reads:** `fetchEvents()` in `lib/actions/fetch-events.ts` (plain async function, not a Server Action)
- **Server writes:** Server Actions using Firebase Admin SDK (`db.collection().add()`, `.update()`, `.delete()`)
- **Client-side Firebase:** used only for Authentication (email/password), not for Firestore
- **No ORM** — direct Firebase Admin SDK calls

### Authentication

- Client-side only via `AuthGuard` component wrapping the entire app
- Uses Firebase Auth (`signInWithEmailAndPassword`)
- No server-side token verification — server actions trust the client gate
- No Next.js middleware for auth

### Timezone Handling

All datetime inputs are treated as California time (`America/Los_Angeles`). Key utilities in `lib/utils.ts`:

- `formatDateTimeLocalCA()` — formats Date to datetime-local string in CA timezone
- `parseDateTimeLocalAsCA()` — parses datetime-local string as CA time, returns UTC Date
- Server actions convert to/from Firebase Timestamps in UTC

### Styling

- Tailwind CSS v4 configured entirely in CSS (`globals.css`) via `@theme inline` — no `tailwind.config.js`
- Colors use `oklch()` color space with semantic CSS variables (`--primary`, `--background`, etc.)
- Dark mode CSS exists but is forced to light (`forcedTheme="light"` in ThemeProvider)
- Toast notifications via Sonner with custom CSS classes in `globals.css`
- Geist Sans and Geist Mono fonts

### Path Aliases

- `@/*` maps to the project root (e.g., `@/components/ui/button`, `@/lib/utils`)

## Environment Variables

Required in `.env`:

- `NEXT_PUBLIC_FIREBASE_API_KEY` — Firebase client API key
- `NEXT_PUBLIC_FIREBASE_APP_ID` — Firebase app ID
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` — Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` — Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` — Firebase project ID (`cpf-db`)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` — Firebase storage bucket
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Full service account JSON (inline or base64-encoded)

## Key Dependencies

| Package                    | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `firebase` ^12             | Client-side Auth                         |
| `firebase-admin` ^13       | Server-side Firestore access             |
| `lucide-react`             | Icons                                    |
| `sonner`                   | Toast notifications                      |
| `dompurify`                | HTML sanitization for event descriptions |
| `next-themes`              | Theme provider (forced light mode)       |
| `class-variance-authority` | Component variant styling                |
| `@radix-ui/*`              | UI primitives for shadcn components      |

## Linting & Formatting

- ESLint 9 (flat config) with `next/core-web-vitals`, `next/typescript`, and Prettier integration
- Prettier with all defaults (no custom config)
- Always run `npm run fix-all` before committing
