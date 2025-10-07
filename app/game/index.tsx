import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { ModalWindow } from "../components/modalWindow";

export default function Index() {
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);

  const dialogs = [
    ".....................................",
    "МММ? Что за странный звук? И вообще где я?",
    "Наверное более важный вопрос, кто я?",
    "Да... Этот вопрос гораздо важнее, а ведь меня назвали в честь деда, эх как же его звали?",
    () => setModalVisible(true),
    "Ты сделал выбор и идёшь дальше по дню.",
  ];

  const handleNext = () => {
    const next = dialogs[index + 1];
    if (!isTypingDone) return; // если текст не допечатан — игнорируем

    if (typeof next === "function") {
      next(); // вызвать событие (например, модалку)
    } else if (next) {
      setIndex(index + 1);
      setIsTypingDone(false); // сбрасываем состояние для следующего текста
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Dialog
        text={typeof dialogs[index] === "string" ? dialogs[index] : ""}
        onNext={handleNext}
        onComplete={() => setIsTypingDone(true)}
      />
      <ModalWindow visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text style={{ color: "white", fontFamily: "monospace", fontSize: 16, marginBottom: 8 }}>
          Выбери себе имя
        </Text>
        <TextInput style={{ color: "white", fontFamily: "monospace", fontSize: 16, marginBottom: 8 }} />
        <Button title="Потвердить" onPress={() => setModalVisible(false)} />
      </ModalWindow>
    </View>
  );
}