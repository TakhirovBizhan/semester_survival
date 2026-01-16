import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  BackHandler,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "./components/button";
import { Menu } from "./components/menu";
// import { baseColor } from "./config/Colors";
import { useEffect, useState } from "react";
import { primaryTextColor } from "./config/Colors";
import { usePlayer } from "./context/playerContext";
import { SettingsModal } from "./UI/SettingsModal";

// путь к картинке фона
const backgroundImage = require("../assets/bg/main.png");

export default function Index() {
  const { setModalType, player, isLoadingProgress, setIndex, startNewGame } =
    usePlayer();
  const [volume, setVolume] = useState(1);
  const router = useRouter();

  //Фича под андроид, открытые настроек при нажатии на кнопку назад
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      setModalType("settings");
      return true; // блокируем выход из приложения
    });

    return () => handler.remove();
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Индикатор загрузки прогресса */}
      {isLoadingProgress && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={primaryTextColor} />
          <Text style={styles.loadingText}>Загрузка прогресса...</Text>
        </View>
      )}

      <Menu>
        {/* Кнопка "Играть" - продолжает с сохраненного прогресса или начинает заново */}
        <Button
          title={
            player.currentDay > 1
              ? `Продолжить (День ${player.currentDay})`
              : "Играть"
          }
          onPress={() => {
            // Сбрасываем индекс диалога для начала дня
            setIndex(0);

            // Определяем на какой день переходить
            const targetDay = player.currentDay;

            // Проверяем, не закончена ли игра (день 3 завершен)
            if (targetDay > 3) {
              // Игра завершена - переходим на концовку
              if (player.academic <= 0) {
                router.push("/endings/badEnding" as never);
              } else {
                router.push("/endings/goodEnding" as never);
              }
            } else {
              // Переходим на соответствующий день
              router.push(`/day${targetDay}` as never);
            }
          }}
        />
        {/* Кнопка "Начать новую игру" - сбрасывает прогресс и начинает заново */}
        <Button
          title="Начать новую игру"
          onPress={async () => {
            // Сбрасываем прогресс
            await startNewGame();
            // Переходим на день 1
            setIndex(0);
            router.push("/day1" as never);
          }}
        />
        <Button title="Настройки" onPress={() => setModalType("settings")} />
        <Button
          title="Статистика"
          onPress={() => router.push("/statistic" as never)}
        />
        <Button
          title="Правила игры"
          onPress={() => router.push("/rules" as never)}
        />
        <Button title="Выход" />
      </Menu>

      {/* Модальное окно настроек */}
      <SettingsModal volume={volume} setVolume={setVolume} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  title: {
    marginBottom: 20,
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "monospace",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: primaryTextColor,
    marginTop: 16,
    fontSize: 16,
    fontFamily: "monospace",
  },
});
