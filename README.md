# Raven AI Application

## Notes

### No dynamic routes in the Tauri app

The Tauri app (`app/`) uses Next.js with `output: "export"`, because Tauri cannot run a Next.js server. Every page must therefore be pre-rendered at build time, which rules out dynamic route segments whose values are only known at runtime, such as a conversation id (`/[locale]/[slug]`). Using one fails with `generateStaticParams() ... Missing: "slug"`, and client navigation falls back to a full page load that 404s.

Only segments with a finite, build-time-known set of values are allowed (for example `[locale]`, via `generateStaticParams`). Pass runtime values through the query string instead, and read them with `useSearchParams` inside a `<Suspense>` boundary. For example, a conversation is opened at `/chat?id=<id>`.

The `web/` app runs a real Next.js server and may keep dynamic routes (`/<id>`). Shared code in `base-ui` must not hard-code paths; get them from the platform context instead (for example `useRavenPlatform().conversationRouter(id)`).
