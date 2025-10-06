import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { ModalWindow } from "../components/modalWindow";


export default function Index(){
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const dialogs = [
    "Ты просыпаешься и смотришь на часы — уже 9:00.",
    "На паре по физике тебе предстоит защита лабораторной.",
    () => setModalVisible(true),
    "Ты сделал выбор и идёшь дальше по дню.",
  ];

  const handleNext = () => {
    const next = dialogs[index + 1];
    if (typeof next === "function") {
      next(); // вызвать событие (например, модалку)
    } else if (next) {
      setIndex(index + 1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Dialog text={typeof dialogs[index] === "string" ? dialogs[index] : ""} onNext={handleNext} />
      <ModalWindow visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text style={{ color: "white", fontFamily: "monospace", fontSize: 16, marginBottom: 8 }}>
          Что ты выберешь?
        </Text>
        <Button title="Использовать интеллект" onPress={() => setModalVisible(false)} />
        <Button title="Использовать харизму" onPress={() => setModalVisible(false)} />
        <Button title="Сдаться" onPress={() => setModalVisible(false)} />
      </ModalWindow>
    </View>
  );
};