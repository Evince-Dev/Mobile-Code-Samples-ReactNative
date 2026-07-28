/**
 * Font Constants
 * Centralized font family references
 * Geist font family - Full font names
 */

export const FONTS = {
  // Geist font family - Unified names
  GEIST_THIN: 'Geist-Thin',
  GEIST_THIN_ITALIC: 'Geist-ThinItalic',
  GEIST_EXTRA_LIGHT: 'Geist-ExtraLight',
  GEIST_EXTRA_LIGHT_ITALIC: 'Geist-ExtraLightItalic',
  GEIST_LIGHT: 'Geist-Light',
  GEIST_LIGHT_ITALIC: 'Geist-LightItalic',
  GEIST_REGULAR: 'Geist-Regular',
  GEIST_ITALIC: 'Geist-Italic',
  GEIST_MEDIUM: 'Geist-Medium',
  GEIST_MEDIUM_ITALIC: 'Geist-MediumItalic',
  GEIST_SEMI_BOLD: 'Geist-SemiBold',
  GEIST_SEMI_BOLD_ITALIC: 'Geist-SemiBoldItalic',
  GEIST_BOLD: 'Geist-Bold',
  GEIST_BOLD_ITALIC: 'Geist-BoldItalic',
  GEIST_EXTRA_BOLD: 'Geist-ExtraBold',
  GEIST_EXTRA_BOLD_ITALIC: 'Geist-ExtraBoldItalic',
  GEIST_BLACK: 'Geist-Black',
  GEIST_BLACK_ITALIC: 'Geist-BlackItalic',
} as const;

// Font weights mapping
// Since we are using specific font files (e.g. Geist-Bold.ttf) that already contain the weight,
// we set fontWeight to '400' (Normal) when applying specific font family to avoid double-weighting.
export const FONT_WEIGHTS = {
  THIN: '400',
  EXTRA_LIGHT: '400',
  LIGHT: '400',
  REGULAR: '400',
  MEDIUM: '400',
  SEMI_BOLD: '400',
  BOLD: '400',
  EXTRA_BOLD: '400',
  BLACK: '400',
} as const;

// Font sizes (in pixels)
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
} as const;

// Line heights (as percentage or pixels)
export const LINE_HEIGHTS = {
  TIGHT: 1.25, // 125%
  NORMAL: 1.5, // 150%
  RELAXED: 1.75,
} as const;
