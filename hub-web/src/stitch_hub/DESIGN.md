---
name: Institutional Intelligence Grid
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#554248'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#877178'
  outline-variant: '#dac0c8'
  surface-tint: '#a2346a'
  primary: '#69003d'
  on-primary: '#ffffff'
  primary-container: '#881e55'
  on-primary-container: '#ff9bc4'
  inverse-primary: '#ffb0ce'
  secondary: '#a82581'
  on-secondary: '#ffffff'
  secondary-container: '#fe6fcb'
  on-secondary-container: '#710054'
  tertiary: '#610d4c'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d2864'
  on-tertiary-container: '#ff98d9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e5'
  primary-fixed-dim: '#ffb0ce'
  on-primary-fixed: '#3e0022'
  on-primary-fixed-variant: '#841a52'
  secondary-fixed: '#ffd8eb'
  secondary-fixed-dim: '#ffaedb'
  on-secondary-fixed: '#3c002b'
  on-secondary-fixed-variant: '#880067'
  tertiary-fixed: '#ffd8ec'
  tertiary-fixed-dim: '#ffaede'
  on-tertiary-fixed: '#3b002d'
  on-tertiary-fixed-variant: '#792461'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  subheadline:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  navbar_height: 64px
  gutter: 24px
  margin_edge: 48px
  section_gap: 80px
  card_padding: 24px
---

## Brand & Style

The design system is engineered to project the prestige and rigor of high-level academic research. It balances the precision of hardware benchmarking with the institutional warmth of the Shenzhen Loop Area Institute aesthetic. The visual style is **Corporate Modern with Academic Nuance**, emphasizing clarity, intellectual authority, and technical sophistication.

The interface evokes a sense of "digital high-tech lab" through the use of expansive white space, light-weighted surfaces, and high-precision typography. The primary emotional response should be one of absolute reliability and institutional trust, punctuated by vibrant magenta accents that represent innovation and the dynamic nature of NPU development. Decorative fluid shapes provide a organic counterpoint to the rigid data tables, softening the technical edge without sacrificing professionalism.

## Colors

This design system utilizes a sophisticated light-mode palette. The foundation is built on **Pure White (#FFFFFF)** for primary layout backgrounds to maintain an airy, academic feel. **Warm Gray (#F7F5F4)** is used for large structural surfaces (like sidebars or background sections) to provide subtle contrast without being stark.

The color strategy centers on a "Magenta Spectrum." **Deep Magenta (#881E55)** serves as the primary anchor for institutional branding and core actions. **Bright Pink (#D14AA4)** and **Soft Pink (#E27DBE)** are used for gradients and highlights to signify progress, active states, and modern energy. **Charcoal (#262626)** is reserved for high-contrast typography and decorative structural lines, ensuring data remains grounded and legible.

## Typography

The typography system prioritizes data legibility and hierarchy. For English and UI elements, **Public Sans** (or HarmonyOS Sans equivalent) provides a clean, institutional geometric rhythm. For Chinese characters, **Microsoft YaHei** or **PingFang SC** should be used, maintaining a consistent weight profile with the English counterparts.

**Hierarchy Rules:**
- **Headlines:** Large-scale headings (H1) are used sparingly for main landing areas or report titles.
- **Sub-headlines:** 18px text acts as the primary bridge between titles and data blocks.
- **UI Labels:** Dense information clusters (like benchmark tables) utilize 12-14px labels to maximize data density while maintaining "institutional clarity."
- **Data Display:** Numerical values in benchmark results should utilize a consistent character width to allow for easy vertical scanning.

## Layout & Spacing

The design system employs a **Fixed-Width Grid** for primary content (max-width 1280px) to ensure a controlled reading experience, centered on the screen. A 12-column system is used for dashboard layouts, while a single-column focused layout is preferred for research papers or individual benchmark results.

The spacing rhythm is "Institutional and Airy." Generous margins (48px+) separate major sections, while internal component spacing follows a strict 4px/8px incremental scale. The **64px Navigation Bar** remains fixed, providing a persistent anchor for the institutional identity and primary site hierarchy.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Tinted Ambient Shadows** rather than traditional heavy shadows.

- **The Base:** Pure White (#FFFFFF).
- **Secondary Surfaces:** Warm Gray (#F7F5F4) defines structural blocks.
- **The Depth Effect:** Cards and interactive containers use a specialized shadow: `0 2px 12px rgba(136,30,85,0.08)`. This subtle magenta tint in the shadow creates a "glow" that ties the element to the brand identity.
- **Translucent Overlays:** Layered fluid organic shapes in magenta tones (8% to 15% opacity) sit in the background of headers or hero sections, creating a sense of sophisticated, non-intrusive movement.

## Shapes

The shape language is **Refined and Structured**. A standard 8px (0.5rem) corner radius is applied to cards, buttons, and input fields, striking a balance between modern friendliness and professional rigidity.

Larger containers or sections may use the `rounded-lg` (1rem) or `rounded-xl` (1.5rem) values for a more contemporary, softened appearance. Decorative elements—specifically the background fluid shapes—should feature organic, non-geometric curves to contrast against the mathematical precision of the UI.

## Components

### Buttons
- **Primary:** High-visibility buttons featuring a linear gradient from Deep Magenta (#881E55) to Bright Pink (#D14AA4). Text is white, bold, and centered.
- **Ghost:** Transparent background with a 1px solid Deep Magenta border and Deep Magenta text.
- **Data Action:** Small 12px label buttons for table interactions, using Charcoal text with subtle gray backgrounds on hover.

### Cards
- **Benchmark Card:** White background (#FFFFFF) with a 1px border tinted in `rgba(136,30,85,0.1)`. Features the custom tinted shadow and 8px corners. Used for grouping specific model results or hardware specs.

### Navigation
- **Top Bar:** 64px height, pure white, with a thin Charcoal or light Magenta bottom border. Features the institutional logo on the left and utility links on the right.

### Input Fields & Data Tables
- **Inputs:** 1px solid Warm Gray borders that transition to Deep Magenta on focus. 
- **Tables:** Clean, header-heavy design. Table headers use Charcoal background with White 12px caps text. Alternating rows use subtle Warm Gray (#F7F5F4) for readability.

### Status Indicators
- Use small, filled circular "pills" for status. Success Green (#16A34A), Error Red (#DC2626), and Warning Amber (#D97706) are used exclusively for system health and benchmark validation status.