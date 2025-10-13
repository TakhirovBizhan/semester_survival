import { ModalWindow } from "@/app/components/modalWindow";
import { usePlayer } from "@/app/context/playerContext";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";

// Варианты фраз
const charismaTasks = [
  {
    question: "Преподаватель недоволен. Что ты скажешь?",
    options: ["Извините, я больше не опоздаю", "Это не моя вина!", "Молчать", "Сделать комплимент"],
  },
  {
    question: "Ты на вечеринке. Как впечатлить собеседника?",
    options: ["Ты сегодня отлично выглядишь!", "Я устал", "Кто ты?", "Пошли домой"],
  },
  {
    question: "Ты знакомишься с человеком. Что сказать?",
    options: ["Рад знакомству!", "Ты где работаешь?", "А ты кто?", "Молча смотреть"],
  },
];

export const CharismaModal = () => {
  const { modalType, setModalType, player, updatePlayer } = usePlayer();
  const [selected, setSelected] = useState<string | null>(null);

  if (modalType !== "charisma") return null;

  const task = charismaTasks[Math.floor(Math.random() * charismaTasks.length)];
  const correctAnswer = task.options[Math.floor(Math.random() * task.options.length)];

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === correctAnswer;
    const delta = isCorrect ? 10 : -20;

    updatePlayer({
      happiness: Math.max(0, player.happiness + delta),
      academic: Math.max(0, player.academic + delta),
    });

    setSelected(answer);
    setTimeout(() => setModalType("none"), 800);
  };

  return (
    <ModalWindow visible={modalType === "charisma"} onClose={() => setModalType("none")}>
      <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>{task.question}</Text>

      {task.options.map((opt) => (
        <View key={opt} style={{ marginVertical: 4 }}>
          <Button
            title={opt}
            onPress={() => handleAnswer(opt)}
            color={selected === opt ? "#666" : "#333"}
          />
        </View>
      ))}
    </ModalWindow>
  );
};
