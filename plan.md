# The Warp Media Website - Implementation Plan

## Phase 1: Design System & Foundation

### 1.1 SCSS Design Tokens

Create color system in `src/shared/styles/design-tokens/colors.scss`:

- Primary colors: `$color-black: #1a1a1a`, `$color-bone: #f5f0e8`, `$color-gold: #d4af37`
- Semantic variables for backgrounds, text, accents
- Export CSS custom properties for use in components

### 1.2 Animation Mixins

Create `src/shared/styles/mixins/animations.scss`:

- `@mixin fade-in-up()` - Scroll reveal animations
- `@mixin parallax-scroll()` - Background parallax effect
- `@mixin layered-reveal()` - Section layer transitions
- `@mixin footer-peel()` - Footer reveal from behind effect

Create `src/shared/styles/mixins/transitions.scss`:

- `@mixin page-transition()` - Page navigation transitions
- `@mixin loading-animation()` - Loading screen utilities

## Phase 2: Core Infrastructure

### 2.1 Animation Infrastructure

Create `src/infrastructure/animations/providers/LoadingProvider.tsx`:

- Global loading state management
- Controls 2.5s loading sequence
- Prevents interaction during loading

Create `src/infrastructure/animations/hooks/useSmoothScroll.ts`:

- Integrate Lenis for smooth scrolling
- Sync with GSAP ScrollTrigger

Create `src/infrastructure/animations/lib/scrollAnimations.ts`:

- Parallax scroll utilities
- Layered section reveal functions
- Footer peel effect logic

### 2.2 Page Transition System

Create `src/infrastructure/animations/providers/PageTransitionProvider.tsx`:

- Wrap app with Framer Motion AnimatePresence
- Handle route change animations
- Coordinate with loading screen

## Phase 3: Shared UI Components

### 3.1 Button Component

Create `src/shared/ui/Button/`:

- Primary, secondary, ghost variants
- Hover effects with gold accent
- Link and button versions

### 3.2 VideoBackground Component

Create `src/shared/ui/VideoBackground/`:

- Accept video/GIF URL prop
- Autoplay, loop, muted
- Performance optimized (lazy loading)
- Overlay gradient option

### 3.3 AnimatedText Component

Create `src/shared/ui/AnimatedText/`:

- Character-by-character reveal
- Word split animations
- Scroll-triggered entrance

### 3.4 Card Component

Create `src/shared/ui/Card/`:

- Work card styling
- Info block styling
- Hover animations

## Phase 4: Loading Screen Widget

### 4.1 LoadingScreen Component

Create `src/widgets/LoadingScreen/`:

**Animation Sequence (2.5s total):**

1. Initial: Bone background, centered shrunken + rotated logo
2. 0-1s: Logo unshrinks (center expands) + counter-rotates to final position
3. 1-1.5s: Two horizontal black lines appear from center, extend left/right
4. 1.5-2s: Top half slides up, bottom slides down (doors opening), logo splits
5. 2-2.5s: Page content zooms forward from behind

**Implementation:**

- Use Framer Motion for orchestrated animations
- GSAP for precise timing control
- SVG logo manipulation (will use placeholder until SVG provided)
- Z-index layering for reveal effect

## Phase 5: Layout Widgets

### 5.1 Navigation Widget

Create `src/widgets/Navigation/`:

- Fixed header with logo + links (About, Works, Trial, Contact)
- Links navigate to pages (not scroll anchors)
- Smooth entrance animation on load
- Hover effects with gold accent
- Mobile responsive hamburger menu

### 5.2 Footer Widget

Create `src/widgets/Footer/`:

- Contact links (Telegram, socials)
- Copyright info
- **Peel reveal effect**: Appears from behind last section on scroll
- Uses GSAP ScrollTrigger for reveal animation

## Phase 6: Homepage Sections

### 6.1 HeroSection Widget

Create `src/widgets/HeroSection/`:

- VideoBackground component (always visible)
- Centered text: "THE[LOGO]WARP" at bottom
- Minimal, cinematic entrance
- Scroll indicator

### 6.2 AboutSection Widget

Create `src/widgets/AboutSection/`:

- Brief mode: 2-3 sentences + "Learn More" button → `/about`
- Full mode: Complete about content (for `/about` page)
- Section background (video visible or covered, decide later)
- Fade-in-up animation on scroll

### 6.3 WorksSection Widget

Create `src/widgets/WorksSection/`:

- Grid mode: 3-6 featured projects from `public/data/works.json`
- Full mode: All projects (for `/works` page)
- WorkCard components with hover effects
- "View All Work" button → `/works` (on homepage only)
- Filter/category options (full mode)

### 6.4 TrialSection Widget

Create `src/widgets/TrialSection/`:

- Brief mode: CTA with key points + "Get Started" → `/trial`
- Full mode: Detailed trial info, terms, process
- Eye-catching design with gold accent
- Form or direct links to contact

### 6.5 ContactSection Widget

Create `src/widgets/ContactSection/`:

- Brief mode: Telegram link + socials
- Full mode: Multiple contact methods, hours, FAQ
- Styled contact cards
- No backend form (just links)

## Phase 7: Pages Implementation

### 7.1 Homepage

Update `src/app/page.tsx`:

- Stack all section widgets vertically
- Each in brief mode with CTA buttons
- Smooth scroll enabled
- Layered transitions between sections
- VideoBackground as persistent layer

### 7.2 About Page

Create `src/app/about/page.tsx`:

- AboutSection in full mode
- Team info, mission, detailed story
- Same footer reveal effect

### 7.3 Works Page

Create `src/app/works/page.tsx`:

- WorksSection in full mode
- All projects from JSON
- Filter/category UI
- Grid layout

### 7.4 Trial Page

Create `src/app/trial/page.tsx`:

- TrialSection in full mode
- Detailed process, FAQ, terms
- CTA to contact

### 7.5 Contact Page

Create `src/app/contact/page.tsx`:

- ContactSection in full mode
- All contact methods
- Embedded social feeds (optional)

## Phase 8: Data & Content

### 8.1 Works Data

Create `public/data/works.json`:

```json
[
  {
    "id": "1",
    "title": "Project Title",
    "description": "Brief description",
    "category": "Animation/Reel/Short",
    "thumbnail": "/images/works/project1.jpg",
    "videoUrl": "https://youtube.com/...",
    "featured": true
  }
]
```

### 8.2 Placeholder Assets

- Logo SVG placeholder (black star + circle segments)
- Sample background video/GIF
- Project thumbnail placeholders

## Phase 9: Root Layout Updates

### 9.1 Update Layout

Update `src/app/layout.tsx`:

- Wrap with LoadingProvider
- Wrap with PageTransitionProvider
- Add SmoothScrollProvider
- Metadata with brand info

## Phase 10: Polish & Effects

### 10.1 Scroll Animations

- Parallax on video background
- Layered section reveals (sections slide over each other)
- Text reveals on scroll
- Card stagger animations

### 10.2 Hover Effects

- Button hover with gold glow
- Work card hover scale + overlay
- Link underline animations

### 10.3 Responsive Design

- Mobile: Stack sections, simpler animations
- Tablet: Adjusted grid layouts
- Desktop: Full parallax and effects

## Key Technical Decisions

1. **Loading Screen**: Framer Motion + GSAP for precise control
2. **Smooth Scroll**: Lenis + GSAP ScrollTrigger integration
3. **Page Transitions**: Framer Motion AnimatePresence
4. **Video Background**: Native HTML5 video with fallback
5. **Works Data**: Static JSON file (easily upgradeable to CMS)
6. **Contact**: External links only (no form backend)
7. **Footer Reveal**: GSAP ScrollTrigger with clip-path/transform
8. **Colors**: SCSS variables + CSS custom properties for runtime changes

## Files to Create (Summary)

- 8 widget folders with components
- 5 page files (home, about, works, trial, contact)
- 4 shared UI components
- 3 animation infrastructure files
- 2 animation providers
- Design tokens (colors, spacing, typography)
- Animation mixins (4 files)
- Works data JSON
- Placeholder assets

**Estimated: ~35 files, 2500+ lines of code**

---

**Ready to execute!** This plan creates a production-ready, highly animated website following FSD principles. Each phase builds on the previous, and the structure supports easy modifications.
