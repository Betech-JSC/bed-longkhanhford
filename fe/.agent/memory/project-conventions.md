# Project Conventions

## Layout & Containers
- **Main Wrapper**: Every section content should be wrapped in a consistent container:
  ```tsx
  className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full"
  ```
- **Page Background**: Default body background is light gray: `#F9FAFB` (Tailwind `bg-gray-50`).

## Interactive Sliders (Featured Fleet, Testimonials)
- **Autoplay Behavior**:
  - Automatically slides horizontally infinitely.
  - **Interaction Pause**: Pause autoplay immediately when a user hovers (`onMouseEnter`) or clicks a navigation button.
  - **Inactivity Resume**: Automatically resume autoplay after **5 seconds** of no user interaction.
  - **Edge-to-Edge display**: Sliders should overflow their layout naturally to the screen edge (not cropped) but text content/headings within the section must align perfectly to the main `1440px` container grid.

## Specific UI Elements (Figma Specs)
- **Hero Banner**:
  - Title/text content is aligned at the bottom of the banner.
  - Has a subtle dark gradient overlay transitioning from transparent at the top to black at the bottom (`bg-gradient-to-t from-black/60 to-transparent`).
  - Bottom Quick Actions / tabs should hug the bottom edge of the banner with no bottom padding (`pb-0`).
- **Floating Action Buttons (FAB)**:
  - Phone and Zalo buttons: Circular, size 56px (`w-14 h-14`), with custom shadows.
  - Test Drive/Registration button: Dark Navy pill-shaped design, positioned and styled exactly to match Figma layout.
