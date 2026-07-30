import { StyleSheet } from 'react-native';
import { screenUtils } from '../../../utils/screenUtils';
import { FONTS } from '../../../utils/fontConstants';

export const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: screenUtils.scaleHeight(8),
    marginBottom: screenUtils.scaleHeight(44),
  },
  byTag: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(11),
    textTransform: 'uppercase',
  },
  headingBlock: {
    marginBottom: screenUtils.scaleHeight(28),
  },
  heading: {
    fontSize: screenUtils.scaleFont(24),
    marginBottom: screenUtils.scaleHeight(4),
    fontFamily: FONTS.GEIST_SEMI_BOLD,
  },
  subheading: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
    lineHeight: screenUtils.scaleFont(14) * 1.4,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: screenUtils.scaleWidth(10),
    height: screenUtils.scaleHeight(48),
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    marginBottom: screenUtils.scaleHeight(20),
  },
  googleBtnText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(15),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenUtils.scaleHeight(20),
    gap: screenUtils.scaleWidth(10),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(12),
    flexShrink: 0,
  },
  form: {
    marginBottom: screenUtils.scaleHeight(4),
  },
  signInPressable: {
    marginBottom: screenUtils.scaleHeight(16),
  },
  linksBlock: {
    alignItems: 'center',
    gap: screenUtils.scaleHeight(8),
    marginBottom: screenUtils.scaleHeight(32),
  },
  linkTouch: {
    paddingVertical: 4,
  },
  forgotText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(4),
    paddingVertical: 4,
  },
  codeText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  registerText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(13),
  },
  registerLink: {
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(13),
  },
});
