import { StyleSheet } from 'react-native';
import { screenUtils } from '../../../utils/screenUtils';
import { FONTS } from '../../../utils/fontConstants';

export const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(6),
    marginBottom: screenUtils.scaleHeight(36),
    paddingVertical: 4,
  },
  backText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },
  contentBlock: {
    width: '100%',
  },
  boxStyle: {
    marginHorizontal: screenUtils.scaleWidth(6),
  },
  mailIconContainer: {
    width: screenUtils.scaleSize(48),
    height: screenUtils.scaleSize(48),
    borderRadius: screenUtils.scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(16),
  },
  headingBlock: {
    marginBottom: screenUtils.scaleHeight(24),
  },
  heading: {
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(24),
    marginBottom: screenUtils.scaleHeight(6),
  },
  subheading: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
    lineHeight: screenUtils.scaleFont(14) * 1.4,
  },
  emailText: {
    fontFamily: FONTS.GEIST_MEDIUM,
  },
  form: {
    marginBottom: screenUtils.scaleHeight(8),
  },
  otpWrapper: {
    marginBottom: screenUtils.scaleHeight(24),
  },
  errorText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(13),
    textAlign: 'center',
    marginTop: screenUtils.scaleHeight(12),
  },
  actionBtn: {
    marginTop: screenUtils.scaleHeight(8),
  },
  resendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenUtils.scaleHeight(16),
    marginTop: screenUtils.scaleHeight(8),
  },
  resendText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },
});
