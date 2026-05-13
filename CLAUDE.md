@AGENTS.md

## Accessibility Standards

- WCAG 2.1 AA is the baseline target across all shipped routes and shared components.
- Use `goldBody` (`#C49434`) for smaller gold body/support text; reserve `gold` (`#D4A843`) for headings, accents, and high-emphasis UI.
- Respect `prefers-reduced-motion`: animations, transforms, parallax, and looping effects must be disabled or rendered instantly for reduced-motion users.
- Interactive controls must expose visible keyboard focus with a ring (`ring-2`, gold ring color, and ring offset on navy surfaces). Never remove focus styling without a replacement.
- Maintain semantic structure (`header`, `nav`, `main`, `footer`) and a single `h1` per page with logical heading hierarchy.
- Keep the global skip link as the first focusable element, targeting `#main-content` on every route.

## Lighthouse Blockers

- Local automation here verifies builds and code-level accessibility/performance rules, but cannot guarantee exact Lighthouse scores without running browser-based Lighthouse audits against deployed pages.
- The `<img>` tags inside `src/app/icon.tsx` and `src/app/apple-icon.tsx` are intentionally retained because Next.js `ImageResponse` does not support `next/image`.
