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

  const handleAction = (fn: () => void, message: string) => {
    setResult(message); // показываем результат
    // Закрываем окно только через 1.5 сек
    setTimeout(() => {
        fn(); // обновляем игрока
    }, 1500);
  };

  return (
    <ModalWindow visible onClose={() => setModalType("none")}>
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
          <Button
            title="Пойти за пивом 🍺"
            onPress={() =>
              handleAction(
                handleBeer,
                "🍺 Настроение улучшилось, учёба немного просела!"
              )
            }
          />
          <Button
            title="Пойти на учёбу 🎓"
            onPress={() =>
              handleAction(
                handleStudy,
                "🎓 Учёба выросла, настроение немного понизилось!"
              )
            }
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
