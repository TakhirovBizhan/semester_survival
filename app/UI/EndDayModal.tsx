import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../components/button";
import { ModalWindow } from "../components/modalWindow";
import { usePlayer } from "../context/playerContext";

export const EndDayModal = () => {
  const { modalType, setModalType, player, setPlayer, setIndex } = usePlayer();
  const [isSleeping, setIsSleeping] = useState(false);

  if (modalType !== "endDay") return null;

  const handleSleep = () => {
    setIsSleeping(true);

    setTimeout(() => {
      const nextDay = player.currentDay + 1;

      // 🔄 обновляем игрока
      setPlayer({
        ...player,
        currentDay: nextDay,
      });

      setModalType("none");

      // 🚀 переход на следующий день
      
      router.push(`/day${nextDay}`);
      setIndex(0)
    }, 1500);
  };

  return (
    <ModalWindow visible={true} onClose={() => setModalType("none")}>
      {!isSleeping ? (
        <View>
          <Text
            style={{
              color: "white",
              fontFamily: "monospace",
              fontSize: 18,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            📅 Конец дня {player.currentDay}
          </Text>

          <Text style={{ color: "white", marginBottom: 6 }}>
            😊 Счастье: {player.happiness}
          </Text>
          <Text style={{ color: "white", marginBottom: 6 }}>
            🎓 Учёба: {player.academic}
          </Text>

          <Text style={{ color: "white", marginTop: 8, marginBottom: 16 }}>
            🍺 Пива выпито: {player.choices.beers}{"\n"}
            📚 Учился раз: {player.choices.studies}{"\n"}
            🧠 Использовал интеллект: {player.choices.intellect}{"\n"}
            😎 Использовал харизму: {player.choices.charisma}{"\n"}
            😔 Сдался: {player.choices.giveUp}
          </Text>

          <Button title="Лечь спать 😴" onPress={handleSleep} />
        </View>
      ) : (
        <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Ты уснул... 🌙
        </Text>
      )}
    </ModalWindow>
  );
};
