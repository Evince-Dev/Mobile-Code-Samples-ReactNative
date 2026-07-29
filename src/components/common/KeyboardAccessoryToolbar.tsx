import React from 'react';
import {
  StyleSheet,
  Platform,
  InputAccessoryView,
  TextInput,
  Keyboard,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppView, AppText, AppTouchableOpacity } from '../base';
import { ChevronUpIcon, ChevronDownIcon } from '../icons';
import { screenUtils } from '../../utils/screenUtils';

export interface RegisteredInputProps {
  editable?: boolean;
  disabled?: boolean;
  onSubmitEditing?: (e: any) => void;
  returnKeyType?: string;
  returnKeyLabel?: string;
}

const registeredInputs: Record<
  string,
  { ref: React.RefObject<TextInput | null>; getProps: () => RegisteredInputProps }[]
> = {};

export const registerInput = (
  routeName: string,
  ref: React.RefObject<TextInput | null>,
  getProps: () => RegisteredInputProps
) => {
  if (!registeredInputs[routeName]) {
    registeredInputs[routeName] = [];
  }

  const registration = { ref, getProps };
  registeredInputs[routeName].push(registration);

  return () => {
    const list = registeredInputs[routeName];
    if (list) {
      const index = list.findIndex(item => item.ref === ref);
      if (index > -1) {
        list.splice(index, 1);
      }
      if (list.length === 0) {
        delete registeredInputs[routeName];
      }
    }
  };
};

export const getFocusableInputs = (routeName: string) => {
  const list = registeredInputs[routeName] || [];
  return list.filter(item => {
    const inputProps = item.getProps();
    return inputProps.editable !== false && (inputProps as any).disabled !== true;
  });
};

export interface KeyboardAccessoryToolbarProps {
  nativeID: string;
  inputRef: React.RefObject<TextInput | null>;
  routeName?: string;
  onNext?: () => void;
  onPrev?: () => void;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  showNavButtons?: boolean;
  onDone?: () => void;
  doneText?: string;
  accessoryColor?: string;
}

export const KeyboardAccessoryToolbar: React.FC<KeyboardAccessoryToolbarProps> = ({
  nativeID,
  inputRef,
  routeName,
  onNext,
  onPrev,
  nextDisabled,
  prevDisabled,
  showNavButtons,
  onDone,
  doneText,
  accessoryColor,
}) => {
  if (Platform.OS !== 'ios') {
    return null;
  }
  const { t } = useTranslation();
  const { colors } = useTheme();

  let routeContextName = '';
  try {
    const routeObj = useRoute();
    if (routeObj && routeObj.name) {
      routeContextName = routeObj.name;
    }
  } catch {
    // Navigation context not available
  }


  const route = routeName || routeContextName || 'default';

  const focusable = getFocusableInputs(route);
  const currentIndex = focusable.findIndex(item => item.ref === inputRef);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === -1 || currentIndex === focusable.length - 1;

  const isPrevButtonDisabled = prevDisabled !== undefined ? prevDisabled : (onPrev ? false : isFirst);
  const isNextButtonDisabled = nextDisabled !== undefined ? nextDisabled : (onNext ? false : isLast);
  const resolvedShowNavButtons = showNavButtons !== undefined ? showNavButtons : focusable.length > 1;

  const currentInputProps = currentIndex > -1 ? focusable[currentIndex].getProps() : {};

  const handleNext = onNext || (() => {
    if (currentIndex > -1 && currentIndex < focusable.length - 1) {
      focusable[currentIndex + 1].ref.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  });

  const handlePrev = onPrev || (() => {
    if (currentIndex > 0) {
      focusable[currentIndex - 1].ref.current?.focus();
    }
  });

  const handleDone = onDone || (() => {
    if (currentInputProps.onSubmitEditing) {
      currentInputProps.onSubmitEditing({} as any);
    } else if (currentInputProps.returnKeyType === 'next') {
      handleNext();
    } else {
      Keyboard.dismiss();
    }
  });

  const getDoneLabel = () => {
    if (doneText) return doneText;
    if (currentInputProps.returnKeyLabel) return currentInputProps.returnKeyLabel;
    if (currentInputProps.returnKeyType) {
      const type = currentInputProps.returnKeyType;
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
    return t('common.done');
  };

  return (
    <InputAccessoryView nativeID={nativeID}>
      <AppView
        style={[
          styles.toolbar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        {resolvedShowNavButtons ? (
          <AppView style={styles.navControls}>
            <AppTouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: colors.secondary },
                isPrevButtonDisabled && styles.disabledButton,
              ]}
              onPress={handlePrev}
              disabled={isPrevButtonDisabled}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ChevronUpIcon
                width={screenUtils.scaleSize(20)}
                height={screenUtils.scaleSize(20)}
                color={
                  isPrevButtonDisabled
                    ? colors.textMuted
                    : accessoryColor || colors.primary
                }
              />
            </AppTouchableOpacity>

            <AppTouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: colors.secondary },
                isNextButtonDisabled && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={isNextButtonDisabled}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ChevronDownIcon
                width={screenUtils.scaleSize(20)}
                height={screenUtils.scaleSize(20)}
                color={
                  isNextButtonDisabled
                    ? colors.textMuted
                    : accessoryColor || colors.primary
                }
              />
            </AppTouchableOpacity>
          </AppView>
        ) : (
          <AppView />
        )}

        <AppTouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppText
            style={[
              styles.doneText,
              {
                color: accessoryColor || colors.primary,
                fontSize: screenUtils.scaleFont(15),
              },
            ]}
            weight="semibold"
          >
            {getDoneLabel()}
          </AppText>
        </AppTouchableOpacity>

        <AppView
          style={{
            position: 'absolute',
            bottom: -screenUtils.scaleHeight(40),
            width: screenUtils.getWidth(),
            height: screenUtils.scaleHeight(40),
            backgroundColor: colors.card,
          }}
        />
      </AppView>
    </InputAccessoryView>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: screenUtils.scaleHeight(44),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenUtils.scaleWidth(16),
    borderTopWidth: 1,
  },
  navControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(8),
  },
  navButton: {
    width: screenUtils.scaleSize(34),
    height: screenUtils.scaleSize(34),
    borderRadius: screenUtils.scaleSize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  doneButton: {
    paddingVertical: screenUtils.scaleHeight(6),
    paddingHorizontal: screenUtils.scaleWidth(8),
  },
  doneText: {
    textAlign: 'right',
  },
});
