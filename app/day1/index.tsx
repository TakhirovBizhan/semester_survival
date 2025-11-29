import React, { useEffect, useState } from "react";
import { Dimensions, ImageBackground, Platform, Text, View } from "react-native";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { usePlayer } from "../context/playerContext";

import { ChooseNameModal } from "../day1/components/ChooseNameModal";
import { useDialogs } from "../day1/components/dialogs";

import { CharismaModal } from "../UI/CharismaModal";
import { EndDayModal } from "../UI/EndDayModal";
import { FirstChoiceModal } from "../UI/FirstChoiceModal";
import { IntelligenceModal } from "../UI/IntelligenceModal";
import { LabChoiceModal } from "../UI/LabChoiceModal";
import { ProgressSection } from "../UI/ProgressSection";
import { SettingsModal } from "../UI/SettingsModal";

import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function Day1() {
  const { player, isTypingDone, setIsTypingDone, index, setIndex, setModalType } = usePlayer();

  const dialogs = useDialogs();
  const currentDialog = dialogs[index];

  // =============================
  // МУЗЫКА
  // =============================
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let isMounted = true;
    let music: Audio.Sound | null = null;

    // если веб версия, то музыка не играет
    const loadMusic = async () => {
      try {
        if (Platform.OS === "web") {
          console.log("Музыка отключена на Web");
          return;
        }
        
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
        (async () => {
          try {
            await music.stopAsync();
            await music.unloadAsync();
          } catch (e) {
            console.log("cleanup error:", e);
          }
        })();
      }
    };

  }, []);

  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(volume).catch((e) =>
        console.warn("Ошибка установки громкости:", e)
      );
    }
  }, [volume, sound]);

  // =============================
  //   ФОН
  // =============================
  const background = currentDialog?.background;

  // =============================
  //   НАЖАТИЕ "ДАЛЬШЕ"
  // =============================
  const handleNext = () => {
    if (!isTypingDone) return;

    const nextIndex = index + 1;
    const next = dialogs[nextIndex];

    // Последний шаг
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
          {`index: ${index}  lastChoice: ${String(player.lastChoice)}`}
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
          title="||"
          onPress={() => setModalType("settings")}
          square={true}
        />
      </View>

      <View
        style={{
          flex: 1,
          paddingTop: 40,
          paddingHorizontal: 20,
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
        pointerEvents="box-none"
      >
        <ProgressSection />

        {currentDialog?.text && (
          <Dialog
            text={currentDialog.text}
            onNext={handleNext}
            onComplete={() => setIsTypingDone(true)}
          />
        )}

        {/* МОДАЛКИ */}
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