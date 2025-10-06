import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type ModalWindowProps = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export const ModalWindow: React.FC<ModalWindowProps> = ({ visible, onClose, children }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.box}>{children}</View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#111",
    borderColor: "#fff",
    borderWidth: 3,
    padding: 20,
    width: "80%",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});