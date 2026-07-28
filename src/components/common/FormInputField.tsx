import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText, AppView, AppTouchableOpacity } from '../base';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { screenUtils } from '../../utils/screenUtils';
import { EyeOpenIcon, EyeClosedIcon } from '../icons';

export interface FormInputFieldProps extends TextInputProps {
  label?: string;
  labelTx?: string;
  placeholderTx?: string;
  error?: string;
  errorTx?: string;
  showPasswordToggle?: boolean;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  labelTx,
  placeholder,
  placeholderTx,
  error,
  errorTx,
  style,
  showPasswordToggle = false,
  secureTextEntry,
  placeholderTextColor,
  onFocus,
  onBlur,
  ...props
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const resolvedPlaceholder = placeholderTx ? t(placeholderTx) : placeholder;
  const resolvedLabel = labelTx ? t(labelTx) : label;
  const resolvedError = errorTx ? t(errorTx) : error;

  const isSecure = secureTextEntry && !passwordVisible;

  return (
    <AppView style={styles.container}>
      {resolvedLabel ? (
        <AppText style={styles.label} weight="medium" color={colors.foreground}>
          {resolvedLabel}
        </AppText>
      ) : null}

      <AppView
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: resolvedError
              ? colors.destructive
              : isFocused
              ? colors.primary
              : colors.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.foreground,
              fontFamily: typography.fonts.GEIST_REGULAR,
            },
            style,
          ]}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={placeholderTextColor || colors.textMuted}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {showPasswordToggle ? (
          <AppTouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setPasswordVisible((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            {passwordVisible ? (
              <EyeOpenIcon width={20} height={20} color={colors.textMuted} />
            ) : (
              <EyeClosedIcon width={20} height={20} color={colors.textMuted} />
            )}
          </AppTouchableOpacity>
        ) : null}
      </AppView>

      {resolvedError ? (
        <AppText style={styles.errorText} variant="caption" color={colors.destructive}>
          {resolvedError}
        </AppText>
      ) : null}
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: screenUtils.scaleHeight(16),
    width: '100%',
  },
  label: {
    fontSize: screenUtils.scaleFont(14),
    marginBottom: screenUtils.scaleHeight(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: screenUtils.scaleHeight(52),
    borderWidth: 1,
    borderRadius: screenUtils.scaleSize(12),
    paddingHorizontal: screenUtils.scaleWidth(16),
  },
  input: {
    flex: 1,
    fontSize: screenUtils.scaleFont(15),
    paddingVertical: 0,
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  eyeBtn: {
    paddingLeft: screenUtils.scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: screenUtils.scaleHeight(4),
    fontSize: screenUtils.scaleFont(12),
  },
});
