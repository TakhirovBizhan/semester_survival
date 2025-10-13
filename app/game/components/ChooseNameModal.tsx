import { Button } from "@/app/components/button";
import { ModalWindow } from "@/app/components/modalWindow";
import React from "react";
import { Text, TextInput } from "react-native";
import { usePlayer } from "../../context/playerContext";

export const ChooseNameModal = () => {
  const { modalType, setModalType, player, updatePlayer, setIndex, setIsTypingDone } = usePlayer();

  const handleConfirmName = async () => {
    if (player.name.trim()) {
      await updatePlayer({ name: player.name });
      setModalType("none");
      setIndex(prev => prev + 1);
      setIsTypingDone(false);
    }
  };

  return (
    <ModalWindow visible={modalType === "name"} onClose={() => setModalType("none")}>
      <Text
        style={{
          color: "white",
          fontFamily: "monospace",
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        Выбери себе имя
      </Text>
      <TextInput
        value={player.name}
        onChangeText={(text) => updatePlayer({ name: text })}
        placeholder="Введите имя"
        placeholderTextColor="#999"
        style={{
          color: "white",
          fontFamily: "monospace",
          fontSize: 16,
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: "white",
        }}
      />
      <Button title="Подтвердить" onPress={handleConfirmName} />
    </ModalWindow>
  );
};