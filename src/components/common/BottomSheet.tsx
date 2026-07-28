import React from 'react';
import {
  DimensionValue,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { screenUtils } from '../../utils';
import { AppScrollView } from '../base/AppScrollView';
import { AppText } from '../base/AppText';
import { AppTouchableOpacity } from '../base/AppTouchableOpacity';
import { AppView } from '../base/AppView';
import { CloseIcon } from '../icons';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxHeight?: DimensionValue;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  maxHeight = '88%',
  children,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <AppView style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <AppView
              style={[
                styles.drawer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  maxHeight,
                },
              ]}
            >
              {/* Sticky Header */}
              {title !== undefined && (
                <AppView
                  style={[
                    styles.header,
                    {
                      backgroundColor: colors.card,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <AppTouchableOpacity
                    onPress={onClose}
                    style={[styles.closeButton, { backgroundColor: colors.secondary }]}
                    activeOpacity={0.7}
                  >
                    <CloseIcon
                      width={screenUtils.scaleSize(18)}
                      height={screenUtils.scaleSize(18)}
                      color={colors.foreground}
                    />
                  </AppTouchableOpacity>
                  <AppText weight="bold" style={styles.headerTitle}>
                    {title}
                  </AppText>
                  <AppView style={styles.headerSpacer} />
                </AppView>
              )}

              {/* Scrollable Content Container */}
              <AppScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets
              >
                {children}
              </AppScrollView>
            </AppView>
          </TouchableWithoutFeedback>
        </AppView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  drawer: {
    borderTopLeftRadius: screenUtils.scaleSize(20),
    borderTopRightRadius: screenUtils.scaleSize(20),
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenUtils.scaleWidth(16),
    paddingVertical: screenUtils.scaleHeight(14),
    borderTopLeftRadius: screenUtils.scaleSize(20),
    borderTopRightRadius: screenUtils.scaleSize(20),
    borderBottomWidth: 1,
  },
  closeButton: {
    width: screenUtils.scaleSize(32),
    height: screenUtils.scaleSize(32),
    borderRadius: screenUtils.scaleSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: screenUtils.scaleFont(16),
  },
  headerSpacer: {
    width: screenUtils.scaleSize(32),
  },
  content: {
    padding: screenUtils.scaleSize(16),
    paddingBottom: screenUtils.scaleHeight(36),
  },
});
