import { FONTS, FONT_SIZES, FONT_WEIGHTS } from '../utils/fontConstants';

export const typography = {
  fonts: FONTS,
  sizes: {
    xs: FONT_SIZES.XS,
    sm: FONT_SIZES.SM,
    md: FONT_SIZES.BASE,
    lg: FONT_SIZES.LG,
    xl: FONT_SIZES.XL,
    xxl: FONT_SIZES.XXL,
    heading: FONT_SIZES.XXXL,
    display: 36,
  },
  weights: {
    thin: { fontFamily: FONTS.GEIST_THIN },
    extralight: { fontFamily: FONTS.GEIST_EXTRA_LIGHT },
    light: { fontFamily: FONTS.GEIST_LIGHT },
    regular: { fontFamily: FONTS.GEIST_REGULAR },
    medium: { fontFamily: FONTS.GEIST_MEDIUM },
    semibold: { fontFamily: FONTS.GEIST_SEMI_BOLD },
    bold: { fontFamily: FONTS.GEIST_BOLD },
    extrabold: { fontFamily: FONTS.GEIST_EXTRA_BOLD },
    black: { fontFamily: FONTS.GEIST_BLACK },
  },
};
