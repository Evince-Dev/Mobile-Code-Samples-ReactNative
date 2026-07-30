import { StyleSheet } from 'react-native';
import { screenUtils } from '../../../utils/screenUtils';
import { FONTS } from '../../../utils/fontConstants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: screenUtils.scaleWidth(32),
    width: '100%',
  },
  accentBar: {
    height: screenUtils.scaleSize(4),
    borderRadius: 9999,
    marginBottom: screenUtils.scaleHeight(28),
  },
  logoContainer: {
    marginBottom: screenUtils.scaleHeight(10),
  },
  climbText: {
    fontFamily: FONTS.GEIST_BOLD,
    fontSize: screenUtils.scaleFont(48),
    fontWeight: '400',
    letterSpacing: -1.5,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkText: {
    fontFamily: FONTS.GEIST_BOLD,
    fontSize: screenUtils.scaleFont(48),
    fontWeight: '400',
  },
  tagline: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(13),
    fontWeight: '400',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    gap: screenUtils.scaleSize(6),
    paddingBottom: screenUtils.scaleHeight(40),
    alignItems: 'center',
  },
  footerDot: {
    width: screenUtils.scaleSize(6),
    height: screenUtils.scaleSize(6),
    borderRadius: 9999,
  },
});
