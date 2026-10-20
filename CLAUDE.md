# Seura Photos website — guide for Claude Code

The public website for Seura Photos, at https://seuraphotos.app, built with Astro and published to GitHub Pages from `main` (see `.github/workflows/deploy.yml`). It is the project's home page and its devlog. The app itself lives in `seura-photos/seura`.

## Who changes what

- **Devlog posts** (`src/content/devlog/`, `public/images/devlog/`): Claude Code, alongside the app work.
- **Everything else** (pages, layout, styles, SEO, social cards): Nevada's design sessions with Claude in the Claude app. Claude Code may fix a bug it finds there, but larger changes are discussed first.
- Both push to this repository: pull before starting, keep changes small, and don't rewrite each other's work.

## Commands

- `npm ci` then `npm run dev` for a local server; `npm run build` must pass before pushing.
- Pushing to `main` publishes the site within a few minutes. Treat a push as publishing.

## Writing devlog posts

Posts are Markdown files in `src/content/devlog/`, named `NN-short-slug.md`, with frontmatter: `title`, `description` (one or two sentences, shown under the title and in the post list), `date` (YYYY-MM-DD, the day it's published), `part` (the next number), and `draft`.

- **Always create new posts with `draft: true`.** Drafts are built locally but never listed or published. Only Nevada flips a post to `draft: false`, after reading and editing it. Never publish a post he hasn't approved.
- **Voice:** first person, as Nevada. Plain, direct, specific; no hype, no filler, no invented anecdotes. Only state what he actually said, decided, or did. If you're unsure whether something was his idea, phrase it neutrally or ask.
- **Authorship note:** every post page automatically ends with a note that Claude wrote it and Nevada reviewed it. Don't add another, and never remove it.
- **Be open about Claude's role.** Say when something was Claude's suggestion, research, or mistake, and when Nevada decided or corrected something. That honesty is part of the point of the devlog.
- **Sources:** the notes in `docs/journal/` in the seura repository, its commit history, decision records, and the specs. Link to documents in the seura repository rather than repeating them at length.
- **When:** draft a post at the end of each milestone in `docs/milestone-plan.md` (seura repository), and whenever Nevada asks.
- **Images:** WebP files in `public/images/devlog/`, referenced as `/images/devlog/name.webp`. Use `<figure class="wide">` with descriptive `alt` text and a short `figcaption`. Screenshots of the real app are better than mockups once they exist.
- Length: roughly 600 to 1,200 words. End with a link to the next post, or a line about what's next.

## Site rules

- `public/schema/edit/` serves the edit format's JSON Schemas (`1.0.json`, the URL used as `$schema` in every edit file, and `1.x-reader.json`). Copy them from the edit-format repository whenever they change there. Once a format version is released (planned for M7), its schema never changes again; new versions are added alongside.
- Social preview cards are generated at build time for every page (`src/lib/og.ts`, `src/pages/og/`), including each new post; nothing to do by hand. Structured data (schema.org JSON-LD) is in `Base.astro` and the pages. Never add ratings, review counts, or download numbers to it until they're real.
- No tracking, analytics, cookies, ads, or third-party requests. Fonts are self-hosted (`@fontsource/figtree`).
- Colors and type come from `design/tokens.json` in the seura repository; `src/styles/global.css` mirrors them. Change both together.
- Every page must work at phone width and in light and dark mode, and meet WCAG AA contrast.
