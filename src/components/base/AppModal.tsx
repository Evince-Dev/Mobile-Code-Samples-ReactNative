import React from 'react';
import { Modal, ModalProps, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface AppModalProps extends ModalProps {
  onClose?: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onRequestClose,
  onClose,
  children,
  animationType = 'slide',
  transparent = true,
  ...props
}) => {
  const { colors } = useTheme();

  const handleClose = (event?: any) => {
    if (onClose) onClose();
    if (onRequestClose) onRequestClose(event);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      animationType={animationType}
      transparent={transparent}
      {...props}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { backgroundColor: colors.card }]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
