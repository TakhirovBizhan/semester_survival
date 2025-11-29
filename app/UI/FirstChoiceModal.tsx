import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../components/button";
import { ModalWindow } from "../components/modalWindow";
import { usePlayer } from "../context/playerContext";
import { useHandleBeer } from "../Hooks/HandleBeer";
import { useHandleStudy } from "../Hooks/HandleStudy";

export const FirstChoiceModal = () => {
  const { modalType, setModalType } = usePlayer();
  const handleBeer = useHandleBeer();
  const handleStudy = useHandleStudy();

  const [result, setResult] = useState<string | null>(null);

  if (modalType !== "firstChoice") return null;

  // -----------------------
  // ВАЖНО: handleAction ДОЛЖНА быть выше onPress
  // -----------------------
  const handleAction = (fn: () => void, message: string) => {
    setResult(message);

    setTimeout(() => {
      fn();
      setModalType("none");
    }, 1500);
  };

  return (
<ModalWindow 
      visible 
      onClose={() => { /* пустая функция, закрытие через крестик запрещено */ }}
    >
      {!result ? (
        <View>
          <Text
            style={{
              color: "white",
              fontFamily: "monospace",
              fontSize: 16,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Куда пойдёшь?
          </Text>

          {/* 🍺 выбрать пиво */}
          <Button
            title="Пойти за пивом 🍺"
            onPress={() => {
              handleAction(
                handleBeer,
                "🍺 Настроение улучшилось, учёба немного просела!"
              );
            }}
          />

          {/* 🎓 выбрать учебу */}
          <Button
            title="Пойти на учёбу 🎓"
            onPress={() => {
              handleAction(
                handleStudy,
                "🎓 Учёба выросла, настроение немного понизилось!"
              );
            }}
          />
        </View>
      ) : (
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            {result}
          </Text>
        </View>
      )}
    </ModalWindow>
  );
};
