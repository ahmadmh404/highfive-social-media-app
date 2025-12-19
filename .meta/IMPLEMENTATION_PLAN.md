# HighFive Social Media - Production-Ready Implementation Plan

**Full-Stack Next.js 16 + React 19 + Server Actions + Drizzle ORM**  
**With Arabic (RTL) + Multi-language Support**  
**Status:** Ready for Development  
**Last Updated:** December 19, 2025

---

## 1. PROJECT SUMMARY

**HighFive** is a production-grade social media platform enabling users to:

- Create, share, and interact with posts (text, images, videos)
- Build and manage friend networks and followers
- Exchange direct messages in real-time
- Create and manage collections (saved posts)
- Upload and manage media
- Experience full RTL support for Arabic and multi-language content

**Scope:** Full-stack monolith built with Next.js 16 Server Actions + Drizzle ORM  
**Target Launch:** 8-10 weeks  
**Team Size:** 1-2 developers

---

## 2. TECH STACK (Latest Stable Features)

| Layer               | Technology          | Version  | Features                                                                 |
| ------------------- | ------------------- | -------- | ------------------------------------------------------------------------ |
| **Framework**       | Next.js             | 16.0.10+ | App Router, Server Components, Server Actions, Turbopack, Edge Functions |
| **Runtime**         | React               | 19.2.1+  | Concurrent rendering, Suspense, useTransition, useActionState            |
| **Language**        | TypeScript          | 5.7+     | Strict mode, type safety                                                 |
| **Database**        | PostgreSQL          | 14+      | ACID transactions, JSON support, full-text search                        |
| **ORM**             | Drizzle             | 0.45+    | Type-safe queries, migrations, relationships                             |
| **Styling**         | Tailwind CSS        | 4.0+     | RTL support, dark mode, component tokens                                 |
| **i18n**            | next-intl           | 3.18+    | Server & client i18n, pluralization, date formatting                     |
| **Auth**            | NextAuth.js         | 5.0+     | Session management, CSRF protection                                      |
| **Form**            | React Hook Form     | 7.54+    | Server Action integration, validation                                    |
| **Validation**      | Zod                 | 4.1+     | Runtime type checking, schema validation                                 |
| **File Upload**     | UploadThing         | 7.7+     | Type-safe uploads, webhook integration                                   |
| **Caching**         | React Cache Tags    | Built-in | Server-side caching, revalidation                                        |
| **Testing**         | Vitest + Playwright | Latest   | Unit, integration, E2E tests                                             |
| **CI/CD**           | GitHub Actions      | Latest   | Automated testing, linting, deployment                                   |
| **Monitoring**      | Sentry              | Latest   | Error tracking, performance monitoring                                   |
| **Background Jobs** | node-cron           | 3.0+     | Scheduled tasks (emails, notifications)                                  |

**Security Patches Applied:**

- ✅ Next.js 16.0.10 (CVE-2025-55182 mitigation)
- ✅ React 19.2.1+ (RSC vulnerability fix)
- ✅ Strict input validation on all Server Actions
- ✅ CSRF protection enabled
- ✅ Rate limiting on sensitive endpoints

---

## 3. SYSTEM ARCHITECTURE

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ React Components (Client & Server)                     │  │
│  │ - Interactive UI with useTransition for optimism      │  │
│  │ - Server Components for data fetching                 │  │
│  │ - Form handling with React Hook Form                  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/WebSocket
┌──────────────────▼──────────────────────────────────────────┐
│              NEXT.JS SERVER LAYER                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ App Router Pages & Layouts                            │  │
│  │ - Route handlers                                       │  │
│  │ - Server Actions (mutations)                           │  │
│  │ - Middleware (auth, i18n)                             │  │
│  │ - NextAuth.js (session management)                    │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Business Logic Layer                                  │  │
│  │ - User Service (auth, profiles)                       │  │
│  │ - Post Service (CRUD, reactions, bookmarks)           │  │
│  │ - Message Service (direct messaging)                  │  │
│  │ - Friend Service (connections, requests)              │  │
│  │ - Media Service (uploads, processing)                 │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Data Access Layer (Drizzle ORM)                       │  │
│  │ - Query builders with type safety                     │  │
│  │ - Mutations with transactions                         │  │
│  │ - Cache tags for revalidation                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────────────────────────┐
│            DATA PERSISTENCE LAYER                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                                   │  │
│  │ - Users, Posts, Comments, Stories                    │  │
│  │ - Messages, Conversations                             │  │
│  │ - Friendships, Followers                             │  │
│  │ - Collections, Media, Tags                           │  │
│  │ - Reactions, Notifications                           │  │
│  │ - Sessions, Audit Logs                               │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

EXTERNAL SERVICES:
├── UploadThing (file storage & CDN)
├── Sentry (error tracking)
├── SendGrid/Nodemailer (email)
└── GitHub Actions (CI/CD)
```

### Data Flow: Creating a Post

```
User Form Input
    ↓
React Component (Client)
    ↓
Server Action: createPost() [use server]
    ↓
Input Validation (Zod schema)
    ↓
Authorization Check (user ownership)
    ↓
PostService.create()
    ↓
Drizzle ORM: INSERT + RETURNING
    ↓
Cache Revalidation (post list tags)
    ↓
Response to Client
    ↓
UI Re-render with optimism + confirmation
```

---

## 4. DATABASE SCHEMA (Drizzle + Migrations)

### Entity-Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│    User     │◄────────│   Session    │
│  (AuthN)    │ 1:N     │              │
└─────────────┘         └──────────────┘
      │
      │ 1:N
      ├────────────────────────┐
      │                        │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│    Post     │         │   Story      │
│             │         │              │
└─────────────┘         └──────────────┘
      │ 1:N                   │ 1:N
      │                       │
      ├─ PostReaction         └─ StoryView
      ├─ Comment
      │   └─ CommentReaction
      └─ Bookmark
           └─ Collection

┌─────────────┐
│  Friendship │ (bidirectional edges)
│             │
└─────────────┘

┌──────────────┐
│  Follower    │ (directed edges)
│              │
└──────────────┘

┌──────────────┐         ┌──────────────┐
│ Conversation │◄────────│   Message    │
│              │ 1:N     │              │
└──────────────┘         └──────────────┘

┌──────────────┐
│   Media      │ (attached to posts, stories, messages)
│              │
└──────────────┘

┌──────────────┐
│    Tag       │ (user tagging in posts/comments)
│              │
└──────────────┘

┌──────────────┐
│ Notification │
│              │
└──────────────┘

┌──────────────┐
│  AuditLog    │ (security & compliance)
│              │
└──────────────┘
```

### Core Tables (Abbreviated Schema)

```typescript
// Users & Authentication
users {
  id: UUID (PK)
  email: String (UNIQUE, INDEXED)
  username: String (UNIQUE, INDEXED)
  passwordHash: String (bcryptjs)
  fullName: String
  bio: Text
  avatar: String (UploadThing URL)
  coverImage: String
  isVerified: Boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

sessions {
  id: UUID (PK)
  userId: UUID (FK → users)
  token: String
  expiresAt: Timestamp
}

// Content
posts {
  id: UUID (PK)
  userId: UUID (FK → users, INDEXED)
  content: Text
  privacy: Enum(public, friends, private) [INDEXED]
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt: Timestamp (soft delete)
}

stories {
  id: UUID (PK)
  userId: UUID (FK → users)
  content: Text
  media: JSON (array of media objects)
  expiresAt: Timestamp
  createdAt: Timestamp
}

comments {
  id: UUID (PK)
  postId: UUID (FK → posts)
  userId: UUID (FK → users)
  content: Text
  createdAt: Timestamp
  deletedAt: Timestamp (soft delete)
}

// Social Graph
friendships {
  id: UUID (PK)
  userId: UUID (FK → users) [INDEXED]
  friendId: UUID (FK → users) [INDEXED]
  status: Enum(pending, accepted, blocked) [INDEXED]
  createdAt: Timestamp
  updatedAt: Timestamp
  CONSTRAINT: UNIQUE(userId, friendId)
}

followers {
  id: UUID (PK)
  userId: UUID (FK → users) [INDEXED]
  followerId: UUID (FK → users) [INDEXED]
  createdAt: Timestamp
  CONSTRAINT: UNIQUE(userId, followerId)
}

// Messaging
conversations {
  id: UUID (PK)
  participantIds: UUID[] (array of user IDs)
  isGroup: Boolean
  groupName: String (nullable)
  createdAt: Timestamp
}

messages {
  id: UUID (PK)
  conversationId: UUID (FK → conversations) [INDEXED]
  senderId: UUID (FK → users) [INDEXED]
  content: Text
  media: JSON (nullable)
  readBy: JSON (map of userId: readAt timestamp)
  deletedAt: Timestamp (soft delete)
  createdAt: Timestamp
}

// Interactions
postReactions {
  id: UUID (PK)
  postId: UUID (FK → posts) [INDEXED]
  userId: UUID (FK → users) [INDEXED]
  type: Enum(like, love, haha, sad, angry)
  createdAt: Timestamp
  CONSTRAINT: UNIQUE(postId, userId)
}

bookmarks {
  id: UUID (PK)
  userId: UUID (FK → users) [INDEXED]
  postId: UUID (FK → posts) [INDEXED]
  collectionId: UUID (FK → collections, nullable)
  createdAt: Timestamp
}

collections {
  id: UUID (PK)
  userId: UUID (FK → users) [INDEXED]
  name: String
  description: Text
  isPublic: Boolean
  createdAt: Timestamp
}

// Media
media {
  id: UUID (PK)
  userId: UUID (FK → users) [INDEXED]
  postId: UUID (FK → posts, nullable)
  storyId: UUID (FK → stories, nullable)
  messageId: UUID (FK → messages, nullable)
  uploadThingKey: String
  type: Enum(image, video, audio, document)
  mimeType: String
  size: Integer
  createdAt: Timestamp
}

// Notifications
notifications {
  id: UUID (PK)
  userId: UUID (FK → users) [INDEXED]
  type: Enum(like, comment, follow, friend_request, message)
  relatedUserId: UUID (FK → users, nullable)
  relatedPostId: UUID (FK → posts, nullable)
  message: String
  isRead: Boolean [INDEXED]
  createdAt: Timestamp
}

// Audit & Compliance
auditLogs {
  id: UUID (PK)
  userId: UUID (FK → users, nullable) [INDEXED]
  action: String (INDEXED)
  resource: String (INDEXED)
  resourceId: UUID (INDEXED)
  changes: JSON
  ipAddress: String
  userAgent: String
  createdAt: Timestamp
}
```

### Migration Strategy

1. **Initial Schema** (Week 1): Core users, posts, comments, friendships, messages
2. **Enhancement** (Week 2): Collections, reactions, notifications, audit logs
3. **Optimization** (Week 3): Add indices, constraints, views for performance

---

## 5. API SPECIFICATION

### Server Actions (Primary Interface)

All business logic exposed via **Server Actions** in `src/features/[feature]/actions/` folders.

**Patterns:**

```typescript
// src/features/posts/actions/actions.ts
"use server";

import { validateSession } from "@/lib/auth";
import { createPostSchema } from "./schemas";
import { PostService } from "../services/post.service";

export async function createPost(data: unknown) {
  // 1. Validate session
  const session = await validateSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Validate input with Zod
  const parsed = createPostSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  // 3. Call service
  const post = await PostService.create(session.userId, parsed.data);

  // 4. Revalidate cache
  revalidateTag("posts-feed");
  revalidateTag(`posts-user-${session.userId}`);

  return post;
}
```

### Key Server Actions by Feature

| Feature           | Operations                                            | Endpoints                                                       |
| ----------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| **Users**         | Create, read, update, delete, search profiles         | createUser, updateProfile, getUserById, searchUsers             |
| **Posts**         | Create, read, update, delete, like, comment, bookmark | createPost, deletePost, toggleLike, addComment, toggleBookmark  |
| **Stories**       | Create, read, delete, view                            | createStory, getStories, viewStory, deleteStory                 |
| **Messages**      | Create conversation, send message, mark read, delete  | sendMessage, getConversations, getMessages, markAsRead          |
| **Friends**       | Add, remove, request, accept/reject                   | sendFriendRequest, acceptFriendRequest, removeFriend            |
| **Followers**     | Follow, unfollow, get followers/following             | toggleFollow, getFollowers, getFollowing                        |
| **Collections**   | Create, update, delete, manage posts                  | createCollection, addPostToCollection, removePostFromCollection |
| **Media**         | Upload (via UploadThing)                              | uploadMedia (uses UploadThing URL route)                        |
| **Notifications** | Get, mark read, delete                                | getNotifications, markAsRead, deleteNotification                |

### Route Handlers (Minimal)

```
/api/auth/[...nextauth]         → NextAuth session & callback routes
/api/uploadthing                → UploadThing file upload webhook
/api/webhooks/stripe            → Stripe webhook (future payment feature)
/api/health                      → Health check endpoint
```

---

## 6. FRONTEND ARCHITECTURE

### Page Structure (App Router)

```
src/app/
├── (auth)/                           # Public auth routes
│   ├── layout.tsx
│   ├── sign-in/page.tsx
│   ├── sign-up/page.tsx
│   └── forgot-password/page.tsx
│
├── (main)/                           # Protected routes (require auth)
│   ├── layout.tsx                    # Main layout with sidebar
│   ├── page.tsx                      # Feed (home)
│   ├── [locale]/                     # i18n route prefix
│   │   ├── explore/page.tsx
│   │   ├── messages/
│   │   │   ├── page.tsx              # Conversations list
│   │   │   └── [conversationId]/page.tsx
│   │   ├── profile/[username]/
│   │   │   ├── page.tsx              # View profile
│   │   │   └── edit/page.tsx
│   │   ├── collections/page.tsx
│   │   ├── settings/page.tsx
│   │   └── admin/                    # Admin routes (optional)
│   │       ├── users/page.tsx
│   │       └── analytics/page.tsx
│   │
│   └── @sidebar/                     # Parallel route (sidebar)
│       └── default.tsx
│
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── uploadthing/core.ts
│   ├── uploadthing/route.ts
│   └── health/route.ts
│
├── layout.tsx                        # Root layout
├── globals.css
└── not-found.tsx
```

### Component Organization

```
src/components/
├── ui/                              # Shadcn/ui wrapped components
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   ├── toast.tsx
│   └── ...
├── shared/                          # App-wide reusable components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── feed-layout.tsx
│   ├── loading-skeleton.tsx
│   └── error-boundary.tsx
├── builders/                        # Form/data builders
│   ├── form-builder.tsx
│   ├── post-builder.tsx
│   └── select-builder.tsx
└── features/                        # Feature-specific components
    ├── posts/
    │   ├── post-card.tsx
    │   ├── post-actions.tsx
    │   ├── reaction-picker.tsx
    │   └── comment-section.tsx
    ├── messages/
    │   ├── conversation-list.tsx
    │   ├── message-list.tsx
    │   └── message-input.tsx
    └── ...
```

### Server vs Client Components

**Server Components (SSR):**

- Layout & page skeletons
- Data-heavy components (feeds, listings)
- Authentication checks
- i18n content fetching

**Client Components:**

- Interactive UI (buttons, forms, modals)
- Real-time updates (useTransition)
- Event handlers
- State management (useOptimistic)

---

## 7. i18n Plan (English + Arabic)

### Implementation: next-intl

```typescript
// src/i18n.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./translations/${locale}.json`)).default,
  timeZone: "UTC",
  now: new Date(),
}));
```

### Locale Strategy

**Default Locales:** `en`, `ar`  
**Locale Detection:** Accept-Language header → user preference → `en` fallback  
**Route Pattern:** `/[locale]/...` (e.g., `/en/feed`, `/ar/feed`)

### Arabic (RTL) Specific Implementation

**Direction CSS:**

```css
[dir="rtl"] {
  direction: rtl;
}
[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
} /* Flip */
```

**Components with RTL Support:**

```typescript
// src/components/ui/sidebar.tsx
<div dir={locale === "ar" ? "rtl" : "ltr"}>
  {/* Content mirrored based on locale */}
</div>
```

**Date & Number Formatting:**

```typescript
// Use Intl APIs
new Intl.DateTimeFormat("ar-SA").format(date);
new Intl.NumberFormat("ar-SA").format(1000);
```

### Translation Files Structure

```
src/translations/
├── en.json         # English strings
├── ar.json         # Arabic strings (RTL)
└── schema.json     # Zod for validation
```

**Sample Translation (en.json):**

```json
{
  "navigation": {
    "feed": "Feed",
    "explore": "Explore",
    "messages": "Messages"
  },
  "posts": {
    "createPost": "Create a new post",
    "like": "Like",
    "comment": "Comment"
  }
}
```

### Pluralization (Arabic-Aware)

```typescript
// Arabic has complex pluralization rules (singular, dual, plural)
// next-intl handles this with:
<Trans i18nKey="posts.comments" values={{ count: 3 }} />
// Translates to: "3 تعليقات" (3 comments)
```

---

## 8. SECURITY & PERFORMANCE BEST PRACTICES

### Security (OWASP Top 10 + React Server Component Fixes)

| Threat                      | Mitigation                                                                      |
| --------------------------- | ------------------------------------------------------------------------------- |
| **RCE (React 19 RSC vuln)** | ✅ React 19.2.1+, strict input validation, Zod schemas, serialization whitelist |
| **SQL Injection**           | ✅ Drizzle parameterized queries (not raw SQL), query builders                  |
| **XSS**                     | ✅ React auto-escaping, Content Security Policy, DOMPurify for rich content     |
| **CSRF**                    | ✅ NextAuth CSRF tokens, SameSite cookies, POST-only mutations                  |
| **Authentication**          | ✅ bcryptjs password hashing (12 rounds), JWT sessions, secure cookie flags     |
| **Authorization**           | ✅ Row-level security checks, permission middleware, audit logs                 |
| **Rate Limiting**           | ✅ node-rate-limiter-flexible on sensitive endpoints (auth, posts, messages)    |
| **Data Exposure**           | ✅ Field-level filtering (never leak passwords/sensitive data), audit logs      |
| **Dependency Vulns**        | ✅ npm audit, Dependabot, automated security updates                            |
| **HTTPS/TLS**               | ✅ Vercel auto-HTTPS, HSTS headers, secure cookie transmission                  |

### Implementation Examples

```typescript
// Rate Limiting on auth endpoint
import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60, // per 60 seconds
});

export async function signIn(email: string, password: string) {
  try {
    await limiter.consume(email, 1);
  } catch {
    throw new Error("Too many attempts. Try again in 1 minute");
  }
  // ... auth logic
}

// Input Validation with Zod
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  privacy: z.enum(["public", "friends", "private"]),
  mediaIds: z.array(z.string().uuid()).max(10),
});

// Row-level security in queries
export async function getUserPosts(userId: string) {
  const session = await getSession();

  // Verify user can only access their own posts
  if (session.userId !== userId) {
    throw new Error("Forbidden");
  }

  return db.select().from(posts).where(eq(posts.userId, userId));
}

// Audit logging
export async function deletePost(postId: string) {
  const session = await getSession();
  const post = await db.select().from(posts).where(eq(posts.id, postId));

  if (post.userId !== session.userId) {
    // Log unauthorized attempt
    await auditLog({
      userId: session.userId,
      action: "DELETE_POST_UNAUTHORIZED",
      resourceId: postId,
      ipAddress: getClientIP(),
    });
    throw new Error("Forbidden");
  }

  // Soft delete
  await db
    .update(posts)
    .set({ deletedAt: new Date() })
    .where(eq(posts.id, postId));

  // Log authorized deletion
  await auditLog({
    userId: session.userId,
    action: "DELETE_POST",
    resourceId: postId,
  });
}
```

### Performance

| Area                  | Strategy                                                                         |
| --------------------- | -------------------------------------------------------------------------------- |
| **Server Components** | Fetch data server-side, reduce JS sent to client                                 |
| **Caching**           | Next.js Cache Tags with smart revalidation on mutations                          |
| **Database**          | Indices on foreign keys, composite indices on queries, pagination (cursor-based) |
| **Images**            | next/image with AVIF format, lazy loading, responsive sizing                     |
| **CSS**               | Tailwind JIT, unused CSS purging, critical CSS inlining                          |
| **Bundles**           | Code splitting per route, dynamic imports for heavy components                   |
| **Edge Functions**    | Middleware for auth, i18n detection, redirect logic                              |
| **CDN**               | Vercel Edge Network for static assets, UploadThing for user media                |

---

## 9. FILE STRUCTURE & BOOTSTRAP STEPS

### Directory Structure

```
highfive/
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── lint.yml
│       └── deploy.yml
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   ├── (main)/
│   │   ├── api/
│   │   ├── [locale]/                 # i18n routing
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── shared/
│   │   └── features/
│   ├── features/                     # Feature modules
│   │   ├── users/
│   │   │   ├── actions/
│   │   │   ├── components/
│   │   │   ├── db/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   └── constants.ts
│   │   ├── posts/
│   │   ├── stories/
│   │   ├── comments/
│   │   ├── messages/
│   │   ├── friends/
│   │   ├── followers/
│   │   ├── collections/
│   │   ├── media/
│   │   ├── tags/
│   │   ├── notifications/
│   │   └── replies/
│   ├── lib/
│   │   ├── db.ts                     # Drizzle client
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── schema.ts                 # Database schema (Drizzle)
│   │   ├── permissions.ts            # Authorization logic
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-action.ts             # Server Action wrapper
│   │   └── ...
│   ├── services/
│   │   ├── email.service.ts
│   │   └── uploadthing/
│   ├── middleware.ts                 # Auth + i18n middleware
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── i18n.ts
│   └── types.ts
├── drizzle/
│   ├── migrations/                   # Generated migrations
│   └── schema.ts                     # Source schema
├── tests/
│   ├── unit/                         # Vitest
│   ├── integration/
│   └── e2e/                          # Playwright
├── translations/
│   ├── en.json
│   └── ar.json
├── public/
│   ├── fonts/
│   └── images/
├── .env.example
├── .env.local
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── prettier.config.mjs
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

### Bootstrap Steps (npm)

**Prerequisites:** Node.js 20+, npm 10+, PostgreSQL 14+

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.f .env.local
# Edit .env.local with:
#   DATABASE_URL=postgresql://user:password@localhost:5432/highfive
#   NEXTAUTH_SECRET=$(openssl rand -base64 32)
#   NEXTAUTH_URL=http://localhost:3000

# 3. Initialize Drizzle & run migrations
npm run db:push

# 4. Setup pre-commit hooks (Husky + Lint-staged)
npm run prepare

# 5. Seed database (optional - create test data)
npm run db:seed

# 6. Start development server
npm run dev

# 7. Run tests
npm run test

# 8. Build for production
npm run build
```

### npm Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate",
    "db:seed": "tsx src/db/seed.ts",
    "db:studio": "drizzle-kit studio",
    "prepare": "husky install",
    "audit": "npm audit --audit-level=moderate"
  }
}
```

---

## 10. DEV WORKFLOW (Tests, Linting, CI/CD)

### Local Development Workflow

```
Feature Development → Commit → Pre-commit Hooks → Push → GitHub Actions
     ↓
  Write code
  Run: npm run dev
  Test locally: npm run test
     ↓
  git add .
  Husky pre-commit:
    - Lint (ESLint)
    - Format (Prettier)
    - Type check (TypeScript)
     ↓
  git commit -m "feat: add feature"
  Conventional Commits enforced by Commitizen
     ↓
  git push origin feature-branch
     ↓
  GitHub Actions:
    - Run tests
    - Run linting
    - Build
    - Deploy to preview
```

### Testing Strategy

**Unit Tests (Vitest)**

```typescript
// src/features/posts/services/post.service.test.ts
import { describe, it, expect } from "vitest";
import { PostService } from "./post.service";

describe("PostService", () => {
  it("should create a post", async () => {
    const post = await PostService.create("user-id", {
      content: "Hello world",
      privacy: "public",
    });
    expect(post.id).toBeDefined();
    expect(post.content).toBe("Hello world");
  });
});
```

**Integration Tests (Vitest + Database)**

```typescript
// src/features/posts/actions/actions.test.ts
import { createPost } from "./actions";

describe("createPost action", () => {
  it("should create post and revalidate cache", async () => {
    const post = await createPost({
      content: "Test post",
    });
    expect(post).toBeDefined();
  });
});
```

**E2E Tests (Playwright)**

```typescript
// tests/e2e/posts.spec.ts
import { test, expect } from "@playwright/test";

test("user can create and delete a post", async ({ page }) => {
  await page.goto("/feed");
  await page.fill('[data-test="post-input"]', "Test post");
  await page.click('[data-test="submit-post"]');

  expect(page.locator("text=Test post")).toBeVisible();

  await page.click('[data-test="post-menu"]');
  await page.click('[data-test="delete-post"]');

  expect(page.locator("text=Test post")).not.toBeVisible();
});
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Test & Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v5
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 11. DEPLOYMENT PLAN

### Deployment Targets

| Environment    | Platform          | Trigger          | Checks                          |
| -------------- | ----------------- | ---------------- | ------------------------------- |
| **Preview**    | Vercel Preview    | PR opened        | Tests pass                      |
| **Staging**    | Vercel Staging    | Merge to develop | All tests, E2E pass             |
| **Production** | Vercel Production | Merge to main    | All tests pass, manual approval |

### Pre-Deployment Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] No ESLint/type errors
- [ ] Database migrations reviewed and approved
- [ ] Security audit passed (npm audit, OWASP checklist)
- [ ] Performance budget met (Lighthouse score > 90)
- [ ] Monitoring & alerting configured (Sentry)
- [ ] Rollback plan documented

### Deployment Steps (Vercel)

```bash
# 1. Create Vercel project
vercel link

# 2. Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add UPLOADTHING_TOKEN

# 3. Deploy to staging
vercel deploy --prod --scope=staging

# 4. Run smoke tests
npm run test:e2e -- --project=production

# 5. Deploy to production
vercel deploy --prod
```

### Health Checks & Monitoring

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const checks = {
    db: await checkDatabase(),
    auth: await checkAuth(),
    uploadthing: await checkUploadThing(),
    time: new Date().toISOString(),
  };

  const status = Object.values(checks).every((c) => c === true) ? 200 : 503;
  return Response.json(checks, { status });
}
```

### Monitoring (Sentry)

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  debug: false,
});
```

---

## 12. OPTIONAL FEATURES (Clearly Marked)

### ✨ Phase 2 Enhancements (Post-MVP)

| Feature                        | Effort    | Business Value           | Priority |
| ------------------------------ | --------- | ------------------------ | -------- |
| **Real-time Notifications**    | MEDIUM    | High engagement          | P1       |
| **WebSocket Messaging**        | MEDIUM    | Core feature enhancement | P1       |
| **Video Streaming**            | HIGH      | Content richness         | P2       |
| **Live Streaming**             | HIGH      | Engagement driver        | P2       |
| **Payment/Subscriptions**      | HIGH      | Revenue                  | P1       |
| **Admin Dashboard**            | MEDIUM    | Operational              | P2       |
| **Dark Mode**                  | LOW       | UX polish                | P3       |
| **PWA/Offline**                | MEDIUM    | Accessibility            | P3       |
| **Mobile App (RN)**            | VERY HIGH | Market expansion         | P2       |
| **AI-powered recommendations** | HIGH      | Engagement               | P2       |

---

## 13. QUESTIONS FOR CLARIFICATION

None at this time - architecture is defined and ready for implementation.

---

## CRITICAL SECURITY NOTES

🔒 **CVE-2025-55182 Mitigation:**

- Must use Next.js 16.0.10+ (not 16.0.1)
- Must use React 19.2.1+ (not 19.2.0)
- All Server Actions must validate inputs with Zod
- No eval() or dangerous deserialization
- Strict CSRF protection enabled
- Rate limiting on sensitive endpoints

---

## NEXT IMMEDIATE STEPS

1. **Database Setup** → Create PostgreSQL database
2. **Project Init** → npm install & configure environment
3. **Schema Implementation** → Define Drizzle schema
4. **Auth System** → Implement sign-up/sign-in
5. **Core Features** → Posts, users, basic feed
6. **Testing** → Add unit & E2E tests
7. **Deployment** → Setup Vercel + monitoring

**Estimated Timeline:** 8-10 weeks (full-time, 1-2 developers)

---

**Document Version:** 1.0  
**Last Updated:** December 19, 2025  
**Status:** Ready for Development
