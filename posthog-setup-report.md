# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for Shubham Gupta's portfolio site. PostHog is initialized via `instrumentation-client.ts` (the Next.js 15.3+ recommended pattern) with a reverse proxy configured in `next.config.ts` so all analytics traffic routes through `/ingest` rather than directly to PostHog's servers. Automatic exception capture (`capture_exceptions: true`) is enabled globally. Ten business-relevant events are instrumented across eight files covering the portfolio's key engagement surfaces: canvas navigation, contact conversion, outbound links, spotlight search, theme toggling, and the Konami code easter egg.

| Event | Description | File |
|---|---|---|
| `canvas_item_focused` | Visitor navigates to a specific canvas card | `components/portfolio/portfolio-canvas.tsx` |
| `contact_email_copied` | Visitor copies contact email via "Get in touch" button — key conversion | `components/portfolio/say-hi-button.tsx` |
| `spotlight_opened` | Visitor opens the Cmd+K spotlight search | `components/portfolio/portfolio-canvas.tsx` |
| `spotlight_item_selected` | Visitor selects a nav item, action, or link from spotlight | `components/portfolio/canvas-spotlight.tsx` |
| `social_link_visited` | Visitor clicks a social profile link (LinkedIn, GitHub, etc.) | `components/portfolio/socials-card.tsx` |
| `project_link_visited` | Visitor clicks the VISIT link on a project card | `components/portfolio/project-card.tsx` |
| `experience_link_visited` | Visitor clicks the VISIT link on a work experience card | `components/portfolio/experience-card.tsx` |
| `theme_toggled` | Visitor switches between light and dark mode | `components/portfolio/theme-provider.tsx` |
| `konami_code_triggered` | Visitor enters the Konami code (easter egg) | `components/portfolio/portfolio-canvas.tsx` |
| `canvas_link_copied` | Visitor copies a deep link to a canvas item via right-click menu | `components/portfolio/canvas-menu.tsx` |

## Next steps

Five insights and a dashboard have been created in PostHog to monitor portfolio engagement:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/474351/dashboard/1724587)
- [Contact email copies](https://us.posthog.com/project/474351/insights/4yoIrnVi) — Bold number: total email copy events (primary conversion)
- [Canvas navigation over time](https://us.posthog.com/project/474351/insights/6BfyAwEe) — Daily unique visitors navigating canvas cards
- [Top canvas cards viewed](https://us.posthog.com/project/474351/insights/D09CUuhp) — Bar chart of card views broken down by card label
- [Outbound link clicks](https://us.posthog.com/project/474351/insights/M5pA0lzA) — Social, project, and experience link clicks over time
- [Spotlight search usage](https://us.posthog.com/project/474351/insights/oKJsF8rF) — Spotlight opens vs items selected (search-to-action ratio)

## Verify before merging

- [ ] Run `pnpm add posthog-js` — the package install was blocked by the sandbox; the dependency must be added before deploying.
- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent) into CI so production stack traces de-minify in PostHog Error Tracking.

### Agent skill

A skill folder has been left in `.claude/skills/integration-nextjs-app-router/`. Use this context for further agent development with Claude Code to ensure the model provides the most up-to-date approaches for integrating PostHog.
