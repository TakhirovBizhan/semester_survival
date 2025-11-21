import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Button } from './components/button';
import { Menu } from "./components/menu";
import { baseColor } from "./config/Colors";
import { usePlayer } from "./context/playerContext";
import { SettingsModal } from "./UI/SettingsModal";
import { useState } from "react";




export default function Index() {
  const { player, setModalType } = usePlayer();
  const [volume, setVolume] = useState(1);


  return (
    <View style={[styles.container, { backgroundColor: baseColor }]}>
      <Text style={styles.title}>
        Тут будет основное меню, которое появляется при запуске игры
      </Text>

      <Menu>
        
        <Link href={`../day${Math.max(1, player.currentDay)}`}>
          <Button title={"Play"} />
        </Link>
        <Button title="Settings ⚙️" onPress={() => setModalType("settings")} />
        <Link href="../statistic">
          <Button title={"Stats"} />
        </Link>
        <Button title="Exit" disabled />
      </Menu>

      {/* Модальное окно настроек */}
      <SettingsModal volume={volume} setVolume={setVolume} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
