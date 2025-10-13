import { Text, View } from "react-native";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { ModalWindow } from "../components/modalWindow";
import ProgressBar from "../components/progressBar";
import { usePlayer } from "../context/playerContext";
import { useHandleBeer } from "../Hooks/HandleBeer";
import { useHandleLabChoice } from "../Hooks/HandleChoice";
import { useHandleStudy } from "../Hooks/HandleStudy";
import { CharismaModal } from "../UI/CharismaModal";
import { IntelligenceModal } from "../UI/IntelligenceModal";
import { ChooseNameModal } from "./components/ChooseNameModal";
import { useDialogs } from "./components/dialogs";

export default function Day1() {
  const {
    player,
    isTypingDone,
    setIsTypingDone,
    modalType,
    setModalType,
    index,
    setIndex,
  } = usePlayer();

  const dialogs = useDialogs();

  const handleBeer = useHandleBeer();
  const handleStudy = useHandleStudy();
  const handleLabChoice = useHandleLabChoice();

  const currentDialog = dialogs[index];

  const handleNext = () => {
    if (!isTypingDone) return;

    const next = dialogs[index + 1];
    if (!next) return;

    if (next.action) {
      next.action();
    }

    setIndex(index + 1);
    setIsTypingDone(false);
  };

  const closeModal = () => setModalType("none");

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: "#545454",
      }}
    >
      {/* 🔋 Прогресс-бары */}
      <ProgressBar title="Счастье" value={player.happiness} color="#ffcc00" />
      <ProgressBar title="Учёба" value={player.academic} color="#fc2003" />

      {/* 💬 Диалог */}
      {currentDialog?.text && (
        <Dialog
          text={currentDialog.text}
          onNext={handleNext}
          onComplete={() => setIsTypingDone(true)}
        />
      )}

      {/* 👤 Выбор имени */}
      <ChooseNameModal />

      {/* 🍻 Первый выбор */}
      <ModalWindow visible={modalType === "firstChoice"} onClose={closeModal}>
        <Text
          style={{
            color: "white",
            fontFamily: "monospace",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Куда пойдёшь?
        </Text>
        <Button title="Пойти за пивом 🍺" onPress={handleBeer} />
        <Button title="Пойти на учёбу 🎓" onPress={handleStudy} />
      </ModalWindow>

      {/* 🧠 Выбор на лабораторной */}
      <ModalWindow visible={modalType === "labChoice"} onClose={closeModal}>
        <Text
          style={{
            color: "white",
            fontFamily: "monospace",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Как сдаёшь лабораторную?
        </Text>
        <Button
          title="Использовать интеллект 🧠"
          onPress={() => setModalType("intelligence")}
        />
        <Button
          title="Использовать харизму 😎"
          onPress={() => setModalType("charisma")}
        />
        <Button title="Сдаться 😔" onPress={() => handleLabChoice("giveUp")} />
      </ModalWindow>

      {/* 🧠 Модалка интеллекта */}
      <IntelligenceModal />

      {/* 😎 Модалка харизмы  неправильно вызывается, должна работать через массив dialog!!*/}
      <CharismaModal />
    </View>
  );
}
