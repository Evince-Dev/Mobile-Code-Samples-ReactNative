import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from '../base/AppText';
import { AppView } from '../base/AppView';
import { AppTouchableOpacity } from '../base/AppTouchableOpacity';
import { AppButton } from '../base/AppButton';
import { ChevronDownIcon, CheckIcon } from '../icons';
import { BottomSheet } from './BottomSheet';
import { screenUtils } from '../../utils';
import { FONTS } from '../../utils/fontConstants';

export interface SelectorOption {
  label: string;
  value: string;
}

export interface SelectorProps {
  /** Optional field label shown above the input box */
  label?: string;
  /** Optional translation key for field label */
  labelTx?: string;
  /** Placeholder text when no item is selected */
  placeholder?: string;
  /** Translation key for placeholder */
  placeholderTx?: string;
  /** BottomSheet drawer title */
  title?: string;
  /** Translation key for BottomSheet drawer title */
  titleTx?: string;
  /** Array of options (strings or objects with label and value) */
  options: (string | SelectorOption)[];
  /** Currently selected value (string for single select, string[] for multi select) */
  value: string | string[];
  /** Selection callback handler */
  onSelect: (selected: any) => void;
  /** When true, enables multiple selections with checkmark toggles and Done button */
  isMultiSelect?: boolean;
  /** Optional container style override */
  containerStyle?: any;
  /** Optional disabled state */
  disabled?: boolean;
}

export const Selector: React.FC<SelectorProps> = ({
  label,
  labelTx,
  placeholder = 'Select an option',
  placeholderTx,
  title,
  titleTx,
  options,
  value,
  onSelect,
  isMultiSelect = false,
  containerStyle,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Normalize string array or SelectorOption array
  const normalizedOptions: SelectorOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  // Resolved localized strings
  const resolvedLabel = labelTx ? t(labelTx) : label;
  const resolvedPlaceholder = placeholderTx ? t(placeholderTx) : placeholder;
  const resolvedTitle = titleTx
    ? t(titleTx)
    : title || resolvedLabel || t('common.select', { defaultValue: 'Select' });

  // Multi select temporary selection state
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && isMultiSelect) {
      setTempSelected(Array.isArray(value) ? [...value] : value ? [value] : []);
    }
  }, [isOpen, isMultiSelect, value]);

  // Compute display text for the trigger box
  const getDisplayText = () => {
    if (isMultiSelect) {
      const selectedArr = Array.isArray(value) ? value : [];
      if (selectedArr.length === 0) return resolvedPlaceholder;
      const labels = normalizedOptions
        .filter((opt) => selectedArr.includes(opt.value))
        .map((opt) => opt.label);
      if (labels.length <= 2) return labels.join(', ');
      return `${labels.length} ${t('common.selected', { defaultValue: 'selected' })}`;
    } else {
      const singleValue = typeof value === 'string' ? value : '';
      const matched = normalizedOptions.find((opt) => opt.value === singleValue);
      return matched ? matched.label : resolvedPlaceholder;
    }
  };

  const handleOptionPress = (optionValue: string) => {
    if (isMultiSelect) {
      if (tempSelected.includes(optionValue)) {
        setTempSelected(tempSelected.filter((v) => v !== optionValue));
      } else {
        setTempSelected([...tempSelected, optionValue]);
      }
    } else {
      onSelect(optionValue);
      setIsOpen(false);
    }
  };

  const handleApplyMultiSelect = () => {
    onSelect(tempSelected);
    setIsOpen(false);
  };

  const isSelected = (optionValue: string) => {
    if (isMultiSelect) {
      return tempSelected.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <AppView style={[styles.container, containerStyle]}>
      {resolvedLabel ? (
        <AppText variant="muted" style={styles.label}>
          {resolvedLabel}
        </AppText>
      ) : null}

      <AppTouchableOpacity
        style={[
          styles.triggerBox,
          {
            backgroundColor: colors.card,
            borderColor: isOpen ? colors.primary : colors.border,
            borderWidth: isOpen ? 2 : 1,
          },
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <AppText
          weight="medium"
          style={[
            styles.valueText,
            { color: value ? colors.foreground : colors.textMuted },
          ]}
          numberOfLines={1}
        >
          {getDisplayText()}
        </AppText>
        <ChevronDownIcon
          width={screenUtils.scaleSize(16)}
          height={screenUtils.scaleSize(16)}
          color={colors.foreground}
        />
      </AppTouchableOpacity>

      {/* Integrated BottomSheet Drawer */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={resolvedTitle}
      >
        <AppView style={styles.optionsList}>
          {normalizedOptions.map((opt) => {
            const active = isSelected(opt.value);
            return (
              <AppTouchableOpacity
                key={opt.value}
                style={[
                  styles.optionRow,
                  { borderBottomColor: colors.border },
                  active && { backgroundColor: `${colors.primary}10` },
                ]}
                onPress={() => handleOptionPress(opt.value)}
                activeOpacity={0.7}
              >
                <AppText
                  weight={active ? 'bold' : 'regular'}
                  style={[
                    styles.optionText,
                    { color: active ? colors.primary : colors.foreground },
                  ]}
                >
                  {opt.label}
                </AppText>

                {active && (
                  <AppView
                    style={[
                      styles.checkBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <CheckIcon
                      width={screenUtils.scaleSize(14)}
                      height={screenUtils.scaleSize(14)}
                      color={colors.primaryForeground}
                      strokeWidth={2.5}
                    />
                  </AppView>
                )}
              </AppTouchableOpacity>
            );
          })}
        </AppView>

        {isMultiSelect && (
          <AppView style={styles.actionContainer}>
            <AppButton
              title={t('common.done', { defaultValue: 'Done' })}
              onPress={handleApplyMultiSelect}
            />
          </AppView>
        )}
      </BottomSheet>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: screenUtils.scaleHeight(10),
  },
  label: {
    fontSize: screenUtils.scaleFont(12),
    marginBottom: screenUtils.scaleHeight(6),
    fontFamily: FONTS.GEIST_MEDIUM,
  },
  triggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenUtils.scaleWidth(14),
    height: screenUtils.scaleHeight(40),
    borderRadius: screenUtils.scaleSize(8),
  },
  valueText: {
    fontSize: screenUtils.scaleFont(14),
    flex: 1,
    marginRight: screenUtils.scaleWidth(8),
  },
  optionsList: {
    marginVertical: screenUtils.scaleHeight(8),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenUtils.scaleWidth(16),
    paddingVertical: screenUtils.scaleHeight(14),
    borderRadius: screenUtils.scaleSize(8),
    marginBottom: screenUtils.scaleHeight(4),
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: screenUtils.scaleFont(15),
  },
  checkBadge: {
    width: screenUtils.scaleSize(22),
    height: screenUtils.scaleSize(22),
    borderRadius: screenUtils.scaleSize(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    marginTop: screenUtils.scaleHeight(16),
    paddingHorizontal: screenUtils.scaleWidth(4),
  },
});
