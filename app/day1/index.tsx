// import { View } from "react-native";
// import { Dialog } from "../components/dialog";
// import { usePlayer } from "../context/playerContext";
// import { CharismaModal } from "../UI/CharismaModal";
// import { EndDayModal } from "../UI/EndDayModal";
// import { FirstChoiceModal } from "../UI/FirstChoiceModal";
// import { IntelligenceModal } from "../UI/IntelligenceModal";
// import { LabChoiceModal } from "../UI/LabChoiceModal";
// import { ProgressSection } from "../UI/ProgressSection";
// import { ChooseNameModal } from "./components/ChooseNameModal";
// import { useDialogs } from "./components/dialogs";

// export default function Day1() {
//   const { isTypingDone, setIsTypingDone, index, setIndex, setModalType } = usePlayer();
//   const dialogs = useDialogs();
//   const currentDialog = dialogs[index];

//   const handleNext = () => {
//     if (!isTypingDone) return;
//     const next = dialogs[index + 1];
//     if (!next) {
//       setModalType("endDay"); // 👈 показываем модалку конца дня
//       return;
//     }
//     if (next.action) next.action();
//     setIndex(index + 1);
//     setIsTypingDone(false);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         paddingTop: 40,
//         paddingHorizontal: 20,
//         backgroundColor: "#545454",
//       }}
//     >
//       {/* 🔋 Прогресс-бары */}
//       <ProgressSection />

//       {/* 💬 Диалог */}
//       {currentDialog?.text && (
//         <Dialog
//           text={currentDialog.text}
//           onNext={handleNext}
//           onComplete={() => setIsTypingDone(true)}
//         />
//       )}

//       {/* 👤 Модалки */}
//       <ChooseNameModal />
//       <FirstChoiceModal />
//       <LabChoiceModal />
//       <IntelligenceModal />
//       <CharismaModal />
//       <EndDayModal />
//     </View>
//   );
// }

import React, { useEffect, useMemo } from "react";
import { View, ImageBackground, Dimensions, Text } from "react-native";
import { Dialog } from "../components/dialog";
import { usePlayer } from "../context/playerContext";
import { ChooseNameModal } from "./components/ChooseNameModal";
import { FirstChoiceModal } from "./components/FirstChoiceModal";
import { LabChoiceModal } from "../UI/LabChoiceModal";
import { IntelligenceModal } from "../UI/IntelligenceModal";
import { CharismaModal } from "../UI/CharismaModal";
import { EndDayModal } from "../UI/EndDayModal";
import { ProgressSection } from "../UI/ProgressSection";
import { useDialogs, day1Backgrounds, day1ChoiceBackgrounds } from "./components/dialogs";

const { width, height } = Dimensions.get("window");

export default function Day1() {
  const { isTypingDone, setIsTypingDone, index, setIndex, setModalType, day1Choice } = usePlayer();
  const dialogs = useDialogs();
  const currentDialog = dialogs[index];

  // вычисляем background через useMemo для реактивного обновления
  const background = useMemo(() => {
    if (day1Choice === "choice1") return day1ChoiceBackgrounds.choice1;
    if (day1Choice === "choice2") return day1ChoiceBackgrounds.choice2;
    return day1Backgrounds[0]; // дефолтный фон
  }, [day1Choice]);

  useEffect(() => {
    console.log("[Day1] render -> index:", index, "day1Choice:", day1Choice);
  }, [index, day1Choice]);

  const handleNext = () => {
    if (!isTypingDone) return;

    const next = dialogs[index + 1];
    if (!next) {
      setModalType("endDay");
      return;
    }

    if (next.action) next.action();
    setIndex(prev => prev + 1);
    setIsTypingDone(false);
  };

  return (
    <ImageBackground
      source={background}
      style={{ width, height, flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ position: "absolute", top: 6, left: 6, zIndex: 50 }}>
        <Text style={{ color: "white", fontSize: 12 }}>
          {`index: ${index}  choice: ${String(day1Choice)}`}
        </Text>
      </View>

      <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20, backgroundColor: "rgba(0,0,0,0.35)" }}>
        <ProgressSection />

        {currentDialog?.text && (
          <Dialog
            text={currentDialog.text}
            onNext={handleNext}
            onComplete={() => setIsTypingDone(true)}
          />
        )}

        {/* Модалки */}
        <ChooseNameModal />
        <FirstChoiceModal />
        <LabChoiceModal />
        <IntelligenceModal />
        <CharismaModal />
        <EndDayModal />
      </View>
    </ImageBackground>
  );
}
