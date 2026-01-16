// app/UI/SettingsModal.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { ModalWindow } from "../components/modalWindow";
import { Button } from "../components/button";
import { usePlayer } from "../context/playerContext";
import { useRouter } from "expo-router";
import { SyncStatus } from "../components/SyncStatus";
import { firebaseSync } from "../services/firebaseSync";

import Slider from "@react-native-community/slider";

interface SettingsModalProps {
  volume: number;
  setVolume: (v: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ volume, setVolume }) => {
  const { modalType, setModalType, player } = usePlayer();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  // показываем модалку только если modalType === "settings"
  if (modalType !== "settings") return null;

  const goToMainMenu = () => {
    setModalType("none"); // закрываем модалку
    router.push("/");      // возвращаемся на главный экран
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await firebaseSync.forceSync(player);
      // Обрабатываем очередь после принудительной синхронизации
      await firebaseSync.processQueue();
    } catch (error) {
      console.error("Ошибка ручной синхронизации:", error);
    } finally {
      setSyncing(false);
    }
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

      {/* Статус синхронизации */}
      <View style={{ marginVertical: 10 }}>
        <Text style={{ color: "white", marginBottom: 8, fontSize: 14 }}>Синхронизация прогресса</Text>
        <SyncStatus />
        <Button
          title={syncing ? "Синхронизация..." : "Синхронизировать сейчас"}
          onPress={handleManualSync}
          disabled={syncing}
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
