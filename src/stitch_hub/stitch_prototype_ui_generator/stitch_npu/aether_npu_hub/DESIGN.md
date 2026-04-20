# Design System Document: Technical Editorial for NPU Benchmarking

## 1. Overview & Creative North Star

### The Creative North Star: "The Precision Architect"
This design system moves beyond the cold, utilitarian aesthetic typical of benchmarking tools. Instead, it adopts the persona of an **Architect of Data**—blending the high-stakes precision of AI hardware performance with the sophisticated, spacious layouts of a premium editorial journal. 

The system rejects the "standard dashboard" template in favor of intentional asymmetry, overlapping organic forms (glass orbs and gradients), and high-contrast typography scales. By leveraging a deep, regal palette of purple and vibrant magenta, we position NPU benchmarking not just as a technical task, but as a high-value industry milestone.

---

## 2. Colors

The color language uses a "Deep Tech" foundation. We utilize deep purples to signify authority and stability, while the vibrant magenta acts as a kinetic energy source for interactive elements.

### Brand & Functional Palettes
*   **Primary (The Foundation):** `primary` (#3e012c) and `primary_container` (#591942). Use these for the most significant structural headers and brand-heavy backgrounds.
*   **Secondary (The Pulse):** `secondary` (#b41b5c) and `secondary_container` (#fe5993). These are reserved for action, progress, and highlights.
*   **Neutrals (The Canvas):** `surface` (#f8f9fb) to `surface_container_highest` (#e0e3e5). A cool-toned light grey spectrum that provides a surgical, clean environment for data.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section off the UI. Sectioning must be achieved through **Background Color Shifts**. 
*   *Example:* A sidebar using `surface_container_low` should sit adjacent to a main content area using `surface`. The edge is defined by the tonal shift, not a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Layer 1 (Base):** `surface`
*   **Layer 2 (Section):** `surface_container_low`
*   **Layer 3 (Card):** `surface_container_lowest` (Pure white)
This nesting creates a "natural lift," making the data feel like it is floating on the canvas rather than being trapped in a grid.

### The "Glass & Gradient" Rule
To add visual "soul," use `surface_tint` and semi-transparent layers for floating hero elements. Incorporate backdrop-blur (12px-20px) to create a frosted glass effect on navigation bars or modal overlays, allowing background organic shapes to bleed through.

---

## 3. Typography

The typography strategy pairs **Manrope** (Display/Headlines) for its geometric, modern authority with **Plus Jakarta Sans** (Body/Title) for its exceptional readability in data-heavy contexts.

*   **Display (Manrope):** Large, assertive scales (`display-lg`: 3.5rem) used for hero metrics or landing titles. Use tight letter-spacing (-0.02em) for a premium editorial feel.
*   **Headline & Title (Manrope/Jakarta):** Clear, semi-bold weights that guide the eye through complex benchmark categories.
*   **Body (Plus Jakarta Sans):** Optimized for technical reports. Use `body-md` (0.875rem) for most data tables to maximize information density without sacrificing legibility.
*   **Label (Inter):** Reserved for micro-data, tooltips, and status tags. 

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Stacking**. By placing a `surface_container_lowest` (White) card on a `surface_container_low` (Light Grey) background, we create a soft, sophisticated elevation.

### Ambient Shadows
When a card requires a "floating" state (e.g., a hovered benchmark result), use a custom Ambient Shadow:
*   **Blur:** 24px - 40px
*   **Opacity:** 4% - 8%
*   **Color:** Use a tinted version of `on_surface` (deep indigo/purple) rather than black to ensure the shadow feels like a natural lighting effect.

### The "Ghost Border"
If a border is required for accessibility (e.g., input fields), use a **Ghost Border**: `outline_variant` at 20% opacity. Never use high-contrast, 100% opaque lines.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary_container` with `on_primary` text. Apply `lg` (1rem) roundedness.
*   **Secondary/Action:** Gradient fill transitioning from `secondary` to `secondary_container`.
*   **Tertiary:** Ghost style with `primary` text and a subtle `surface_container_high` hover state.

### Cards (The "Benchmark Container")
Cards are the heart of this system. 
*   **Visual Style:** `surface_container_lowest` background, `md` (0.75rem) or `lg` (1.0rem) corner radius.
*   **Data Layout:** Use vertical whitespace (1.5rem+) instead of dividers to separate header, chart, and footer sections within the card.

### Progress Bars & Charts
*   **The Pulse:** Use `secondary` for positive growth/high performance and `error` for bottlenecks. 
*   **Background:** The track of a progress bar should use `surface_container_high` to ensure it feels recessed into the card.

### Chips & Tags
*   **Status Chips:** Small, pill-shaped (`full` roundedness). Use `tertiary_container` for "Success" and `error_container` for "Failed," ensuring the `on_container` text color provides sufficient contrast.

---

## 6. Do's and Don'ts

### Do
*   **DO** use intentional asymmetry in hero sections (e.g., text left, organic glass orbs right).
*   **DO** use high-contrast typography scales to emphasize the most important benchmark number (e.g., 65% gain).
*   **DO** leave generous "breathing room" (padding) around data visualizations.

### Don't
*   **DON'T** use 1px solid black or grey lines to separate content; let color transitions do the work.
*   **DON'T** use sharp 90-degree corners. Everything must feel engineered yet approachable (use the `md` to `xl` roundedness scale).
*   **DON'T** use generic "Material Blue." Stick strictly to the deep purple and magenta palette to maintain the signature NPU Bench identity.
*   **DON'T** clutter the UI. If a piece of data isn't essential to the benchmark, hide it in a "details" accordion or tooltip.