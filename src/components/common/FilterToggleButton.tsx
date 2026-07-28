import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from '../base/AppText';
import { AppTouchableOpacity } from '../base/AppTouchableOpacity';
import { FilterIcon, ChevronDownIcon } from '../icons';
import { screenUtils } from '../../utils';

export interface FilterToggleButtonProps {
  /** Indicates whether the collapsible filter panel is open */
  isOpen: boolean;
  /** Toggle handler */
  onPress: () => void;
  /** Optional translation key for button label */
  labelTx?: string;
  /** Optional label fallback text */
  label?: string;
  /** Custom container style */
  style?: ViewStyle;
}

export const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({
  isOpen,
  onPress,
  labelTx = 'transactions.filters',
  label = 'Filters',
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const resolvedLabel = labelTx ? t(labelTx, { defaultValue: label }) : label;

  return (
    <AppTouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: colors.secondary,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FilterIcon
        width={screenUtils.scaleSize(16)}
        height={screenUtils.scaleSize(16)}
        color={colors.foreground}
      />
      <AppText
        weight="medium"
        style={[
          styles.filterButtonText,
          { color: colors.foreground },
        ]}
      >
        {resolvedLabel}
      </AppText>
      <ChevronDownIcon
        width={screenUtils.scaleSize(14)}
        height={screenUtils.scaleSize(14)}
        color={colors.foreground}
        style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
      />
    </AppTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: screenUtils.scaleWidth(12),
    paddingVertical: screenUtils.scaleHeight(8),
    borderRadius: screenUtils.scaleSize(8),
    gap: screenUtils.scaleWidth(6),
  },
  filterButtonText: {
    fontSize: screenUtils.scaleFont(13),
  },
});
