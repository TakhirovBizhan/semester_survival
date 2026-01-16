import { Stack } from "expo-router";
import { PlayerProvider } from "./context/playerContext";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export default function RootLayout() {
  // Обработка AppState для синхронизации при возврате из фона
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // Приложение вернулось на передний план - обрабатываем очередь синхронизации
        try {
          const { firebaseSync } = await import("./services/firebaseSync");
          await firebaseSync.processQueue();
        } catch (error) {
          console.error("Ошибка обработки очереди при возврате из фона:", error);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  // Убрал Хедер с помощью опции
  return <PlayerProvider><Stack screenOptions={{ headerShown: false }} /></PlayerProvider>;
}
