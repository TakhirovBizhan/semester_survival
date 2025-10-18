import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from './components/button';
import { Menu } from "./components/menu";
import { baseColor } from "./config/Colors";
import { usePlayer } from "./context/playerContext";

export default function Index() {
  const { player } = usePlayer();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: baseColor,
      }}
    >
      <Text>Тут будет основное меню, которое появляется при запуске игры</Text>
      <Menu>
      <Link href={`../day${player.currentDay}`}><Button title={"Play"}/></Link>
      <Link href="../settings"><Button title={"settings"}/></Link>
      <Link href="../statistic"><Button title={"stats"}/></Link>
      <Button title="Exit" disabled />
      </Menu>
    </View>
  );
}

