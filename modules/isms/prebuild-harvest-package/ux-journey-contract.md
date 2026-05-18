# UX Journey Contract — ISMS Public Landing

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §4, §6, §16.7
**Version**: v1.0.0

---

## 1. Canonical User Journey Sequence

This sequence is **sacred** and must be preserved in all ISMS public landing and module waves:

```
ISMS Public Landing (/)
  → Module Discovery (scroll or /modules)
    → Module Card click → Module Marketing Page (/marketing/<module>)
      → "Start Free Assessment" CTA → Free Assessment (/free-assessment)
      — OR —
      → "Subscribe" / "Get Started" CTA → Subscribe (/subscribe)
        → Package Selection → Checkout (/subscribe/checkout)
          → Account Creation (/auth or /sign-up)
            → Get-To-Know-You Profile (onboarding)
              → Module Workspace (e.g., /maturity/setup for MMM)
```

---

## 2. Journey Stage Contracts

### Stage 1: ISMS Public Landing (`/`)

**Purpose**: Platform discovery and first-impression hero.

**UX contract**:
- Page loads without authentication (PUBLIC)
- Hero section visible immediately on load (above fold)
- "Start Free Assessment" CTA is the primary conversion action
- "Sign In" link for returning users (not primary CTA)
- Module discovery cards visible in single scroll (below hero)
- All 7 module cards present
- Journey/domains section present

**Entry states**:
- Anonymous user (first visit) → full public page
- Authenticated user → same page + additional "Go to Dashboard" button

**Exit paths**:
- → `/free-assessment` (primary CTA)
- → `/marketing/<module>` (card click)
- → `/modules` (see all modules)
- → `/journey` (explore ISMS journey)
- → `/subscribe` (subscribe CTA)
- → `/auth` (sign in)
- → `/dashboard` (authenticated users)

---

### Stage 2: Module Marketing Page (`/marketing/<module>`)

**Purpose**: Module-specific explanation, value proposition, and conversion CTA.

**UX contract**:
- Page loads without authentication (PUBLIC)
- Module name and badge prominently displayed
- Features list (6+ items)
- Benefits cards (3-card grid)
- Primary CTA: "Subscribe to Unlock" → `/subscribe`
- Secondary CTA: "Start Free Assessment" (for MMM marketing page only)
- Back navigation: "← Back to Platform" → `/`

**Entry paths**:
- From `/` module card click
- From `/modules` overview
- From `/journey` domain exploration
- Direct URL

---

### Stage 3: Free Assessment (`/free-assessment`)

**Purpose**: Lead magnet — 5 domains × 5 questions, immediate maturity score, subscribe prompt.

**UX contract**:
- Page loads without authentication (PUBLIC)
- Assessment is tied to Maturity Roadmap / MMM module
- Completion shows maturity score with domain breakdown
- Score result includes "Subscribe to unlock full Maturity Roadmap" CTA → `/subscribe`
- Results stored in localStorage for use on subscribe page

**Key invariant**:
- Free Assessment is ALWAYS tied to MMM/Maturity Roadmap
- Results feed into Subscribe page pre-population

---

### Stage 4: Subscribe (`/subscribe`)

**Purpose**: Package/tier selection, pricing.

**UX contract**:
- Page loads without authentication (PUBLIC)
- Shows pricing tiers
- Assessment results from localStorage populate context where available
- Primary CTA: "Get Started" / "Subscribe" → `/subscribe/checkout`
- Back: "← Explore Modules" → `/`

---

### Stage 5: Checkout (`/subscribe/checkout`)

**Purpose**: Payment intent initiation and account creation entry.

**UX contract**:
- Page loads without authentication (PUBLIC)
- Payment form / Stripe intent
- On completion → redirect to account creation

---

### Stage 6: Account Creation (`/auth`)

**Purpose**: User signs up or signs in.

**UX contract**:
- Standard email/password or OAuth
- On account creation → Get-To-Know-You profile
- On existing login → Dashboard

---

### Stage 7: Get-To-Know-You Profile (Post-signup)

**Purpose**: AI personalisation profile collection.

**UX contract** (MMM wave #1639 owns this):
- Collects: user role, organisation info, industry, region, threats, preferred modules
- Powers AI personalisation
- On completion → Module workspace entry (e.g., `/maturity/setup` for MMM)

> **Note**: This stage is owned by MMM issue #1639 and is NOT in scope for this wave.

---

### Stage 8: Module Workspace Entry

**Purpose**: First-run inside subscribed module.

**UX contract** (owned by respective module):
- MMM → `/maturity/setup` (maturity roadmap workspace)
- PIT → PIT workspace (future wave)
- Risk → Risk workspace (future wave)
- etc.

---

## 3. Navigation Invariants

These navigation invariants must hold at all times:

| Invariant | Check |
|---|---|
| User can always return to `/` from any public page | Back navigation or logo click |
| Subscribe CTA is present on every module marketing page | Required CTA element |
| Free Assessment CTA is present on landing page and MMM marketing page | Required CTA element |
| Module cards are always visible on `/` without scrolling (above fold on desktop) | Layout requirement |
| Authentication is NEVER required to reach any `/marketing/*` route | Route protection check |
| Authentication is NEVER required to reach `/free-assessment` | Route protection check |
| Authenticated users see extra actions but not a completely different page | Conditional rendering |

---

## 4. MMM-Specific Journey Contracts

### 4.1 Free Assessment → MMM link

The free assessment at `/free-assessment` is tied to MMM. It must:
- Display "Maturity Roadmap" branding
- Route to MMM subscribe page on completion
- NOT be presented as a generic ISMS assessment

### 4.2 MMM module card

The Maturity Roadmap card on `/` must:
- Link to `/marketing/maturity-roadmap`
- Show "Free Assessment Available" indicator
- NOT replace the ISMS landing page

### 4.3 Post-assessment subscribe

On `/subscribe`, the assessment results from localStorage must:
- Be surfaced as context: "Based on your assessment: Level X across 5 domains"
- Pre-select or recommend the Maturion Core Platform tier

---

## 5. Hover/Preview State Contracts

For module cards with hover effects:

```
Default state: Icon, title, one-liner, "Learn More" button
Hover state: Expanded preview detail text visible (via CSS or state toggle)
Click: Navigate to module marketing page
```

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
