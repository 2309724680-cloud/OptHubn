```markdown
# Design System Specification: The Elevated Mobile Experience

## 1. Overview & Creative North Star: "The Architectural Whisper"
This design system rejects the "cookie-cutter" mobile aesthetic in favor of **The Architectural Whisper**. Our North Star is a philosophy of quiet confidence—where the UI does not demand attention through loud borders or aggressive shadows, but rather through impeccable spatial relationships, tonal depth, and editorial-grade typography. 

By moving away from standard grid-bound containers and embracing intentional white space and "glass" layering, we create a digital environment that feels premium, bespoke, and profoundly user-friendly. We do not "box" content; we "anchor" it.

---

## 2. Colors & Tonal Logic
Our palette is rooted in a professional deep blue (`primary`) and a sophisticated slate (`secondary`), balanced against a multi-tiered surface system.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections or containers. 
Structure must be achieved through:
- **Tonal Shifts:** Placing a `surface_container_low` (`#f2f4f6`) element against a `surface` (`#f7f9fb`) background.
- **Negative Space:** Using generous padding to define the start and end of content blocks.

### Surface Hierarchy & Nesting
Treat the mobile screen as a physical workspace with stacked layers. Use the following hierarchy to define depth:
- **Base Layer:** `surface` (`#f7f9fb`)
- **Secondary Sectioning:** `surface_container_low` (`#f2f4f6`)
- **Interactive Cards:** `surface_container_lowest` (`#ffffff`) — This creates a "lifted" look without needing a shadow.
- **High-Priority Modals:** `surface_bright` (`#f7f9fb`) with `glassmorphism` effects.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for navigation bars and floating action buttons:
- **Material:** Background color of `surface` at 80% opacity with a `20px` backdrop blur.
- **Soul Gradients:** Main CTAs should not be flat. Apply a subtle linear gradient from `primary` (`#004ac6`) to `primary_container` (`#2563eb`) at a 135-degree angle to provide a sense of illumination and "liquid" depth.

---

## 3. Typography: Editorial Authority
We pair the geometric precision of **Manrope** for high-impact display with the functional clarity of **Inter** for utility and body text.

| Level | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Manrope | 3.5rem | High-impact hero moments; asymmetric placement. |
| **Headline-MD** | Manrope | 1.75rem | Section headers; tight tracking (-0.02em). |
| **Title-SM** | Inter | 1.0rem | Semi-bold; used for card headings and navigation. |
| **Body-MD** | Inter | 0.875rem | Standard reading; 1.5 line-height for breathability. |
| **Label-SM** | Inter | 0.6875rem | Uppercase; 0.05em letter spacing for "utility" feel. |

---

## 4. Elevation & Depth: The Layering Principle
We move beyond the "Drop Shadow" era. Our depth is environmental, not artificial.

- **Ambient Shadows:** When an element must float (e.g., a bottom sheet), use an "Ambient Shadow."
  - *Setting:* `Y: 8px, Blur: 24px, Spread: -4px`.
  - *Color:* Use `on_surface` (`#191c1e`) at **4% to 6% opacity**. It should be felt, not seen.
- **The "Ghost Border" Fallback:** If a container lacks sufficient contrast against a background, use a "Ghost Border": `outline_variant` (`#c3c6d7`) at **15% opacity**. Never 100%.
- **Tonal Layering:** The primary method of elevation. A `surface_container_highest` (`#e0e3e5`) header floating over a `surface` background creates an immediate, sophisticated hierarchy through value alone.

---

## 5. Component Logic

### Buttons (The Interaction Pillars)
- **Primary:** Gradient from `primary` to `primary_container`. Corner radius: `md` (`0.75rem`). Text: `on_primary` (`#ffffff`).
- **Secondary:** Surface-colored (`surface_container_lowest`) with a "Ghost Border."
- **Tertiary/Ghost:** No container. Uses `primary` text for "low-weight" actions like "Cancel" or "Skip."

### Cards & Lists (The "Anti-Divider" Pattern)
- **Rule:** Never use a horizontal line to separate list items. 
- **Implementation:** Use `16px` of vertical white space or alternate subtle background tints (e.g., item 1 on `surface`, item 2 on `surface_container_low`).
- **Radius:** All cards must use `lg` (`1rem`) corner radius to maintain the "Soft Minimalism" feel.

### Input Fields (The Professional Slate)
- **Container:** `surface_container_low`. 
- **State:** On focus, the container shifts to `surface_container_lowest` and gains a 1px "Ghost Border" using `primary`.
- **Labels:** Use `label-md` in `on_surface_variant` for a muted, professional context.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use asymmetric layouts. Place a `headline-lg` off-center to create visual interest.
- **Do** use `primary_fixed_dim` for subtle background highlights behind icons.
- **Do** prioritize "Breathing Room." If in doubt, add `8px` of extra padding.

### Don’t:
- **Don’t** use pure black (`#000000`) for text. Always use `on_surface` (`#191c1e`) for a softer, more premium contrast.
- **Don’t** use standard `0.5rem` (default) rounding for everything. Use the `xl` (`1.5rem`) scale for large containers to emphasize the "Modern" request.
- **Don’t** use "Alert Red" for everything. Use `tertiary` (`#943700`) for non-critical warnings to maintain the sophisticated color story.

---

## 7. Signature Tokens Recap
- **Base Roundness:** `0.75rem` (md)
- **High-Impact Roundness:** `1.5rem` (xl)
- **Shadow Tint:** `#191c1e` at 6% opacity
- **Glass Blur:** `20px` backdrop-filter```