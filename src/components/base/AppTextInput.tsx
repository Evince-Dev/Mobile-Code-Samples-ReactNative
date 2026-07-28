import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from './AppText';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  labelTx?: string;
  placeholderTx?: string;
  error?: string;
  errorTx?: string;
  containerStyle?: ViewStyle;
  textInputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  labelTx,
  placeholder,
  placeholderTx,
  error,
  errorTx,
  style,
  containerStyle,
  textInputStyle,
  placeholderTextColor,
  leftIcon,
  onFocus,
  onBlur,
  ...props
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const resolvedPlaceholder = placeholderTx ? t(placeholderTx) : placeholder;
  const resolvedLabel = labelTx ? t(labelTx) : label;
  const resolvedError = errorTx ? t(errorTx) : error;
  const isMultiline = props.multiline;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputComponent = (
    <View
      style={[
        styles.inputWrapper,
        {
          backgroundColor: colors.inputBackground,
          borderColor: resolvedError
            ? colors.destructive
            : isFocused
            ? colors.primary
            : colors.border,
          borderWidth: isFocused ? 2 : 1,
        },
        isMultiline && styles.multilineInputWrapper,
        style,
      ]}
    >
      {leftIcon ? <View style={[styles.leftIconContainer, isMultiline && { marginTop: 4 }]}>{leftIcon}</View> : null}
      <TextInput
        style={[
          styles.input,
          {
            color: colors.foreground,
          },
          isMultiline && styles.multilineInput,
          textInputStyle,
        ]}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={placeholderTextColor || colors.textMuted}
        textAlignVertical={isMultiline ? 'top' : props.textAlignVertical}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </View>
  );

  if (!resolvedLabel && !resolvedError && !containerStyle) {
    return inputComponent;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {resolvedLabel ? (
        <AppText style={styles.label} weight="medium" variant="muted">
          {resolvedLabel}
        </AppText>
      ) : null}
      {inputComponent}
      {resolvedError ? (
        <AppText style={[styles.error, { color: colors.destructive }]} variant="caption">
          {resolvedError}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
  },
  multilineInputWrapper: {
    height: 'auto',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  leftIconContainer: {
    marginRight: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: typography.fonts.GEIST_REGULAR,
    fontSize: 16,
    paddingVertical: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  error: {
    marginTop: spacing.xs,
  },
});
