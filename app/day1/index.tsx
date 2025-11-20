import React, { useState, useEffect, useMemo } from "react";
import { View, ImageBackground, Dimensions, Text } from "react-native";
import { Dialog } from "../components/dialog";
import { usePlayer } from "../context/playerContext";
import { ChooseNameModal } from "../day1/components/ChooseNameModal";
import { FirstChoiceModal } from "../UI/FirstChoiceModal";
import { LabChoiceModal } from "../UI/LabChoiceModal";
import { IntelligenceModal } from "../UI/IntelligenceModal";
import { CharismaModal } from "../UI/CharismaModal";
import { EndDayModal } from "../UI/EndDayModal";
import { ProgressSection } from "../UI/ProgressSection";
import { Button } from "../components/button";
import { useDialogs, day1Backgrounds, day1ChoiceBackgrounds } from "../day1/components/dialogs";
import { SettingsModal } from "../UI/SettingsModal";
//
import { Audio } from "expo-av";


const { width, height } = Dimensions.get("window");

export default function Day1() {
  const { isTypingDone, setIsTypingDone, index, setIndex, setModalType, day1Choice } = usePlayer();
  const dialogs = useDialogs();
  const currentDialog = dialogs[index];

  useEffect(() => {
    console.log("[Day1] render -> index:", index, "day1Choice:", day1Choice);
  }, [index, day1Choice]);
//
  // музыка
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
  let isMounted = true;
  let music: Audio.Sound | null = null;

  const loadMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/music/day1.mp3"),
        { shouldPlay: true, isLooping: true, volume }
      );
      music = sound;
      if (isMounted) setSound(sound);
      await sound.playAsync();
    } catch (e) {
      console.warn("Ошибка при загрузке музыки:", e);
    }
  };

  loadMusic();

  return () => {
    isMounted = false;
    if (music) {
      music.stopAsync();
      music.unloadAsync();
    }
  };
}, []);


useEffect(() => {
  if (sound) {
    sound.setVolumeAsync(volume).catch((e) => console.warn("Ошибка установки громкости:", e));
  }
}, [volume, sound]);

  const background = useMemo(() => {
    if (day1Choice === "choice1") return day1ChoiceBackgrounds.choice1;
    if (day1Choice === "choice2") return day1ChoiceBackgrounds.choice2;
    return day1Backgrounds[0];
  }, [day1Choice]);


//
  const handleNext = () => {
    if (!isTypingDone) return;
    const nextIndex = index + 1;
    const next = dialogs[nextIndex];
    if (!next) {
      setModalType("endDay");
      return;
    }
    if (next.action) next.action();
    setIndex(nextIndex);
    setIsTypingDone(false);
  };

  return (
    <ImageBackground
      source={background}
      style={{ width, height, flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ position: "absolute", top: 6, left: 6, zIndex: 50 }} pointerEvents="none">
        <Text style={{ color: "white", fontSize: 12 }}>
          {`index: ${index}  choice: ${String(day1Choice)}`}
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          top: 35,
          right: 20,
          zIndex: 200,
        }}
      >
        <Button
          title="⚙️"
          onPress={() => setModalType("settings")}
        />
      </View>


      <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20, backgroundColor: "rgba(0,0,0,0.35)" }} pointerEvents="box-none">
        <ProgressSection />
        {currentDialog?.text && (
          <Dialog text={currentDialog.text} onNext={handleNext} onComplete={() => setIsTypingDone(true)} />
        )}

        <ChooseNameModal />
        <FirstChoiceModal />
        <LabChoiceModal />
        <IntelligenceModal />
        <CharismaModal />
        <EndDayModal />
        <SettingsModal volume={volume} setVolume={setVolume} />
      </View>
    </ImageBackground>
  );
}
