import { Link } from "expo-router";
import { Text, StyleSheet, ImageBackground} from "react-native";
import { Button } from './components/button';
import { Menu } from "./components/menu";
// import { baseColor } from "./config/Colors";
import { usePlayer } from "./context/playerContext";
import { SettingsModal } from "./UI/SettingsModal";
import { useState } from "react";



// путь к картинке фона
const backgroundImage = require("../assets/bg/main.png");

export default function Index() {
  const { player, setModalType } = usePlayer();
  const [volume, setVolume] = useState(1);


  return (
    // <View style={[styles.container, { backgroundColor: baseColor }]}>
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      
      {/* <Text style={styles.title}>
        Тут будет основное меню, которое появляется при запуске игры
      </Text> */}

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
    // </View>
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
