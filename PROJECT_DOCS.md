# Harshatdy Portfolio — Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Pattern](#3-architecture-pattern)
4. [Project Structure](#4-project-structure)
5. [Routing & Pages](#5-routing--pages)
6. [Features & Sections](#6-features--sections)
7. [Component Breakdown](#7-component-breakdown)
8. [Data Management](#8-data-management)
9. [API Routes](#9-api-routes)
10. [Styling System](#10-styling-system)
11. [State Management](#11-state-management)
12. [Build & Deployment](#12-build--deployment)
13. [Configuration Files](#13-configuration-files)

---

## 1. Project Overview

A modern, interactive personal portfolio web application built with **Next.js 14 App Router**. It includes a blog system ("Train of Thoughts"), an interactive knowledge management flowmap ("Learn With Me"), an experience timeline, and a projects showcase. The app features a fully custom cursor, dark-first design, smooth Framer Motion animations, and Notion-like content editing capabilities.

**Tech summary:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · @dnd-kit · Static JSON data

---

## 2. Technology Stack

### Core
| Package | Version | Purpose |
|---|---|---|
| Next.js | 14.2.35 | React framework (App Router) |
| React | 18.2.0 | UI library |
| TypeScript | 5.3.3 | Static typing |

### Styling & Animation
| Package | Version | Purpose |
|---|---|---|
| Tailwind CSS | 3.4.1 | Utility-first CSS framework |
| Framer Motion | 10.18.0 | Animations & transitions |
| tailwindcss-animate | 1.0.7 | CSS animation utilities |
| @tailwindcss/typography | — | Rich text prose styling |

### UI & Interaction
| Package | Version | Purpose |
|---|---|---|
| Lucide React | 0.344.0 | Icon library |
| react-type-animation | 3.2.0 | Typing effect animations |
| react-intersection-observer | 9.5.3 | Scroll-triggered animations |
| next-themes | 0.2.1 | Dark mode / theme management |

### Drag & Drop
| Package | Version | Purpose |
|---|---|---|
| @dnd-kit/core | 6.1.0 | Core drag-and-drop engine |
| @dnd-kit/sortable | 8.0.0 | Sortable list support |
| @dnd-kit/utilities | 3.2.2 | DnD utility helpers |

### Utilities
| Package | Version | Purpose |
|---|---|---|
| nanoid | 5.0.4 | Unique ID generation for nodes |
| critters | 0.0.23 | Critical CSS inlining at build |

---

## 3. Architecture Pattern

### Pattern: Feature-Based App Router Architecture

The project uses the **Next.js 14 App Router** with a **feature-based directory structure**. Each major feature lives under its own route directory inside `app/`, while shared UI components live in `components/`.

```
Feature Route (/learn-with-me)
    ├── page.tsx          ← Server Component (data fetching + page shell)
    ├── FlowNodePage.tsx  ← Client Component (interactive logic)
    └── [slug]/           ← Nested dynamic route
```

### Key Architectural Decisions

1. **Static-First Data Layer** — Blog posts and flowmap data are stored as static JSON files in `/public/static/`. These are fetched at build time using `generateStaticParams()`, producing fully static HTML pages with zero runtime API dependency.

2. **API Routes as Persistence Layer** — In development/edit mode, the `/api/flowmap` POST route writes changes back to the JSON file, acting as a lightweight persistence mechanism without a database.

3. **Server + Client Component Split** — Page-level files (`page.tsx`) act as Server Components for data fetching. Interactive components (flowmap editor, modals, cursor) are Client Components (`"use client"`).

4. **Component Composition** — Large features (Flowmap) are broken into small, focused components: Node → NodeContextMenu → NodeEditorModal → SubtopicEditor → SectionEditor.

5. **Immutable Tree Operations** — Flowmap state uses immutable update patterns (spread operator, `.map()`, `.filter()`) for all CRUD operations, ensuring predictable state transitions.

---

## 4. Project Structure

```
Harshatdy_Portfolio/
│
├── app/                              # Next.js App Router root
│   ├── layout.tsx                    # Root layout (ThemeProvider, global cursor, fonts)
│   ├── page.tsx                      # Homepage (/)
│   ├── globals.css                   # Global Tailwind + custom CSS
│   │
│   ├── api/                          # API route handlers
│   │   ├── blogs/
│   │   │   └── route.ts              # GET /api/blogs
│   │   └── flowmap/
│   │       └── route.ts              # GET & POST /api/flowmap
│   │
│   ├── data/                         # Data utilities (non-component logic)
│   │   ├── blogPosts.ts              # Blog fetch helpers
│   │   └── flowmapData.ts            # Flowmap CRUD helpers & TypeScript types
│   │
│   ├── train-of-thoughts/            # Blog feature
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Blog listing page
│   │   └── [slug]/
│   │       ├── page.tsx              # Dynamic blog post (SSG)
│   │       └── BlogPost.tsx          # Blog post client component
│   │
│   └── learn-with-me/               # Flowmap / Knowledge Management feature
│       ├── page.tsx                  # Flowmap home page
│       └── [slug]/
│           ├── page.tsx              # Node detail page (SSG)
│           ├── FlowNodePage.tsx      # Node page client component
│           └── [sectionSlug]/
│               ├── page.tsx          # Section detail page (SSG)
│               └── SectionPage.tsx   # Section client component
│
├── components/                       # Shared React components (24 files)
│   │
│   ├── # --- Flowmap ---
│   ├── flowmap.tsx                   # Flowmap grid view (read mode)
│   ├── flowmap-editor.tsx            # Flowmap edit mode shell
│   ├── flow-node.tsx                 # Individual flowmap node card
│   ├── flow-node-context-menu.tsx    # Right-click menu for node actions
│   ├── node-editor-modal.tsx         # Create/Edit node modal form
│   ├── subtopic-editor.tsx           # Subtopic CRUD within a node
│   ├── section-editor.tsx            # Section CRUD within a node
│   ├── content-viewer.tsx            # Content display & inline editor
│   │
│   ├── # --- Homepage Sections ---
│   ├── hero.tsx                      # Hero section with CV download
│   ├── experience.tsx                # Experience timeline items
│   ├── timeline.tsx                  # Projects timeline with modal
│   ├── timeline-modal.tsx            # Modal for timeline project detail
│   ├── portfolio-grid.tsx            # Portfolio projects grid
│   │
│   ├── # --- Blog ---
│   ├── blog-slider.tsx               # Featured blogs carousel
│   │
│   ├── # --- Navigation & UI ---
│   ├── custom-cursor.tsx             # Custom animated cursor (replaces OS cursor)
│   ├── learn-button.tsx              # Sticky "Learn with Me" button
│   ├── sticky-thoughts-button.tsx    # Sticky "Train of Thoughts" button
│   ├── footer.tsx                    # Site footer with social links
│   └── theme-provider.tsx            # Next Themes provider wrapper
│
├── public/                           # Static assets (served at /)
│   ├── static/
│   │   ├── blogs.json                # Full blog post data (~40KB)
│   │   ├── hero_blogs.json           # Featured blog posts (~1.6KB)
│   │   └── flowmap-data.json         # Flowmap node tree (~5.7KB)
│   ├── img/                          # Images (profile, project thumbnails)
│   ├── fonts/                        # Roboto Mono font files
│   └── placeholder.svg
│
├── Roboto_Mono/                      # Font source files
│
├── # --- Config ---
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── package.json
├── .env.local
│
├── # --- Docker ---
├── Dockerfile
├── docker-compose.yml
│
└── # --- Docs & Tools ---
    ├── FLOWMAP_DOCUMENTATION.md      # Flowmap feature in-depth docs
    └── update.py                     # Utility script
```

---

## 5. Routing & Pages

The project uses the **Next.js App Router** with file-system based routing.

### Route Map

| Route | File | Type | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | Static | Homepage with all sections |
| `/train-of-thoughts` | `app/train-of-thoughts/page.tsx` | Static | Blog listing |
| `/train-of-thoughts/[slug]` | `app/train-of-thoughts/[slug]/page.tsx` | SSG | Individual blog post |
| `/learn-with-me` | `app/learn-with-me/page.tsx` | Static | Flowmap home |
| `/learn-with-me/[slug]` | `app/learn-with-me/[slug]/page.tsx` | SSG | Flowmap node page |
| `/learn-with-me/[slug]/[sectionSlug]` | `app/learn-with-me/[slug]/[sectionSlug]/page.tsx` | SSG | Node section page |
| `/api/blogs` | `app/api/blogs/route.ts` | API | Blog data endpoint |
| `/api/flowmap` | `app/api/flowmap/route.ts` | API | Flowmap data endpoint |

### Static Site Generation (SSG)

Both blog posts and flowmap nodes use `generateStaticParams()` to pre-render all pages at build time:

```ts
// Example: /train-of-thoughts/[slug]/page.tsx
export async function generateStaticParams() {
  const blogs = await fetchBlogs(); // reads from blogs.json
  return blogs.map((blog) => ({ slug: blog.slug }));
}
```

This means there are **zero runtime database/API calls** for page rendering — all pages are static HTML files.

---

## 6. Features & Sections

### 6.1 Homepage (`/`)

The homepage is a single-page application composed of stacked sections:

- **Hero Section** (`hero.tsx`)
  - Animated grid background
  - Name, title with typing animation (`react-type-animation`)
  - CV download button with hover indicator
  - Scroll-triggered fade-in via `react-intersection-observer`

- **Experience Section** (`experience.tsx`)
  - Horizontal card layout for professional roles
  - Hover effects with Framer Motion

- **Timeline Section** (`timeline.tsx`)
  - Interactive project timeline (OneAppNR, 5G Deployment, Envisage)
  - Click to open `TimelineModal` with full project details
  - Animated connection lines between timeline nodes

- **Portfolio Grid** (`portfolio-grid.tsx`)
  - 6 project cards with GitHub links
  - Tag-based categorization

- **Sticky Navigation Buttons**
  - `LearnButton` → `/learn-with-me`
  - `StickyThoughtsButton` → `/train-of-thoughts`

- **Custom Cursor** (`custom-cursor.tsx`)
  - Replaces OS cursor globally (`cursor: none` in CSS)
  - Page-aware text labels (changes based on current section)
  - Smooth spring animation tracking mouse position
  - Orange dot + rotating text ring

- **Footer** (`footer.tsx`)
  - Social links (GitHub, LinkedIn, etc.)

---

### 6.2 Train of Thoughts Blog (`/train-of-thoughts`)

A blog system with static JSON as the data source.

**Data flow:**
```
/public/static/blogs.json
    → app/data/blogPosts.ts (fetch helpers)
    → app/api/blogs/route.ts (GET endpoint)
    → train-of-thoughts/page.tsx (listing)
    → train-of-thoughts/[slug]/page.tsx (post detail, SSG)
```

**Features:**
- Blog listing with category sidebar filter
- Featured blog slider (`blog-slider.tsx`) on homepage
- Blog cards: cover image, date, read time, category tags
- Individual post pages generated statically at build time
- `BlogPost.tsx` client component renders full markdown/HTML content with `prose` typography

**Data shape (blogs.json):**
```json
{
  "id": "1",
  "slug": "my-first-post",
  "title": "...",
  "date": "2024-01-01",
  "readTime": "5 min read",
  "category": "Engineering",
  "tags": ["React", "Next.js"],
  "content": "..."
}
```

---

### 6.3 Learn With Me — Flowmap (`/learn-with-me`)

A **Notion-inspired hierarchical knowledge management system**. This is the most complex feature of the portfolio.

**Concept:** Topics are organized in a tree structure (Topic → Subtopics → Sections → Content). This is visualized as an interactive flowmap grid.

**Two Modes:**

| Mode | Description |
|---|---|
| **View Mode** | Read-only grid of topic nodes, clickable to navigate |
| **Edit Mode** | Full CRUD — add, edit, delete, reorder nodes via drag-and-drop |

**Data hierarchy:**
```
Topic (e.g., "Web Development")
└── Subtopic (e.g., "Frontend")
    └── Node (e.g., "React & Next.js")
        ├── Sections (e.g., "Core Concepts", "Best Practices")
        │   └── Content (markdown/text blocks)
        └── Direct Content
```

**Data flow:**
```
/public/static/flowmap-data.json
    → app/data/flowmapData.ts (CRUD helpers + TypeScript types)
    → app/api/flowmap/route.ts (GET + POST endpoint)
    → learn-with-me/page.tsx (renders <FlowMap> or <FlowMapEditor>)
    → [slug]/FlowNodePage.tsx (node detail page)
    → [slug]/[sectionSlug]/SectionPage.tsx (section detail page)
```

**Edit Mode Operations:**
- Right-click node → context menu (Edit / Move Up / Move Down / Delete / Add Node)
- Drag node to reorder (powered by `@dnd-kit/sortable`)
- "Add Node" button creates new entry via `NodeEditorModal`
- Save button → POST to `/api/flowmap` → writes to `flowmap-data.json`

**flowmapData.ts utility functions:**
```ts
loadFlowmapData()      // Fetch from JSON file
saveFlowmapData(data)  // POST to /api/flowmap
findNodeById(tree, id) // Recursive search
findNodePath(tree, id) // Returns node + breadcrumb path
updateNodeInTree(...)  // Immutable update
deleteNodeFromTree(...)// Immutable delete
addNodeToTree(...)     // Immutable add
reorderNodes(...)      // Reorder after drag-drop
```

---

## 7. Component Breakdown

### Flowmap Components

| Component | File | Responsibility |
|---|---|---|
| FlowMap | `components/flowmap.tsx` | Renders 3-col responsive grid of FlowNode cards |
| FlowMapEditor | `components/flowmap-editor.tsx` | Edit mode shell — wraps nodes with DnD context |
| FlowNode | `components/flow-node.tsx` | Single node card with icon, title, Framer Motion animations |
| FlowNodeContextMenu | `components/flow-node-context-menu.tsx` | Right-click popup menu (Edit, Delete, Move, Add) |
| NodeEditorModal | `components/node-editor-modal.tsx` | Modal form to create/edit node (title, icon, description) |
| SubtopicEditor | `components/subtopic-editor.tsx` | CRUD UI for subtopics within a node |
| SectionEditor | `components/section-editor.tsx` | CRUD UI for sections within a node |
| ContentViewer | `components/content-viewer.tsx` | Displays and inline-edits node content blocks |

### Homepage Components

| Component | File | Responsibility |
|---|---|---|
| Hero | `components/hero.tsx` | Animated hero with grid bg, typing text, CV button |
| Experience | `components/experience.tsx` | Horizontal experience card row |
| Timeline | `components/timeline.tsx` | Project timeline with modal trigger |
| TimelineModal | `components/timeline-modal.tsx` | Overlay with full project detail |
| PortfolioGrid | `components/portfolio-grid.tsx` | 6-project showcase grid |
| BlogSlider | `components/blog-slider.tsx` | Auto-scrolling featured blog carousel |

### Global UI Components

| Component | File | Responsibility |
|---|---|---|
| CustomCursor | `components/custom-cursor.tsx` | Replaces OS cursor; context-aware text ring |
| ThemeProvider | `components/theme-provider.tsx` | Next Themes dark mode wrapper |
| Footer | `components/footer.tsx` | Social links footer |
| LearnButton | `components/learn-button.tsx` | Sticky CTA → /learn-with-me |
| StickyThoughtsButton | `components/sticky-thoughts-button.tsx` | Sticky CTA → /train-of-thoughts |

---

## 8. Data Management

### Static JSON Files (Source of Truth)

| File | Content | Size |
|---|---|---|
| `public/static/blogs.json` | All blog posts (id, slug, title, content, tags…) | ~40 KB |
| `public/static/hero_blogs.json` | Featured/highlighted blog posts | ~1.6 KB |
| `public/static/flowmap-data.json` | Full flowmap node tree (recursive) | ~5.7 KB |

### Data Utility Layer (`app/data/`)

**`blogPosts.ts`** — Provides `fetchBlogs()` and `fetchHeroBlogs()` helpers that read from the JSON files. Used in `generateStaticParams` and page components.

**`flowmapData.ts`** — The core data layer for the Flowmap feature:
- Defines TypeScript types: `Topic`, `Subtopic`, `FlowNode`, `Section`, `ContentBlock`
- Provides all tree CRUD operations as pure functions
- `loadFlowmapData()` calls `GET /api/flowmap`
- `saveFlowmapData()` calls `POST /api/flowmap`

### TypeScript Types (from `flowmapData.ts`)

```ts
interface Topic {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  subtopics?: Subtopic[];
  sections?: Section[];
  content?: ContentBlock[];
}

interface Section {
  id: string;
  title: string;
  slug: string;
  content: ContentBlock[];
}

interface ContentBlock {
  id: string;
  type: "text" | "code" | "list";
  content: string;
}
```

---

## 9. API Routes

### `GET /api/blogs`
- Reads `public/static/blogs.json` and `hero_blogs.json`
- Returns: `{ blogs: Blog[], heroBlogs: Blog[] }`

### `GET /api/flowmap`
- Reads `public/static/flowmap-data.json`
- Returns: `Topic[]` array

### `POST /api/flowmap`
- Body: Updated `Topic[]` array
- Validates structure, writes to `flowmap-data.json`
- Returns: `{ success: true }` or error

> **Note:** The API write route is used in **edit mode only** and relies on filesystem write access (dev/server environment). In a static export deployment, this would require a separate backend or serverless function.

---

## 10. Styling System

### Tailwind CSS + Custom Theme

The project extends Tailwind with a custom design system in `tailwind.config.js`:

**Color Palette:**
- `--primary`: Orange (`#FF8000`) — used for accents, borders, active states
- Background: Black (`#000000`) by default (dark-first)
- Surface: `zinc-900`, `zinc-800`, `zinc-700` for cards and modals
- Text: `white`, `zinc-400` for muted text

**Custom Fonts:**
```css
Montserrat       /* Google Fonts — headings */
Unbounded        /* Google Fonts — display/hero text */
Roboto Mono      /* Local font files — code & monospace */
```

**Custom CSS (`globals.css`):**
```css
* { cursor: none; }           /* Hides OS cursor — replaced by CustomCursor */
::-webkit-scrollbar-thumb:hover { background: #FF8000; }  /* Orange scrollbar */
```

**Dark Mode:** Class-based via `next-themes`. Dark mode is the default.

### Animation System

- **Framer Motion** — All card hover effects, page transitions, modal open/close, node drag animations
- **Intersection Observer** — Scroll-triggered entrance animations (fade-in, slide-up)
- **CSS Animations** — Tailwind Animate for utility animations (spin, bounce)

---

## 11. State Management

**No global state library** (no Redux, Zustand, or Jotai). State is managed locally:

| Scope | Pattern |
|---|---|
| Flowmap edit state | `useState` in `learn-with-me/page.tsx` — full topic tree |
| Modal open/close | `useState` in parent component |
| Blog filter | `useState` in `train-of-thoughts/page.tsx` |
| Theme | `next-themes` context (via `ThemeProvider`) |
| Cursor position | `useRef` + `requestAnimationFrame` in `custom-cursor.tsx` |
| Drag-and-drop | `@dnd-kit` internal state + `onDragEnd` callback |

All flowmap mutations (add, edit, delete, reorder) use **immutable update patterns** — the full state tree is rebuilt on every change and passed down via props.

---

## 12. Build & Deployment

### Scripts
```bash
npm run dev      # Start Next.js dev server (localhost:3000)
npm run build    # Production build (static export to /out)
npm start        # Serve production build
npm run lint     # ESLint check
```

### Docker
```dockerfile
# Dockerfile and docker-compose.yml are provided
# Builds the Next.js app in a container
docker-compose up --build
```

### Static Export
The project is configured for static export (`output: 'export'` in `next.config.js`). This means:
- All pages rendered at build time
- Output lives in `/out` directory
- Can be hosted on any static file server (GitHub Pages, Netlify, Vercel, S3, etc.)

### Environment Variables (`.env.local`)
Used for local development configuration (contents not committed to git).

---

## 13. Configuration Files

### `next.config.js`
```js
{
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ['localhost'] },
  experimental: { optimizeCss: true }   // Critical CSS with critters
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "ESNext",
    "strict": true,
    "paths": { "@/*": ["./*"] }      // Import alias: @/components/foo
  }
}
```

### `tailwind.config.js`
```js
{
  darkMode: "class",
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: { /* HSL CSS variable colors */ },
      fontFamily: {
        "roboto-mono": ["var(--font-roboto-mono)"]
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
}
```

---

## Quick Reference

| Topic | Location |
|---|---|
| Homepage entry | [app/page.tsx](app/page.tsx) |
| Root layout | [app/layout.tsx](app/layout.tsx) |
| Blog data | [public/static/blogs.json](public/static/blogs.json) |
| Flowmap data | [public/static/flowmap-data.json](public/static/flowmap-data.json) |
| Flowmap types & helpers | [app/data/flowmapData.ts](app/data/flowmapData.ts) |
| Custom cursor | [components/custom-cursor.tsx](components/custom-cursor.tsx) |
| Flowmap editor | [components/flowmap-editor.tsx](components/flowmap-editor.tsx) |
| API — blogs | [app/api/blogs/route.ts](app/api/blogs/route.ts) |
| API — flowmap | [app/api/flowmap/route.ts](app/api/flowmap/route.ts) |
| Tailwind config | [tailwind.config.js](tailwind.config.js) |
| Next.js config | [next.config.js](next.config.js) |
| Flowmap feature docs | [FLOWMAP_DOCUMENTATION.md](FLOWMAP_DOCUMENTATION.md) |
