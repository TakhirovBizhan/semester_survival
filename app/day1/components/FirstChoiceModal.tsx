import React from "react";
import { View, Text} from "react-native";
import { Button } from "@/app/components/button";
import { ModalWindow } from "@/app/components/modalWindow";
import { usePlayer } from "../../context/playerContext";

export const FirstChoiceModal = () => {
  const { modalType, setModalType, setDay1Choice, setIndex, setIsTypingDone, index } = usePlayer();

  const choose = (choice: "choice1" | "choice2") => {
    console.log("[FirstChoiceModal] выбрали ->", choice);
    setDay1Choice(choice);        // сохраняем выбор
    setModalType("none");          // закрываем модалку
    setIndex(index + 1);           // инкремент индекса
    setIsTypingDone(false);        // сброс набора текста
  };

  return (
    <ModalWindow visible={modalType === "firstChoice"} onClose={() => setModalType("none")}>
      <Text style={{ color: "white", fontSize: 16, marginBottom: 20, fontFamily: "monospace" }}>
        Куда ты решил пойти?
      </Text>

      {/* Кнопки оставлены как были */}
      <Button title="Пойти на учёбу" onPress={() => choose("choice1")} />
      <View style={{ height: 10 }} />
      <Button title="Пойти гулять" onPress={() => choose("choice2")} />
    </ModalWindow>
  );
};
