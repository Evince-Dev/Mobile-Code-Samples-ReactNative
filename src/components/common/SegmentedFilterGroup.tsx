import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from '../base/AppText';
import { AppView } from '../base/AppView';
import { AppTouchableOpacity } from '../base/AppTouchableOpacity';
import { screenUtils } from '../../utils';
import { FONTS } from '../../utils/fontConstants';

export interface FilterOptionItem<T = string> {
  id: T;
  label?: string;
  labelTx?: string;
}

export interface SegmentedFilterGroupProps<T = string> {
  /** Optional section label title shown above the buttons */
  label?: string;
  /** Optional translation key for section label */
  labelTx?: string;
  /** List of option items */
  options: FilterOptionItem<T>[];
  /** Currently active selected value */
  selectedValue: T;
  /** Selection change callback handler */
  onSelect: (value: T) => void;
  /** Layout mode: 'grid2x2' (2 items per row) or 'row' (all items in 1 row) */
  layout?: 'grid2x2' | 'row';
  /** Optional container style override */
  containerStyle?: ViewStyle;
}

export function SegmentedFilterGroup<T extends string = string>({
  label,
  labelTx,
  options,
  selectedValue,
  onSelect,
  layout = 'row',
  containerStyle,
}: SegmentedFilterGroupProps<T>) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const resolvedLabel = labelTx ? t(labelTx) : label;

  // Split into pairs for 2x2 grid layout
  const renderGrid2x2 = () => {
    const row1 = options.slice(0, 2);
    const row2 = options.slice(2, 4);

    return (
      <AppView style={styles.gridContainer}>
        <AppView style={styles.row}>
          {row1.map((item) => renderButton(item))}
        </AppView>
        {row2.length > 0 && (
          <AppView style={[styles.row, { marginTop: screenUtils.scaleHeight(8) }]}>
            {row2.map((item) => renderButton(item))}
          </AppView>
        )}
      </AppView>
    );
  };

  const renderSingleRow = () => (
    <AppView style={styles.row}>
      {options.map((item) => renderButton(item))}
    </AppView>
  );

  const renderButton = (item: FilterOptionItem<T>) => {
    const isSelected = selectedValue === item.id;
    const buttonText = item.labelTx
      ? t(item.labelTx, { defaultValue: item.label || item.id })
      : item.label || item.id;

    return (
      <AppTouchableOpacity
        key={item.id}
        style={[
          styles.equalButton,
          isSelected
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.secondary },
        ]}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <AppText
          weight="medium"
          style={{
            fontSize: screenUtils.scaleFont(14),
            color: isSelected ? colors.primaryForeground : colors.foreground,
          }}
        >
          {buttonText}
        </AppText>
      </AppTouchableOpacity>
    );
  };

  return (
    <AppView style={[styles.container, containerStyle]}>
      {resolvedLabel ? (
        <AppText variant="muted" style={styles.filterLabel}>
          {resolvedLabel}
        </AppText>
      ) : null}

      {layout === 'grid2x2' ? renderGrid2x2() : renderSingleRow()}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: screenUtils.scaleHeight(12),
  },
  filterLabel: {
    fontSize: screenUtils.scaleFont(12),
    marginBottom: screenUtils.scaleHeight(6),
    fontFamily: FONTS.GEIST_MEDIUM,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: screenUtils.scaleWidth(8),
  },
  equalButton: {
    flex: 1,
    height: screenUtils.scaleHeight(40),
    borderRadius: screenUtils.scaleSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
