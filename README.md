# Om's Blog — MDX-powered SSR blog

A personal, MDX-first blog built with TanStack Start and Vite that serves statically compiled MDX content with server-side rendering for improved SEO and performance. Focused on football (Arsenal), software development, and personal growth.

**Live Demo:** [https://blog.beyondthebasics.me](https://blog.beyondthebasics.me)

## Features

- **Server-Side Rendering (SSR)** with TanStack Start and Vite for production-ready performance and SEO-optimized HTML.
- **MDX Content Pipeline** — all posts authored as `.mdx` files with YAML frontmatter, compiled at build time to React components.
- **Reading Experience** — reading progress indicator, bookmark support (localStorage), and article resume functionality.
- **Search & Navigation** — keyboard-driven search overlay (Cmd+K), category filtering, and series organization for related posts.
- **Code Highlighting** — theme-aware syntax highlighting via Shiki with `rehype-pretty-code`, supporting light and dark modes.
- **Dark/Light Theme** — persistent theme preference managed via React Context.
- **Rich Article Features** — table of contents auto-generated from headings, image lightbox, quote-share integration, and mobile-optimized reading bar.
- **RSS Feed Generator** — feed generation logic included (route wiring ready for future implementation).
- **Accessible UI** — built with Radix UI primitives for keyboard navigation and screen reader support.
- **Responsive Design** — mobile-first layout powered by Tailwind CSS and custom components.

## Demo / Example

View the live site at **[blog.beyondthebasics.me](https://blog.beyondthebasics.me)**.

### Local Development

Start the development server and explore the site locally:

```bash
npm install
npm run dev
# open http://localhost:5173 in your browser
```

**Expected:** Homepage renders a hero section, featured posts, and recent articles grouped by category. Click any article to see reading progress, table of contents, code highlighting, and reading tools.

### Build and Preview

Build a production bundle and preview it locally:

```bash
npm run build
npm run preview
# preview server typically runs on http://localhost:4173
```

**Outputs:**

- `dist/client/` — static assets and client-side JavaScript.
- `dist/server/` — server bundle (imported by Vercel's serverless function).

### Deployment

The repository includes **Vercel deployment configuration** (`vercel.json`). All HTTP requests are rewritten to `api/ssr.js`, which is a Node.js serverless function that:

1. Imports the server bundle from `dist/server/server.js`.
2. Renders the React app to HTML on the server.
3. Returns the rendered page with proper hydration markers.

## Installation

### Prerequisites

- **Node.js 18+** (LTS recommended).
- **npm** or **bun** (package manager).

### Clone and Install

```bash
git clone <your-repo-url>
cd "Blog Site"
npm install
```

## Usage

### Development Workflow

```bash
npm run dev
```

Starts Vite development server with:

- Fast refresh (HMR) for React components.
- MDX compilation on file save.
- Default port: `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

Generates:

- `dist/client/` — minified client bundle and static assets.
- `dist/server/` — server entry point for SSR.

### Preview Production Build

```bash
npm run preview
```

Runs a preview server to test the production bundle locally (useful for testing SSR output before deployment).

### Code Quality

```bash
npm run lint
npm run format
```

- `lint` — runs ESLint to check code style and quality.
- `format` — formats code with Prettier.

### Deployment to Vercel

1. Push your repository to GitHub.
2. Import the repository in Vercel dashboard.
3. Vercel automatically detects `vercel.json` and configures:
   - Build command: `npm run build`.
   - Output directory: `dist/client`.
   - Serverless function: `api/ssr.js`.

## Project Structure

```
Blog Site/
├── src/
│   ├── start.ts                    # TanStack Start app factory (server entry)
│   ├── server.ts                   # SSR error handler and wrapper
│   ├── router.tsx                  # Router configuration with React Query
│   ├── routeTree.gen.ts            # Auto-generated file-based routing tree
│   ├── styles.css                  # Global styles
│   │
│   ├── routes/                     # File-based routes (TanStack Router)
│   │   ├── __root.tsx              # Root layout (SiteShell, theme provider)
│   │   ├── index.tsx               # Homepage
│   │   ├── article.$slug.tsx        # Article detail page
│   │   ├── category.$slug.tsx       # Category archive
│   │   ├── about.tsx               # About page
│   │   └── reading-list.tsx        # Bookmarks view
│   │
│   ├── components/
│   │   ├── site/
│   │   │   ├── SiteShell.tsx       # Main layout wrapper
│   │   │   ├── Header.tsx          # Sticky header with search and theme toggle
│   │   │   ├── Footer.tsx          # Footer
│   │   │   └── SearchOverlay.tsx   # Cmd+K search dialog
│   │   │
│   │   ├── article/
│   │   │   ├── CodeBlock.tsx       # Code block with highlighting
│   │   │   ├── TableOfContents.tsx # Auto-generated TOC from headings
│   │   │   ├── ReadingRail.tsx     # Sidebar with reading progress (desktop)
│   │   │   ├── MobileActionBar.tsx # Reading progress bar (mobile)
│   │   │   ├── PrevNextNav.tsx     # Previous/next article navigation
│   │   │   ├── SeriesNav.tsx       # Navigate related series posts
│   │   │   ├── QuoteShare.tsx      # Quote selection sharing
│   │   │   ├── ImageLightbox.tsx   # Modal image viewer
│   │   │   ├── ShortcutsHelp.tsx   # Keyboard shortcuts reference
│   │   │   ├── SubscribeCTA.tsx    # Call-to-action component
│   │   │   └── ImageLightbox.tsx   # Image modal viewer
│   │   │
│   │   └── ui/                     # Radix UI + Tailwind component library
│   │       └── (30+ accessible UI components)
│   │
│   ├── content/
│   │   ├── posts/                  # MDX blog posts organized by year
│   │   │   ├── 2023/
│   │   │   ├── 2024/
│   │   │   ├── 2025/
│   │   │   └── 2026/
│   │   │
│   │   ├── loaders/
│   │   │   ├── postManifest.ts     # Builds index of all posts from MDX modules
│   │   │   └── postIndexes.ts      # Creates lookup maps by slug, category, tag
│   │   │
│   │   ├── render/
│   │   │   └── mdx-components.tsx  # Custom MDX component mappings
│   │   │
│   │   ├── feeds/
│   │   │   ├── rss.ts             # RSS 2.0 feed generator
│   │   │   ├── searchDocuments.ts # Search index generator
│   │   │   └── sitemap.ts         # Sitemap generator
│   │   │
│   │   ├── schemas/
│   │   │   └── postFrontmatter.ts # Zod schema for post frontmatter validation
│   │   │
│   │   ├── api.ts                 # Public content API (getPost, getPosts, etc.)
│   │   ├── integrity.ts           # Post data validation checks
│   │   └── types.ts               # TypeScript interfaces
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx        # Dark/light theme provider
│   │
│   ├── hooks/
│   │   ├── useBookmarks.ts         # Bookmark persistence (localStorage)
│   │   ├── useReadingProgress.ts   # Scroll position tracking
│   │   ├── useReadingPosition.ts   # Resume article position
│   │   ├── useSpeech.ts            # Text-to-speech integration
│   │   ├── useArticleShortcuts.ts  # Keyboard shortcuts
│   │   └── use-mobile.tsx          # Mobile breakpoint detection
│   │
│   ├── lib/
│   │   ├── content.ts              # Static content (hero, signals, obsessions)
│   │   ├── share.ts                # Share utilities
│   │   ├── utils.ts                # General utilities
│   │   ├── error-capture.ts        # Global error capture
│   │   └── error-page.ts           # Error page HTML template
│   │
│   └── assets/                     # Static images and media
│
├── api/
│   └── ssr.js                      # Vercel serverless function handler
│
├── vite.config.ts                  # Vite configuration with MDX plugin
├── vercel.json                     # Vercel deployment config
├── wrangler.jsonc.disabled         # Cloudflare Workers config (optional)
├── eslint.config.js                # ESLint flat config
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

### Key Directories

- **`src/content/posts`** — All blog articles as `.mdx` files with YAML frontmatter.
- **`src/content/loaders`** — Build-time post indexing and manifest generation.
- **`src/routes`** — File-based routes (TanStack Router generates `routeTree.gen.ts` automatically).
- **`src/components/article`** — Rich article UI components (TOC, reading progress, highlighting).
- **`src/components/ui`** — Reusable Radix UI + Tailwind component library.

## Technologies Used

### Core Stack

- **React 19.2.0** — UI library.
- **TypeScript 5.8.3** — Type-safe JavaScript.
- **TanStack Start 1.167.50** — Full-stack React framework with built-in SSR and file-based routing.
- **TanStack React Router 1.168.25** — File-based routing with layout management.
- **TanStack React Query 5.83.0** — Data fetching and caching.

### Build & Development

- **Vite 7.3.1** — Lightning-fast build tool with HMR.
- **Tailwind CSS 4.2.1** — Utility-first CSS framework.
- **Tailwind Vite Plugin** — Tailwind integration with Vite.

### Content & Markdown

- **MDX 3.1.1** — Write JSX in Markdown.
- **remark-frontmatter** — Extract YAML frontmatter from MDX.
- **remark-mdx-frontmatter** — Make frontmatter data accessible.
- **remark-gfm** — GitHub Flavored Markdown support.
- **Shiki 4.1.0** — Advanced syntax highlighting.
- **rehype-pretty-code** — Theme-aware code highlighting.
- **rehype-slug** — Auto-generate heading IDs for table of contents.
- **gray-matter** — Parse YAML frontmatter.

### UI & Components

- **Radix UI** — 25+ headless, accessible component primitives.
- **Lucide React** — Icon library.
- **class-variance-authority** — Type-safe component variants.
- **clsx** — Dynamic class composition.

### Forms & Validation

- **React Hook Form 7.71.2** — Lightweight form management.
- **Zod 3.24.2** — TypeScript-first schema validation.
- **@hookform/resolvers** — Integration between React Hook Form and Zod.

### Utilities

- **date-fns 4.1.0** — Date utilities.
- **reading-time 1.5.0** — Estimate article reading time.
- **cmdk** — Command/search dialog component.
- **sonner** — Toast notifications.
- **Embla Carousel** — Carousel component.
- **Recharts 2.15.4** — Chart library.

### Deployment

- **Vercel** — Primary deployment platform (serverless SSR).
- **@cloudflare/vite-plugin** — Optional Cloudflare Workers integration.

### Development Tools

- **ESLint 9.32.0** — Code quality linting.
- **Prettier 3.7.3** — Code formatting.
- **typescript-eslint** — ESLint rules for TypeScript.

## Configuration

### Environment Variables

The project uses **Vite's environment variable system**. Variables prefixed with `VITE_` are automatically injected:

```javascript
// In code:
import.meta.env.DEV       // boolean: true in dev, false in production
import.meta.env.PROD      // boolean: true in production, false in dev
import.meta.env.VITE_*    // any custom variables you define
```

**Current Usage:**

- `import.meta.env.DEV` — used in [`src/content/loaders/postManifest.ts`](src/content/loaders/postManifest.ts) to include draft posts during development.

**Adding Environment Variables:**

1. Create a `.env` file in the project root:

   ```
   VITE_API_BASE=https://api.example.com
   VITE_ANALYTICS_ID=your-tracking-id
   ```

2. Reference in code:
   ```typescript
   const apiBase = import.meta.env.VITE_API_BASE;
   ```

### Build Configuration

**`vite.config.ts`** — Configures:

- MDX processing with remark/rehype plugins.
- Tailwind CSS compilation.
- Path aliases (`@/*` → `src/*`).
- SSR entry and server output.
- Cloudflare Workers and component tagging (dev only).

**`vercel.json`** — Vercel-specific settings:

- Build command: `npm run build`.
- Output directory: `dist/client`.
- Rewrites all routes to `api/ssr.js` for server-side rendering.

**`tsconfig.json`** — TypeScript target:

- Target: `ES2022`.
- Module: `ESNext`.
- JSX: `react-jsx` (automatic JSX transform).
- Strict mode enabled.

### Linting & Formatting

**`.eslintrc.js`** — ESLint rules:

- Recommended ESLint + TypeScript rules.
- React Hooks rules.
- Prettier integration.

Run linting:

```bash
npm run lint
npm run format
```

## Future Improvements

- **Wire RSS Feed Route** — Connect [`src/content/feeds/rss.ts`](src/content/feeds/rss.ts) to an HTTP route (e.g., `GET /rss.xml`).
- **Search Index** — Generate and serve a static search index to power [`src/components/site/SearchOverlay.tsx`](src/components/site/SearchOverlay.tsx).
- **Automated Testing** — Add unit tests for hooks and content loaders; integrate with CI/CD.
- **CI/CD Pipeline** — Set up GitHub Actions for linting, type-checking, and preview builds.
- **Sitemap Generation** — Wire [`src/content/feeds/sitemap.ts`](src/content/feeds/sitemap.ts) to output a `sitemap.xml` file.
- **Analytics Integration** — Add Google Analytics, Plausible, or similar to track readership.
- **Newsletter Signup** — Complete the [`src/components/article/SubscribeCTA.tsx`](src/components/article/SubscribeCTA.tsx) integration with an email service (e.g., Mailchimp, ConvertKit).
- **Email Delivery** — Add automated emails for newsletter subscribers.
- **Comments/Interaction** — Integrate a commenting system (Giscus, Utterances, etc.).

## Learning Outcomes

This project demonstrates:

1. **Build-Time MDX Content Pipeline** — Extracting and parsing YAML frontmatter, calculating reading time, generating table of contents, and producing search documents — all at build time for zero runtime overhead.

2. **Server-Side Rendering (SSR) with Vite** — Building separate server and client bundles using TanStack Start, serving pre-rendered HTML for SEO, and hydrating on the client for interactivity.

3. **Accessible UI Development** — Using Radix UI primitives for keyboard navigation, focus management, and screen reader support; combining with Tailwind CSS for responsive, styled components.

4. **Client-Side State Persistence** — Managing bookmarks, reading progress, and article position using `localStorage` without external state management.

5. **Theme-Aware Code Highlighting** — Integrating Shiki with rehype-pretty-code to generate syntax-highlighted HTML that respects the app's dark/light mode toggle.

6. **File-Based Routing** — Leveraging TanStack Router's file-based routing for a scalable, maintainable navigation structure.

7. **Avoiding External CMS** — Using git-tracked MDX files and build-time processing for content management, eliminating the need for a headless CMS.

## Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Install** dependencies:

   ```bash
   npm install
   ```

3. **Make changes** and ensure code quality:

   ```bash
   npm run lint
   npm run format
   ```

4. **Test** your changes locally:

   ```bash
   npm run dev
   npm run build
   npm run preview
   ```

5. **Commit** with a clear message:

   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push** and open a pull request on GitHub.

### Guidelines

- Follow the existing code style (ESLint + Prettier will enforce this).
- Write clear commit messages.
- Test changes in both dev and production build modes.
- Update this README if adding new features or changing setup instructions.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Author

**Om Jhamvar**

- Email: [omjhamvar29@gmail.com](mailto:omjhamvar29@gmail.com)
- Blog: [https://blog.beyondthebasics.me](https://blog.beyondthebasics.me)

---

## Why I Built This

I created this blog to share writing and projects focused on three areas:

1. **Football (Arsenal)** — In-depth analysis and commentary.
2. **Software Development** — Code projects, technical write-ups, and engineering insights.
3. **Personal Growth** — Notes on learning, habits, and mindset.

Rather than using an opinionated platform like Next.js or a hosted CMS, I built this from scratch to:

- Have **complete control** over the development experience (Vite's speed, HMR, etc.).
- Demonstrate a **modern, scalable MDX pipeline** (build-time processing, no runtime parsing).
- Explore **SSR with TanStack Start** — a Vite-first alternative to Next.js.
- Showcase **accessible, component-driven UI** with Radix UI and Tailwind CSS.
- Keep all content **git-tracked and version-controlled**.

The project reflects my preference for **simple, composable tools** over heavyweight frameworks.

## Challenges Solved

### 1. Build-Time MDX Content Pipeline

**Challenge:** How to reliably parse MDX files with frontmatter, extract table of contents, calculate reading time, and provide type-safe post metadata?

**Solution:** Built a custom content pipeline that:

- Uses `gray-matter` to parse YAML frontmatter.
- Leverages remark/rehype plugins (`remark-mdx-frontmatter`, `rehype-slug`) to extract and validate post data at build time.
- Calculates reading time from raw text body using the `reading-time` library.
- Generates a `headingsJson` export from each MDX file for table of contents.
- Validates all posts against a Zod schema for data integrity.
- Produces a searchable post manifest available at runtime without re-parsing.

### 2. SSR + Client Hydration with Vite

**Challenge:** How to configure Vite to generate separate server and client bundles for SSR, while keeping HMR smooth in development?

**Solution:** Used TanStack Start which:

- Abstracts Vite SSR complexity with sensible defaults.
- Automatically generates a server entry point (`src/start.ts`).
- Produces `dist/server/server.js` and `dist/client/` ready for deployment.
- Wraps the server for serverless environments (Vercel, Cloudflare Workers).
- Maintains fast HMR during development.

### 3. Theme-Aware Syntax Highlighting

**Challenge:** How to provide syntax-highlighted code blocks that automatically respond to dark/light mode changes?

**Solution:** Integrated:

- **Shiki** with dual theme configuration (light + dark themes).
- **rehype-pretty-code** to generate HTML with theme-aware class names.
- React Context to track theme state (`ThemeContext`).
- CSS that applies the correct theme class to code blocks based on app mode.

### 4. Reading Progress & Resume Without External State

**Challenge:** How to track reading position, bookmarks, and allow users to resume articles without a backend database?

**Solution:** Used `localStorage` with custom hooks:

- `useReadingProgress` tracks scroll position and updates a progress bar.
- `useReadingPosition` saves/restores the scroll position for each article.
- `useBookmarks` manages a list of bookmarked articles.
- All state persists across sessions without backend infrastructure.

### 5. Scalable Content Organization

**Challenge:** How to organize content (categories, series, tags) and keep the content system maintainable as the blog grows?

**Solution:** Structured posts with:

- **Frontmatter metadata** (title, category, tags, series, featured, draft status).
- **Content loaders** that build indexed lookup maps (`BY_SLUG`, `BY_CATEGORY`, `BY_TAG`, `FEATURED_POSTS`).
- **Series support** to group related posts into reading sequences.
- **Draft status** to hide unpublished posts in production while visible in development.
- **Automated integrity checks** to validate post data consistency.

### 6. No External CMS Required

**Challenge:** How to manage content without a headless CMS like Contentful or Sanity?

**Solution:** Leveraged git as the content backend:

- All posts are `.mdx` files checked into version control.
- Build-time compilation produces a post manifest.
- Content queries are type-safe TypeScript functions.
- No API latency; all data available synchronously at runtime.
- Full revision history and collaborative editing via Git.

---

**Questions?** Open an issue or reach out at [omjhamvar29@gmail.com](mailto:omjhamvar29@gmail.com).

Enjoy reading and exploring the code! 🚀
