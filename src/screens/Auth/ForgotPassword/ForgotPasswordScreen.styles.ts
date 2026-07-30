import { StyleSheet } from 'react-native';
import { screenUtils } from '../../../utils/screenUtils';
import { FONTS } from '../../../utils/fontConstants';

export const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(6),
    marginBottom: screenUtils.scaleHeight(44),
    paddingVertical: 4,
  },
  backText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },
  contentBlock: {
    width: '100%',
  },
  lockIconContainer: {
    width: screenUtils.scaleSize(48),
    height: screenUtils.scaleSize(48),
    borderRadius: screenUtils.scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(16),
    marginTop: screenUtils.scaleHeight(16),
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
  form: {
    marginBottom: screenUtils.scaleHeight(8),
  },
  submitBtn: {
    marginTop: screenUtils.scaleHeight(8),
  },
  sentContentBlock: {
    width: '100%',
    alignItems: 'center',
  },
  mailIconContainer: {
    width: screenUtils.scaleSize(64),
    height: screenUtils.scaleSize(64),
    borderRadius: screenUtils.scaleSize(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(20),
    marginTop: screenUtils.scaleHeight(40),
  },
  sentHeaderBlock: {
    alignItems: 'center',
    marginBottom: screenUtils.scaleHeight(24),
  },
  sentHeading: {
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(24),
    textAlign: 'center',
    marginBottom: screenUtils.scaleHeight(8),
  },
  sentSubheading: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
    textAlign: 'center',
    lineHeight: screenUtils.scaleFont(14) * 1.5,
  },
  sentEmailText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
  },
  calloutCard: {
    width: '100%',
    borderRadius: screenUtils.scaleSize(14),
    padding: screenUtils.scaleSize(16),
    marginBottom: screenUtils.scaleHeight(24),
    marginTop: screenUtils.scaleHeight(24),
  },
  calloutText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(13),
    textAlign: 'center',
    lineHeight: screenUtils.scaleFont(13) * 1.5,
  },
  tryAgainText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(13),
  },
});
