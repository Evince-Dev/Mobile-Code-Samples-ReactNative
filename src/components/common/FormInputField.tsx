import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { AppTextInput, AppTextInputProps } from '../base/AppTextInput';
import { AppTouchableOpacity } from '../base';
import { EyeOpenIcon, EyeClosedIcon } from '../icons';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../theme/spacing';

export interface FormInputFieldProps extends AppTextInputProps {
  showPasswordToggle?: boolean;
}

export const FormInputField = React.forwardRef<TextInput, FormInputFieldProps>(
  (
    {
      showPasswordToggle = false,
      secureTextEntry,
      rightIcon,
      containerStyle,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isSecure = secureTextEntry && !passwordVisible;

    let displayedRightIcon = rightIcon;
    if (showPasswordToggle && !rightIcon) {
      displayedRightIcon = (
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
      );
    }

    return (
      <AppTextInput
        ref={ref}
        secureTextEntry={isSecure}
        rightIcon={displayedRightIcon}
        containerStyle={containerStyle}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  eyeBtn: {
    paddingLeft: spacing.xs,
  },
});
