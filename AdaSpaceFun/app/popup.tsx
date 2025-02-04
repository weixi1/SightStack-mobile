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
          <Text style={styles.popupMessage}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25, 
    borderRadius: 15, // 更圆润
    alignItems: 'center',
    shadowColor: '#000', // 添加阴影
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Android 阴影
  },
  popupMessage: {
    fontFamily: 'Comic Sans MS', // 可爱的字体
    fontSize: 24, // 大一点
    color: '#8a2be2', // 紫色
    textAlign: 'center',
    textShadowColor: '#abccee', // 阴影效果
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
    padding: 10,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#007bff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Popup;
