import React, { ReactNode } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

type ModalWindowProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const ModalWindow: React.FC<ModalWindowProps> = ({ visible, onClose, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />

        {/* Контейнер модалки — не закрывается при клике */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    maxWidth: "90%",
    maxHeight: "90%",
    backgroundColor: "transparent",
  },
});
