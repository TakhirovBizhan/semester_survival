import { View } from "react-native";
import { Dialog } from "../components/dialog";
import { usePlayer } from "../context/playerContext";
import { CharismaModal } from "../UI/CharismaModal";
import { FirstChoiceModal } from "../UI/FirstChoiceModal";
import { IntelligenceModal } from "../UI/IntelligenceModal";
import { LabChoiceModal } from "../UI/LabChoiceModal";
import { ProgressSection } from "../UI/ProgressSection";
import { ChooseNameModal } from "./components/ChooseNameModal";
import { useDialogs } from "./components/dialogs";

export default function Day1() {
  const { isTypingDone, setIsTypingDone, index, setIndex } = usePlayer();
  const dialogs = useDialogs();
  const currentDialog = dialogs[index];

  const handleNext = () => {
    if (!isTypingDone) return;
    const next = dialogs[index + 1];
    if (!next) return;
    if (next.action) next.action();
    setIndex(index + 1);
    setIsTypingDone(false);
  };

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
      <ProgressSection />

      {/* 💬 Диалог */}
      {currentDialog?.text && (
        <Dialog
          text={currentDialog.text}
          onNext={handleNext}
          onComplete={() => setIsTypingDone(true)}
        />
      )}

      {/* 👤 Модалки */}
      <ChooseNameModal />
      <FirstChoiceModal />
      <LabChoiceModal />
      <IntelligenceModal />
      <CharismaModal />
    </View>
  );
}