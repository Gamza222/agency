/**
 * Navbar Constants
 * Centralized configuration for navbar animations, timings, and content
 */

export const NAVBAR_ANIMATION = {
  BRAND_FADE_DURATION: 0.2, // seconds - faster brand appearance
  DIVIDER_FADE_DURATION: 0.15, // seconds - faster divider appearance
  DIVIDER_DELAY: 0.08, // seconds between each divider - faster cascading
  FLICKER_DURATION: 0.2, // seconds per flicker cycle - faster flickering
  FLICKER_COUNT: 2, // number of flickers
  HAMBURGER_DELAY: 0.2, // seconds - starts after brand loads
  MOBILE_LINKS_SLIDE_DURATION: 1, // seconds - slide animation duration
} as const;

export const NAVBAR_BREAKPOINTS = {
  MOBILE_MAX: 768, // pixels
} as const;

export const NAVBAR_LINKS = [
  { label: "home", href: "/" },
  { label: "works", href: "/works" },
  { label: "trial", href: "/trial" },
  { label: "contact", href: "/contact" },
] as const;

export const NAVBAR_STYLING = {
  Z_INDEX: 10000,
  BRAND_TEXT: "THE WARP",
} as const;
