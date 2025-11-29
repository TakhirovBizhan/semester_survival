import { Link } from "expo-router";
import { BackHandler, ImageBackground, Platform, StyleSheet } from "react-native";
import { Button } from './components/button';
import { Menu } from "./components/menu";
// import { baseColor } from "./config/Colors";
import { useEffect, useState } from "react";
import { usePlayer } from "./context/playerContext";
import { SettingsModal } from "./UI/SettingsModal";



// путь к картинке фона
const backgroundImage = require("../assets/bg/main.png");

export default function Index() {
  const { player, setModalType } = usePlayer();
  const [volume, setVolume] = useState(1);


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
      <Menu>
        <Link href={`../day${Math.max(1, player.currentDay)}`}>
          <Button title={"Играть"} />
        </Link>
        <Button title="Настройки" onPress={() => setModalType("settings")} />
        <Link href="../statistic">
          <Button title={"Статистика"} />
        </Link>
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
});
