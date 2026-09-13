---
name: Atelier Minimalist
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#4b463f'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#7c766e'
  outline-variant: '#cdc5bc'
  surface-tint: '#615e5a'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1d1b18'
  on-primary-container: '#87837f'
  inverse-primary: '#cbc5c0'
  secondary: '#8e4d2c'
  on-secondary: '#ffffff'
  secondary-container: '#feaa82'
  on-secondary-container: '#793c1d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f1b15'
  on-tertiary-container: '#8a837a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7e1dc'
  primary-fixed-dim: '#cbc5c0'
  on-primary-fixed: '#1d1b18'
  on-primary-fixed-variant: '#494643'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb694'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#713617'
  tertiary-fixed: '#eae1d7'
  tertiary-fixed-dim: '#cec5bb'
  on-tertiary-fixed: '#1f1b15'
  on-tertiary-fixed-variant: '#4b463f'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
  spec-numeral:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.04em
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system embodies the ethos of a high-end textile atelier: disciplined, tactile, architectural, and deeply rooted in material provenance. It rejects synthetic digital tropes, plastic gradients, and decorative triviality in favor of structural clarity, generous negative space, and typographic cadence inspired by physical broadsides and curated textile sample books.

The visual tone serves an audience of interior architects, couturiers, textile designers, and discerning collectors who evaluate fabrics by hand-feel, thread gauge, weave density, and light interaction. Interfaces behave like gallery plinths—understated, quiet, and precisely proportioned—ensuring raw linens, virgin wools, slub silks, and heavy denims remain the absolute focal point. Every interaction emphasizes deliberate craftsmanship: micro-transitions mimic physical sheets turning, metadata reads like architectural specifications, and surface contrast remains organic and grounded.

## Colors

The palette is derived from natural plant dyes, raw loom-state fibers, and kiln-fired clays. It prioritizes low-saturation warmth over stark digital monochrome.

- **Primary (`#1C1A17` - Charred Obsidian):** Anchors high-priority typographic hierarchy, high-contrast borders, solid call-to-action fills, and primary branding glyphs.
- **Secondary (`#9E5A38` - Raw Terracotta Ochre):** Used sparingly as an accent for editorial callouts, active curation badges, bespoke swatch selections, and focused interactive states.
- **Tertiary (`#6B655D` - Muted Atelier Taupe):** Dedicated to technical metadata, fabric specs (gsm, yarn count), secondary iconography, and structural subtitle tags.
- **Neutral Canvas (`#F9F6F0` - Unbleached Linen Ecru):** The default root background layer. Paired with `#F3EFE6` (Warm Card Surface) for subtle container differentiation, and `#E5DFD5` (Sand Border) for hairline 1px architectural divisions.
- **Pure Black/Pure White Prohibition:** Pure `#000000` and pure `#FFFFFF` are forbidden across all surfaces and body text to preserve a tactile, non-glare, paper-like surface experience.

## Typography

Typographic balance relies on the tension between classical haute-couture editorial display titles and clinical, high-legibility geometric sans for technical specifications.

- **Editorial Headings (`Playfair Display`):** Reserved for product titles, collection narratives, lookbook chapter openers, and hero introductions. Kept strictly at regular (400) and medium (500) weights to avoid heavy, commercialized distortion.
- **Architectural & Technical Body (`DM Sans`):** Employed for product descriptions, cart matrices, and ordering interfaces. Its neutral geometric skeleton counters the romantic character of the display serif.
- **Uppercase Micro-Tracking:** The `label-caps` token mandates uppercase presentation with an expanded letter-spacing of `0.12em`. This style is used universally for technical specifications (e.g., `COMPOSICIÓN`, `GRAMAJE: 420 GSM`, `ANCHO: 145 CM`, `CAÍDA: ESTRUCTURADA`).

## Layout & Spacing

The layout is built upon an architectural grid with expansive canvas margins, producing an editorial broadsheet experience that lets high-resolution textile imagery breathe.

- **Grid Architecture:** Desktop views implement a 12-column fluid grid bound by maximum container widths of `1440px`. Tablet transitions to an 8-column layout, and mobile consolidates into 4 columns.
- **Negative Space Rhythm:** Spacing between distinct narrative modules scales aggressively (using `space-2xl` and upward) to establish an unhurried, museum-grade pacing. Content is never dense for the sake of viewport efficiency; vertical breathing room conveys luxury.
- **Alignment & Dividers:** Grid alignments are strictly respected. Sections are delineated by razor-thin, single-pixel hairline borders (`#E5DFD5`) rather than tonal drop-outs, reinforcing the structural draftsman aesthetic.

## Elevation & Depth

This design system intentionally rejects heavy raster drop shadows, neon glows, and glassmorphic blurs. Depth is achieved purely through planar layering and tonal shifts.

- **Hairline Boundary Tiers:** Structural separation relies on `1px solid #E5DFD5`. Modals, flyout drawers, and dropdown menus utilize a crisp `#1C1A17` 1px perimeter border rather than blurred drop shadows, retaining a clean physical paper feel.
- **Surface Elevation:** Secondary layers (floating specimen detail cards, cart slide-outs, fabric inspectors) sit on `#F3EFE6` over the `#F9F6F0` ground.
- **Tactile Hover Depth:** Interactive elements like fabric cards do not lift along the Z-axis via shadow expansions. Instead, interactions trigger subtle border color shifts (from `#E5DFD5` to `#1C1A17`) or initiate an ultra-slow image micro-zoom (1.02x scaling over 600ms cubic-bezier transitions) simulating closer ocular examination.

## Shapes

The primary shape profile is strictly architectural and square (`roundedness: 0`), reflecting woven warp-and-weft intersections, cut reams of cloth, and clean atelier tables.

- **Base Components:** Product cards, modal dialogs, input containers, filter drawers, and architectural image frames possess exact `0px` radii.
- **Contextual Exceptions:** Swatch color pills and physical thread-sample loops utilize fully rounded circular dimensions (`9999px`) purely to represent the tactile, cut circular swatch disc of a physical textile sample deck. All structural interface containers remain razor-sharp.

## Components

### Buttons
- **Primary Action:** Sharp-cornered rectangle (`0px` border-radius), filled with `#1C1A17`, typed in `DM Sans` 12px uppercase (`letter-spacing: 0.12em`), text colored `#F9F6F0`. On hover, background shifts softly to `#9E5A38` with an instantaneous cursor cue.
- **Secondary / Outline:** Transparent fill, `1px solid #1C1A17` border, `#1C1A17` text. On hover, fills solid with `#1C1A17` and inverts text to `#F9F6F0`.
- **Text Link Button:** Underlined with a `1px` offset baseline in `#1C1A17` or `#9E5A38`, with zero horizontal padding.

### Swatch Chips & Fabric Selectors
- **Material Disc:** 36px circular swatch displaying real macro textile weave patterns or solid dye approximations.
- **Selected State:** Enclosed by an outer concentric hairline ring with 3px of white-space padding (`outline: 1px solid #1C1A17; outline-offset: 3px`).
- **Tactile Specimen Chip:** A hybrid chip presenting a square macro textile preview thumbnail followed by swatch code and GSM count in `spec-numeral`.

### Product & Editorial Cards
- **Border-Only Frame:** Zero elevation shadows. Encased in a `1px solid #E5DFD5` hairline border.
- **Aspect Ratios:** Strict vertical orientation (`3:4` or `4:5`) mimicking archival folio plates.
- **Metadata Stack:** Located beneath the visual plate, presenting fabric family name in `headline-sm`, followed by a split spec row: composition on the left, weight (`gsm`) on the right in muted taupe (`#6B655D`).

### Form Inputs & Text Fields
- **Minimal Underline or Framed Box:** Default fields use an understated 1-pixel border `#E5DFD5` with `#F9F6F0` interior background. Focus shifts the bottom line or total border to `#1C1A17` without outer glow rings.
- **Floating Typography Labels:** Field labels utilize `label-caps` styled in `#6B655D`.

### Checkboxes & Radio Selectors
- **Checkboxes:** Sharp square boxes (`16px x 16px`), `1px solid #1C1A17`. When checked, filled with `#1C1A17` displaying a crisp geometric inner square or minimal hairline check mark.
- **Radios:** Concentric circles, activating with a solid centered `#1C1A17` circle dot upon selection.

### Navigation Bar
- **Header Structure:** Bound to `#F9F6F0` with a persistent lower hairline divider (`1px solid #E5DFD5`).
- **Brand Plinth:** Central wordmark in high-contrast serif typography.
- **Utility Modules:** Discrete text links for showroom curation, textile archive, and sample books. Left edge houses a minimalist currency switcher (EUR / USD / GBP); right edge holds a quiet numeric counter for the curation bag and sample binder (`[ 0 ]`).