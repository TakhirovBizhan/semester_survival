import React, { ReactNode } from "react";
import { Modal, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { BlurView } from "expo-blur";

type ModalWindowProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const ModalWindow: React.FC<ModalWindowProps> = ({ visible, onClose, children }) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Размытие фона */}
          <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />
          
          <TouchableWithoutFeedback>
            <View style={styles.content}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // width: "90%",
    maxHeight: "90%",
    padding: 20,
    backgroundColor: "transparent", // фон убран
  },
});
