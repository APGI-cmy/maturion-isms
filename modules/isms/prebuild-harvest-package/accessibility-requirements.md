# Accessibility and Responsive-Layout Requirements — ISMS Public Landing Harvest

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §16; implementation-map.md
**Version**: v1.0.0

---

## 1. Accessibility Requirements

### 1.1 WCAG 2.1 AA Compliance (minimum)

All harvested pages in `apps/isms-portal/src/pages/` must meet WCAG 2.1 Level AA minimum:

| Requirement | Implementation |
|---|---|
| Color contrast ≥ 4.5:1 for normal text | Use Tailwind default colors which meet this threshold |
| Color contrast ≥ 3:1 for large text | Maintain heading contrast ratios |
| Keyboard navigation | All interactive elements reachable via Tab, activated via Enter/Space |
| Focus indicators | Visible focus ring on all interactive elements (do not remove CSS outline) |
| Screen reader labels | All buttons, links, and icons must have accessible labels |
| Image alt text | Decorative images use `alt=""`, meaningful images have descriptive alt |
| Form labels | All form inputs have associated label elements |
| Error identification | Form errors identified in text, not color alone |
| Language attribute | `<html lang="en">` in `index.html` |

### 1.2 Semantic HTML Requirements

| Requirement | Details |
|---|---|
| Heading hierarchy | Use `h1` for page title, `h2` for sections, `h3` for subsections. Do not skip levels. |
| Landmark regions | Use `<main>`, `<header>`, `<footer>`, `<nav>` as appropriate |
| Button vs link | Use `<button>` for actions, `<a>` for navigation. Not `<div onClick={}>` |
| Lists | Use `<ul>/<li>` for feature lists and navigation groups |

### 1.3 Icon Accessibility

All Lucide icons that convey meaning must have aria labels:

```tsx
// ✅ Correct — icon with text (accessible)
<Button>
  <Target className="h-4 w-4 mr-2" aria-hidden="true" />
  <span>Start Assessment</span>
</Button>

// ✅ Correct — icon-only button with aria-label
<Button aria-label="Close navigation">
  <X className="h-4 w-4" />
</Button>

// ❌ Incorrect — icon without text or label
<Button>
  <Target className="h-4 w-4" />
</Button>
```

### 1.4 Skip Navigation

The landing page MUST include a skip-to-main-content link:

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-primary">
  Skip to main content
</a>
<main id="main-content">
  {/* page content */}
</main>
```

---

## 2. Responsive Layout Requirements

### 2.1 Breakpoint Strategy

Use Tailwind CSS responsive prefixes following the mobile-first approach:

| Breakpoint | Tailwind Prefix | Target |
|---|---|---|
| Mobile | (default) | 320px–767px — single column, stacked layout |
| Tablet | `md:` | 768px–1023px — 2-column grids where applicable |
| Desktop | `lg:` | 1024px+ — full multi-column layouts |
| Wide | `xl:` | 1280px+ — max-width containers centered |

### 2.2 Landing Page (Index.tsx) — Responsive Requirements

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Header | Logo + single sign-in button, hamburger menu | Full header | Full header with all nav items |
| Hero | Centered, h1 at 2xl or 3xl | h1 at 4xl | h1 at 5xl, hero image alongside |
| Feature promise cards | Stacked (1 column) | 2 columns | 3 columns |
| Module discovery cards | Stacked (1 column) | 2 columns | 3 columns |
| Domain/journey cards | Stacked (1 column) | 2 columns | 3 columns |
| Footer CTA | Full width centered | Same | Same |

### 2.3 Module Marketing Pages — Responsive Requirements

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Header icon + title | Centered, stacked | Centered | Centered |
| Features/Benefits grid | 1 column | 2 columns | 2 columns |
| CTA buttons | Full width stacked | Side by side | Side by side |

### 2.4 Subscribe Page — Responsive Requirements

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Pricing tiers | Stacked (1 column) | 2 columns | 3+ columns |
| Toggle (monthly/yearly) | Centered | Centered | Centered |
| Module selection | Stacked | 2 columns | 3 columns |

---

## 3. Performance Requirements

| Requirement | Target |
|---|---|
| First Contentful Paint | < 2 seconds on 4G |
| Largest Contentful Paint | < 3 seconds on 4G |
| No blocking JavaScript on initial render | Use React.lazy for non-critical pages |
| Image optimization | Use appropriate image formats (SVG for icons, WebP for photos) |

---

## 4. Dark Mode Compatibility

The harvested pages use Tailwind's dark mode via class strategy. Ensure:

- Dark mode compatible color classes used (e.g., `dark:text-gray-100`)
- No hardcoded colors that break in dark mode
- `background` and `foreground` CSS variables used via `bg-background` and `text-foreground`

---

## 5. Touch and Mobile Interaction Requirements

| Requirement | Details |
|---|---|
| Touch targets | Minimum 44×44px for all interactive elements |
| Tap highlights | Ensure tap highlight colors are visible but not jarring |
| Scroll behavior | Smooth scroll for in-page anchor links |
| No horizontal scroll | No overflow-x at any viewport width |

---

## 6. Font and Typography Requirements

| Element | Font Size | Weight |
|---|---|---|
| Main heading (Hero h1) | 2xl–5xl responsive | Bold (700) |
| Section headings (h2) | xl–3xl | Semibold (600) |
| Card titles | lg–xl | Semibold (600) |
| Body text | base (16px) | Regular (400) |
| Captions/muted text | sm (14px) | Regular (400) |

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
