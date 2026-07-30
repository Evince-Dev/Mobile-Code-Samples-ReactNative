import { StyleSheet } from 'react-native';
import { screenUtils } from '../../../utils/screenUtils';
import { FONTS } from '../../../utils/fontConstants';

export const styles = StyleSheet.create({
  container: {
    gap: screenUtils.scaleHeight(20),
  },
  headingBlock: {
    marginBottom: screenUtils.scaleHeight(4),
  },
  userCard: {
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    padding: screenUtils.scaleSize(16),
    gap: screenUtils.scaleHeight(12),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(8),
    marginBottom: screenUtils.scaleHeight(4),
  },
  statusDot: {
    width: screenUtils.scaleSize(10),
    height: screenUtils.scaleSize(10),
    borderRadius: screenUtils.scaleSize(5),
  },
  statusText: {
    fontSize: screenUtils.scaleFont(15),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: screenUtils.scaleHeight(4),
  },
  label: {
    fontSize: screenUtils.scaleFont(13),
  },
  value: {
    fontSize: screenUtils.scaleFont(14),
    fontFamily: FONTS.GEIST_MEDIUM,
  },
  infoCard: {
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    padding: screenUtils.scaleSize(16),
    gap: screenUtils.scaleHeight(8),
  },
  infoTitle: {
    fontSize: screenUtils.scaleFont(15),
  },
  infoBody: {
    fontSize: screenUtils.scaleFont(13),
    lineHeight: screenUtils.scaleFont(13) * 1.45,
  },
  logoutBtn: {
    marginTop: screenUtils.scaleHeight(8),
  },
});
