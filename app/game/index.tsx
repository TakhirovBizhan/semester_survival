import { Text, View } from "react-native";
import { Dialog } from "../components/dialog";
import { ModalWindow } from "../components/modalWindow";
import ProgressBar from "../components/progressBar";

import { Button } from "../components/button";
import { usePlayer } from "../context/playerContext";
import { useHandleBeer } from "../Hooks/HandleBeer";
import { useHandleLabChoice } from "../Hooks/HandleChoice";
import { useHandleStudy } from "../Hooks/HandleStudy";
import { ChooseNameModal } from "./components/ChooseNameModal";
import { useDialogs } from "./components/dialogs";

export default function Day1() {
  const { player, isTypingDone, setIsTypingDone, modalType, setModalType, index, setIndex} =
    usePlayer();

  const dialogs = useDialogs();

  const handleBeer = useHandleBeer();
  const handleStudy = useHandleStudy();
  const handleLabChoice = useHandleLabChoice();

  const currentDialog = dialogs[index];

  const handleNext = () => {
    if (!isTypingDone) return;

    const next = dialogs[index + 1];
    if (!next) return;

    // выполняем действие, если есть
    if (next.action) {
      next.action();
    }

    // показываем текст или двигаемся дальше
    setIndex(index + 1);
    setIsTypingDone(false);
  };
  


  return (
    <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20, backgroundColor: "#545454" }}>
      <ProgressBar title="Счастье" value={player.happiness} color="#ffcc00" />
      <ProgressBar title="Учёба" value={player.academic} color="#fc2003" />

      {/* 💬 Диалог */}
      {currentDialog?.text && (
        <Dialog text={currentDialog.text} onNext={handleNext} onComplete={() => setIsTypingDone(true)} />
      )}

      {/* 🪞 Модалка выбора имени */}
      <ChooseNameModal />

      {/* 🍻 Модалка выбора пути */}
      <ModalWindow visible={modalType === "firstChoice"} onClose={() => setModalType("none")}>
        <Text style={{ color: "white", fontFamily: "monospace", fontSize: 16, marginBottom: 8 }}>
          Куда пойдёшь?
        </Text>
        <Button title="Пойти за пивом 🍺" onPress={handleBeer} />
        <Button title="Пойти на учёбу 🎓" onPress={handleStudy} />
      </ModalWindow>

      {/* 🧠 Модалка выбора на лабораторной */}
      <ModalWindow visible={modalType === "labChoice"} onClose={() => setModalType("none")}>
        <Text style={{ color: "white", fontFamily: "monospace", fontSize: 16, marginBottom: 8 }}>
          Как сдаёшь лабораторную?
        </Text>
        <Button title="Использовать интеллект 🧠" onPress={() => handleLabChoice("intellect")} />
        <Button title="Использовать харизму 😎" onPress={() => handleLabChoice("charisma")} />
        <Button title="Сдаться 😔" onPress={() => handleLabChoice("giveUp")} />
      </ModalWindow>
    </View>
  );
}