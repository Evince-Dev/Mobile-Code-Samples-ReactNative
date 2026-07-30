import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, ModalProps, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppModalProps extends ModalProps {
  onClose?: () => void;
  /** Enables dynamic spring-scale entry & exit animation for alert popups */
  useSpringScale?: boolean;
  /** When true, omits default card styling wrapper around children (e.g. for custom AppLoader overlay) */
  noContainerStyle?: boolean;
}

/**
 * AppModal Component
 *
 * Base modal component supporting standard native modal animations (fade/slide)
 * or optional dynamic spring-scale animations via `useSpringScale`.
 */
export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onRequestClose,
  onClose,
  children,
  animationType = 'fade',
  transparent = true,
  useSpringScale = false,
  noContainerStyle = false,
  ...props
}) => {
  const { colors } = useTheme();
  const [shouldRender, setShouldRender] = useState(Boolean(visible));
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleClose = (event?: any) => {
    if (onClose) onClose();
    if (onRequestClose) onRequestClose(event);
  };

  useEffect(() => {
    if (!useSpringScale) return;

    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible, useSpringScale, scaleAnim, fadeAnim]);

  if (!useSpringScale) {
    return (
      <Modal
        transparent={transparent}
        {...props}
        visible={visible}
        onRequestClose={handleClose}
        animationType={animationType}
      >
        {noContainerStyle ? (
          children
        ) : (
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
              <TouchableWithoutFeedback>
                <View style={[styles.content, { backgroundColor: colors.card }]}>
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Modal>
    );
  }

  const renderContent = () => {
    if (noContainerStyle) {
      return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {children}
        </Animated.View>
      );
    }
    return (
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: colors.card,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <Modal
      transparent={transparent}
      {...props}
      visible={shouldRender}
      onRequestClose={handleClose}
      animationType="none"
    >
      <Animated.View style={[styles.overlay, { backgroundColor: colors.overlay, opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        {renderContent()}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
