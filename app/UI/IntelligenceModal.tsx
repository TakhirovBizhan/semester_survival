import { ModalWindow } from "@/app/components/modalWindow";
import { usePlayer } from "@/app/context/playerContext";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { useHandleLabChoice } from "../Hooks/HandleChoice";

// Массив задач (5–9 класс)
const mathTasks = [
  {
    question: "2x + 4 = 10. Найди x",
    options: ["2", "3", "4", "5"],
    correct: "3",
  },
  {
    question: "5 * (3 + 2) = ?",
    options: ["10", "15", "20", "25"],
    correct: "25",
  },
  { question: "15 / 3 + 4 = ?", options: ["9", "7", "6", "8"], correct: "9" },
  { question: "9² = ?", options: ["81", "72", "90", "99"], correct: "81" },
  {
    question: "12 + 8 / 4 = ?",
    options: ["14", "10", "13", "16"],
    correct: "14",
  },
];

export const IntelligenceModal = () => {
  const { modalType, setModalType } = usePlayer();
  const [selected, setSelected] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const handleLabChoice = useHandleLabChoice();

  if (modalType !== "intelligence") return null;

  const task = mathTasks[Math.floor(Math.random() * mathTasks.length)];

  const handleAnswer = (answer: string) => {
    if (selected) return; // блокируем повторные клики
    const isCorrect = answer === task.correct;

    handleLabChoice("intellect", isCorrect);
    setSelected(answer);
    setResultText(
      isCorrect
        ? "✅ Правильный ответ! +10 к счастью и учёбе"
        : "❌ Неправильный ответ! -20 к счастью и учёбе"
    );

    // Закрываем и продолжаем диалог
    setTimeout(() => {
      setModalType("none");
    }, 2000);
  };

  return (
    <ModalWindow
      visible
      onClose={() => {
        /* пустая функция, закрытие через крестик запрещено */
      }}
    >
      {!resultText ? (
        <>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
            Реши задачу:
          </Text>
          <Text style={{ color: "#FFD700", fontSize: 16, marginBottom: 12 }}>
            {task.question}
          </Text>
          {task.options.map((opt) => (
            <View key={opt} style={{ marginVertical: 4 }}>
              <Button
                title={opt}
                onPress={() => handleAnswer(opt)}
                color={selected === opt ? "#666" : "#333"}
              />
            </View>
          ))}
        </>
      ) : (
        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
          {resultText}
        </Text>
      )}
    </ModalWindow>
  );
};
