import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../components/button";
import { ModalWindow } from "../components/modalWindow";
import { usePlayer } from "../context/playerContext";
import { useHandleLabChoice } from "../Hooks/HandleChoice";

export const LabChoiceModal = () => {
  const { modalType, setModalType } = usePlayer();
  const handleLabChoice = useHandleLabChoice();
  const [result, setResult] = useState<string | null>(null);

  if (modalType !== "labChoice") return null;

  const handleOption = (option: "intellect" | "charisma" | "giveUp") => {
    if (option === "giveUp") {
      setResult("😔 Ты сдался — счастье и учёба уменьшились.");
      setTimeout(() => {
        handleLabChoice("giveUp");
      }, 1500);
    } else {
      // Оставляем окно открытым, просто меняем тип модалки после рендера
      setTimeout(() => setModalType(option), 150);
    }
  };

  return (
    <ModalWindow
      visible
      onClose={() => {
        /* пустая функция, закрытие через крестик запрещено */
      }}
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
            Как сдаёшь лабораторную?
          </Text>
          <Button
            onPress={() => handleOption("intellect")}
            title="Использовать интеллект 🧠"
          ></Button>
          <Button
            title="Использовать харизму 😎"
            onPress={() => handleOption("charisma")}
          />
          <Button title="Сдаться 😔" onPress={() => handleOption("giveUp")} />
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
