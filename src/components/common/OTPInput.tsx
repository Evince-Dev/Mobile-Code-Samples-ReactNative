/**
 * OTPInput Component
 * Reusable OTP input component with paste support and auto-focus
 */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TextInput, TextStyle, ViewStyle } from 'react-native';
import { AppView } from '../base/AppView';
import { useTheme } from '../../contexts/ThemeContext';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';

export interface OTPInputProps {
  codeLength?: number;
  onCodeFilled?: (code: string) => void;
  onCodeChanged?: (code: string) => void;
  boxStyle?: ViewStyle;
  focusedBoxStyle?: ViewStyle;
  filledBoxStyle?: ViewStyle;
  errorBoxStyle?: ViewStyle;
  textStyle?: TextStyle;
  secureEntry?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  hasError?: boolean;
  containerStyle?: ViewStyle;
}

type InputSource = 'manual' | 'autofill' | 'paste';

export interface OTPInputRef {
  clear: () => void;
  focus: () => void;
  getCode: () => string;
  setCode: (code: string) => void;
}

export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      codeLength = 6,
      onCodeFilled,
      onCodeChanged,
      boxStyle,
      focusedBoxStyle,
      filledBoxStyle,
      errorBoxStyle,
      textStyle,
      secureEntry = false,
      autoFocus = true,
      editable = true,
      hasError = false,
      containerStyle,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const setInputRef = (inputRef: TextInput | null, index: number) => {
      inputRefs.current[index] = inputRef;
    };

    useEffect(() => {
      if (autoFocus) {
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
            clearInterval(interval);
          } else if (++attempts > maxAttempts) {
            clearInterval(interval);
          }
        }, 50);
        return () => clearInterval(interval);
      }
    }, [autoFocus, codeLength]);

    const handleCodeChange = (newCode: string[], source: InputSource) => {
      const codeString = newCode.join('');
      onCodeChanged?.(codeString);

      if (codeString.length === codeLength && source === 'manual') {
        onCodeFilled?.(codeString);
      }
    };

    const handlePasteCode = (pastedCode: string, source: InputSource) => {
      const digits = pastedCode
        .replace(/\D/g, '')
        .slice(0, codeLength)
        .split('');
      const newCode = [
        ...digits,
        ...Array(Math.max(0, codeLength - digits.length)).fill(''),
      ];

      setCode(newCode);
      handleCodeChange(newCode, source);

      const nextIndex = Math.min(digits.length, codeLength - 1);
      inputRefs.current[nextIndex]?.focus();
    };

    const handleInputChange = (text: string, index: number) => {
      const filteredText = text.replace(/\D/g, '');

      if (filteredText.length > 1) {
        handlePasteCode(filteredText, 'paste');
        return;
      }

      if (filteredText.length === 1) {
        const newCode = [...code];

        let firstEmptyIndex = -1;
        for (let i = 0; i < codeLength; i++) {
          if (newCode[i] === '') {
            firstEmptyIndex = i;
            break;
          }
        }

        if (firstEmptyIndex === index) {
          newCode[index] = filteredText[0];
          setCode(newCode);
          handleCodeChange(newCode, 'manual');

          if (index < codeLength - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        } else if (firstEmptyIndex !== -1) {
          newCode[firstEmptyIndex] = filteredText[0];
          setCode(newCode);
          handleCodeChange(newCode, 'manual');

          if (firstEmptyIndex < codeLength - 1) {
            inputRefs.current[firstEmptyIndex + 1]?.focus();
          }
        }
      } else if (filteredText.length === 0) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        handleCodeChange(newCode, 'manual');

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    };

    const handleKeyPress = (key: string, index: number) => {
      if (key === 'Backspace') {
        if (code[index]) {
          const newCode = [...code];
          newCode[index] = '';
          setCode(newCode);
          handleCodeChange(newCode, 'manual');
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    };

    const handleFocus = (index: number) => {
      setFocusedIndex(index);
      if (code[index]) {
        setTimeout(() => {
          inputRefs.current[index]?.setSelection(0, 1);
        }, 100);
      }
    };

    const handleBlur = () => {
      setFocusedIndex(-1);
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        const newCode = Array(codeLength).fill('');
        setCode(newCode);
        handleCodeChange(newCode, 'manual');
        inputRefs.current[0]?.focus();
      },
      setCode: (newCode: string) => {
        const digits = newCode
          .replace(/\D/g, '')
          .slice(0, codeLength)
          .split('');
        const filledCode = [
          ...digits,
          ...Array(Math.max(0, codeLength - digits.length)).fill(''),
        ];
        setCode(filledCode);
        handleCodeChange(filledCode, 'autofill');
      },
      focus: () => {
        let firstEmptyIndex = -1;
        for (let i = 0; i < codeLength; i++) {
          if (code[i] === '') {
            firstEmptyIndex = i;
            break;
          }
        }
        inputRefs.current[firstEmptyIndex > 0 ? firstEmptyIndex : 0]?.focus();
      },
      getCode: () => {
        return code.join('');
      },
    }));

    return (
      <AppView style={[styles.container, containerStyle]}>
        <AppView style={styles.inputContainer}>
          {Array.from({ length: codeLength }, (_, index) => {
            const isFilled = !!code[index];
            const isFocused = focusedIndex === index;

            return (
              <AppView
                key={index}
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: colors.card,
                    borderColor: hasError
                      ? colors.destructive
                      : isFocused
                      ? colors.primary
                      : isFilled
                      ? colors.primary
                      : colors.border,
                  },
                  boxStyle,
                  isFilled && filledBoxStyle,
                  isFocused && focusedBoxStyle,
                  hasError && errorBoxStyle,
                ]}
              >
                <TextInput
                  ref={inputRef => setInputRef(inputRef, index)}
                  style={[
                    styles.input,
                    { color: hasError ? colors.destructive : colors.foreground },
                    textStyle,
                  ]}
                  value={secureEntry ? (code[index] ? '●' : '') : code[index]}
                  onChangeText={text => handleInputChange(text, index)}
                  onKeyPress={({ nativeEvent: { key } }) =>
                    handleKeyPress(key, index)
                  }
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  editable={editable}
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                  autoCapitalize="none"
                  importantForAutofill="yes"
                  selectionColor={colors.primary}
                />
              </AppView>
            );
          })}
        </AppView>
      </AppView>
    );
  },
);

OTPInput.displayName = 'OTPInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: screenUtils.scaleWidth(8),
    width: '100%',
    height: screenUtils.scaleHeight(56),
    justifyContent: 'space-between',
  },
  inputBox: {
    flex: 1,
    height: screenUtils.scaleHeight(56),
    borderWidth: 1,
    borderRadius: screenUtils.scaleSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(20),
    paddingVertical: 0,
  },
});
