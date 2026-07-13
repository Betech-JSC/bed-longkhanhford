---
name: Long Khanh Ford (Ford China Inspired Redesign)
colors:
  primary: "#066fef"       # Ford Highlight Blue (Electric Blue)
  secondary: "#01095c"     # Ford Navy/Dark Blue (used for hovers on light bg)
  accent: "#D20000"        # Bold Signal Red
  neutral-light: "#FFFFFF" # Pure White
  neutral-dark: "#000000"  # Deep Black
  bg-grey: "#F8F8F8"       # Light Grey Background
  border-light: "#E2E8F0"  # Soft Grey Borders
  border-dark: "#262626"   # Dark Grey Borders
typography:
  headline-display:
    fontFamily: FordF1-Medium
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.3
  headline-lg:
    fontFamily: FordF1-Medium
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.3
  headline-md:
    fontFamily: FordF1-Medium
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: FordF1-Regular
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: FordF1-Regular
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: FordF1-Medium
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.05em
rounded:
  none: 0px
  btn: 4px                 # Official Ford China CTA border radius
  input: 8px               # Official Ford China Input border radius
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
components:
  card-vehicle:
    backgroundColor: "{colors.neutral-light}"
    rounded: "{rounded.none}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.btn}"
    padding: 10px 24px
---

# Long Khanh Ford - Redesign Specification

## Overview
Rebuilding the frontend interface of Long Khanh Ford to mirror the premium, minimalist, and geometric design language of Ford China (https://www.ford.com.cn/). 
The core aesthetic principles are:
*   **Geometric Precision**: Sharp corners (0px) for layouts and containers, flat borders, clean grid lines, and high structural contrast.
*   **Localized Brand Tokens**: Utilizing the official Ford China Highlight Blue (`#066fef`), Navy Dark Blue (`#01095c`), and Light Grey (`#f8f8f8`).
*   **Refined Interactive Elements**: Button elements use a subtle `4px` border-radius (`rounded-[4px]`) and slide-in hover transitions. Inputs use `8px` (`rounded-[8px]`).
*   **Contrast Layering**: Switching between full-width black sections (for technology/premium focus) and clean white sections (for specifications/lineups).
*   **Clean Typography**: Utilizing the wide, modern geometry of the `FordF1` typeface family with spacious margins.
*   **Sleek Slider Indicators**: Thin horizontal slide indicators (`width: 40px`, `height: 1px`) that animate progress left-to-right.

## Colors
*   **Highlight Blue (#066fef)**: Electric blue for active navigation items, icons, and primary buttons.
*   **Navy Dark Blue (#01095c)**: Solid dark blue used as a hover color state for primary buttons.
*   **Neutral Light (#FFFFFF)**: Pure white canvas for clean readability.
*   **Neutral Dark (#000000)**: Solid pitch black for premium immersive sections.
*   **Background Grey (#F8F8F8)**: Soft light grey for section backgrounds.
*   **Border Light (#E2E8F0)**: Soft grey borders for sharp element separation.
*   **Border Dark (#262626)**: Subtle grey-dark borders for components inside dark sections.

## Typography
*   **Headline Display (40px / 48px)**: For major hero titles.
*   **Headline Large (32px / 36px)**: Section headings.
*   **Headline Medium (24px / 28px)**: Component or feature titles.
*   **Body Large (18px)**: Intro text and focal callouts.
*   **Body Medium (14px)**: Default content and specification copy.
*   **Label Medium (12px, Semibold)**: Buttons, navigation items, and secondary labels (all uppercase with wide letter-spacing).

## Layout & Spacing
*   **Spacing Grid**: Adhering strictly to an 8px grid (8px, 16px, 24px, 48px, 80px).
*   **Full-Width Layouts**: Alternating clean full-width bands (white/grey/black) with standard desktop max-width containers (`max-w-[1440px]`).
*   **Asymmetry & Grid Breaks**: High-impact text aligned on the extreme edges with large empty negative spaces.

## Elevation & Depth
*   **Flat Aesthetics**: No heavy drop shadows. Depth is created using:
    *   **Contrast Layering**: Overlapping dark/light elements.
    *   **1px Borders**: Fine line divisions (`border-[1px] border-neutral-200`).
    *   **Tonal Backgrounds**: Alternating slate/grey backgrounds for components.

## Shapes
*   **Pure Sharpness & Precise Curves**: Large layout structures, vehicle cards, and section divisions use `rounded-none`. Small interactive elements (buttons) use `rounded-[4px]`. Form inputs use `rounded-[8px]`.

## Components
*   **Navbar**: Pure white backdrop, sharp thin border, minimal uppercase navigation links, sleek slide-out sidebar for mobile.
*   **Hero Slider**: Full-viewport image/video slides. Indicator lines (`h-[1px] w-[40px] bg-white/40`) with an active state animating left-to-right (`bg-[#066fef]`).
*   **Vehicle Grid Card**: Flat white boxes with no rounded corners. Hover effect translates the vehicle image slightly upwards and transitions buttons from outlines to solid blue.
*   **Filter Tabs**: Linear tabs with an active bottom border (`border-b-2 border-[#066fef]`).
*   **Interactive Panel**: Full-width black sections featuring high-contrast text and crisp white-outlined buttons.

## Do's and Don'ts
*   **DO** use strict sharp geometric lines for structural containers.
*   **DO** use official brand colors `#066fef` (highlight blue) and `#01095c` (navy).
*   **DO** use `rounded-[4px]` for buttons.
*   **DON'T** use pill-shaped (`rounded-full`) buttons or extreme rounded (`rounded-lg`) cards.
*   **DON'T** use purple, teal, or indigo gradients.
*   **DON'T** use overused SaaS bento grids or mesh backgrounds.
