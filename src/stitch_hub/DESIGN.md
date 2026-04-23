# Design System Documentation: High-End Editorial AI Benchmarking

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Precision Curator."** 

In the realm of AI benchmarking, data is often cold and overwhelming. This system rejects the "standard dashboard" aesthetic in favor of a high-end editorial experience that blends academic rigor with the fluid energy of cutting-edge technology. We move beyond the "template" look by utilizing intentional asymmetry, expansive breathing room, and a depth-first architecture. 

Rather than boxing data into rigid grids, we treat information as a series of curated layers. The interface should feel like a physical desk—stacked with fine paper, frosted glass, and precise instruments—where hierarchy is defined by light and shadow rather than strokes and lines.

---

## 2. Colors & Surface Philosophy

### Color Palette Strategy
We utilize a sophisticated palette where Magenta (`primary`) and Purple (`secondary`) act as precision markers against a pristine, "warm-white" foundation (`surface`).

- **Primary (`#b0004a`):** Used for critical actions and high-level brand moments.
- **Secondary (`#942cb0`):** Reserved for technical accents, secondary data points, and gradient transitions.
- **Surface & Background (`#fff8f7`):** This is not a sterile white, but a nuanced, warm paper-tone that reduces eye strain during long research sessions.

### The "No-Line" Rule
**Explicit Instruction:** To maintain a premium editorial feel, 1px solid borders are prohibited for sectioning. Boundaries must be defined solely through:
1. **Background Color Shifts:** Placing a `surface_container_low` card on a `surface` background.
2. **Tonal Transitions:** Using subtle shifts between container tiers to signify hierarchy.

### Surface Hierarchy & Nesting
Treat the UI as a layered stack. For instance, a research paper (the main content) might live on `surface_container_lowest`, while the global navigation sits on `surface`, and a floating filter panel uses a glassmorphic layer.
- **Surface Container Lowest:** The "Top-most" elevation, used for primary cards.
- **Surface Container Low:** The base for secondary grouping.
- **Surface Container High:** For emphasizing specific interactive modules.

### The "Glass & Gradient" Rule
To elevate the platform above generic tech tools:
- **Glassmorphism:** Floating elements (modals, dropdowns, hovering tooltips) must use semi-transparent surface colors with a `backdrop-blur` (e.g., 20px-40px).
- **Signature Gradients:** Use a subtle linear gradient (45-degree) transitioning from `primary` to `primary_container` for hero buttons and primary CTAs. This provides a "visual soul" that flat colors cannot mimic.

---

## 3. Typography

This design system uses a dual-font approach to balance tech-forward aesthetics with academic readability.

- **Display & Headlines (Manrope):** A geometric sans-serif that feels engineered yet accessible. Use `display-lg` for hero impact and `headline-sm` for section headers. The wide apertures of Manrope convey modernism.
- **Body & Labels (Inter):** The workhorse of the system. Inter is used for all data-heavy elements, table rows, and technical descriptions. It provides the neutral, high-legibility foundation required for complex AI benchmarks.

**Editorial Hierarchy:**
- Ensure high contrast in scale. A `display-md` headline should be significantly larger than the accompanying `body-lg` text to create a clear entry point for the user’s eye.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. Instead of a shadow, place a `surface_container_lowest` card on top of a `surface_container_low` background. The subtle shift in hex code creates a "soft lift" that feels more sophisticated than a traditional shadow.

### Ambient Shadows
When a "floating" effect is necessary (e.g., a card that has been hovered):
- **Blur:** 32px to 64px.
- **Opacity:** 4% to 8%.
- **Tint:** The shadow must not be grey. Use a tinted version of `on_surface` (`#27171a`) to mimic natural light interaction with the warm background.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., in a high-density data table):
- Use the `outline_variant` token at **15% opacity**.
- **Forbidden:** 100% opaque, high-contrast strokes.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `lg` (1rem) roundedness, and a subtle inner-glow on hover.
- **Secondary:** Transparent background with a "Ghost Border" and `primary` text.
- **Tertiary:** No border or background. Only `primary` text with a bold weight.

### Glass Cards (Visual Cards)
- **Styling:** Use `surface_container_lowest` at 60% opacity.
- **Effect:** Apply `backdrop-filter: blur(16px)`.
- **Border:** 1px Ghost Border (10% opacity) to catch the light at the edges.

### Data Inputs
- **Field Style:** Use `surface_container_low` for the input track.
- **State:** On focus, the background shifts to `surface_container_lowest` with a 2px `primary` bottom-indicator (not a full border).

### Chips & Tags
- **Academic Tags:** Use `secondary_fixed_dim` for background with `on_secondary_fixed` for text. Keep the `DEFAULT` (0.5rem) roundedness for a sharper, tech-focused look.

### Benchmarking Lists
- **Rule:** Forbid divider lines. 
- **Alternative:** Use 16px of vertical white space (using the `xl` spacing scale) between items. On hover, the entire list item should transition to a `surface_container_high` background with an `lg` (1rem) corner radius.

---

## 6. Do's and Don'ts

### Do
- **Do** prioritize white space. If you think there’s enough space, add 20% more.
- **Do** use `tertiary` (green) only for positive benchmark deltas and "success" states.
- **Do** use the `lg` (16px) radius for all major container cards to soften the data-heavy experience.

### Don't
- **Don't** use pure black (#000000) for text. Use `on_surface` to keep the palette cohesive.
- **Don't** use standard box-shadows. Stick to the Ambient Shadow guidelines to avoid a "cheap" UI look.
- **Don't** use more than one glassmorphic layer on top of another; it muddies the visual hierarchy.