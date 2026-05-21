# Portfolio

Personal portfolio for Shubham Gupta, built with Next.js (App Router) and Tailwind CSS v4.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Shared UI components in `packages/ui` (`@repo/ui`)

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize for your profile

Update site metadata and copy in:

- `lib/site.ts` — title, description, author, URLs
- `lib/social-links.ts` — social links
- `app/page.tsx` — home hero
- `app/about/` — about page content
- `app/work/work-projects.ts` — projects
- `content/writings/` — MDX blog posts
- `public/images/` and `public/videos/` — media assets

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start dev server         |
| `pnpm build`   | Production build         |
| `pnpm start`   | Serve production build   |
| `pnpm lint`    | Run ESLint               |
| `pnpm typecheck` | TypeScript check       |
