import React, { useState, useRef, useEffect } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle, StyleProp, TextStyle, Platform, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from './AppText';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { KeyboardAccessoryToolbar, registerInput } from '../common/KeyboardAccessoryToolbar';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  labelTx?: string;
  placeholderTx?: string;
  error?: string;
  errorTx?: string;
  containerStyle?: ViewStyle;
  textInputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppTextInput = React.forwardRef<TextInput, AppTextInputProps>(
  (
    {
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
      rightIcon,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const fallbackRef = useRef<TextInput>(null);
    const localRef = (ref as React.RefObject<TextInput | null>) || fallbackRef;

    const accessoryId = useRef('app_acc_' + Math.random().toString(36).substring(2, 9)).current;

    const propsRef = useRef({ ...props, onFocus, onBlur });
    propsRef.current = { ...props, onFocus, onBlur };

    let routeName = 'default';
    try {
      const route = useRoute();
      if (route && route.name) {
        routeName = route.name;
      }
    } catch {
      // Context not available
    }

    useEffect(() => {
      return registerInput(routeName, localRef, () => ({
        ...propsRef.current,
        returnKeyType: propsRef.current.returnKeyType || 'done',
      }));
    }, [routeName, localRef]);

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

    const handleWrapperPress = () => {
      localRef.current?.focus();
    };

    const inputComponent = (
      <Pressable
        onPress={handleWrapperPress}
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
        {leftIcon ? (
          <View style={[styles.leftIconContainer, isMultiline && { marginTop: 4 }]}>
            {leftIcon}
          </View>
        ) : null}
        <TextInput
          ref={localRef}
          inputAccessoryViewID={Platform.OS === 'ios' ? accessoryId : undefined}
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
        {rightIcon ? (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        ) : null}
        {Platform.OS === 'ios' && (
          <KeyboardAccessoryToolbar
            nativeID={accessoryId}
            inputRef={localRef}
            routeName={routeName}
          />
        )}
      </Pressable>
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
  }
);

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
  rightIconContainer: {
    marginLeft: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
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
