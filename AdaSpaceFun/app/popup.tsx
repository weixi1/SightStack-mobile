import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, message }) => {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#0066cc',
    borderRadius: 5,
  },
});

export default Popup;