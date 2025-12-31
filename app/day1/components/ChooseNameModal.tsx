import { Button } from "@/app/components/button";
import { ModalWindow } from "@/app/components/modalWindow";
import React from "react";
import { Text, TextInput } from "react-native";
import { usePlayer } from "../../context/playerContext";

export const ChooseNameModal = () => {
  const { modalType, setModalType, player, updatePlayer, index, setIndex, setIsTypingDone } = usePlayer();

  const handleConfirmName = async () => {
    if (player.name.trim()) {
      await updatePlayer({ name: player.name });

      setModalType("none");

      //  Правильное обновление индекса
      setIndex(index + 1);

      setIsTypingDone(false);
    }
  };

  return (
    <ModalWindow 
      visible={modalType === "name"} 
      onClose={() => { /* Модалку закрыть нельзя */ }}
    >
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
  selectionColor="white"         // цвет выделения текста
  underlineColorAndroid="transparent" // убираем нижнюю линию на Android
  // caretColor="white"             // цвет курсора
  style={{
    outline: "none",
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    color: "white",
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 8,
  }}
/>


      <Button title="Подтвердить" onPress={handleConfirmName} />
    </ModalWindow>
  );
};
