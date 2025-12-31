// app/UI/SettingsModal.tsx
import React from "react";
import { View, Text } from "react-native";
import { ModalWindow } from "../components/modalWindow";
import { Button } from "../components/button";
import { usePlayer } from "../context/playerContext";
import { useRouter } from "expo-router";


import Slider from "@react-native-community/slider";

interface SettingsModalProps {
  volume: number;
  setVolume: (v: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ volume, setVolume }) => {
  const { modalType, setModalType } = usePlayer();
const router = useRouter();

  // показываем модалку только если modalType === "settings"
  if (modalType !== "settings") return null;

  const goToMainMenu = () => {
    setModalType("none"); // закрываем модалку
    router.push("/");      // возвращаемся на главный экран
  };

  return (
    <ModalWindow visible onClose={() => setModalType("none")}>
      <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
        Настройки
      </Text>

    <View style={{ marginVertical: 20 }}>
        <Text style={{ color: "white", marginBottom: 8 }}>Громкость: {Math.round(volume * 100)}%</Text>
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          style={{ width: 250, height: 40 }}
        />
      </View>

      {/* Кнопки */}
      <Button title="Главное меню" onPress={goToMainMenu} />

      <Button
        title="Закрыть"
        onPress={() => setModalType("none")}
      />
    </ModalWindow>
  );
};
