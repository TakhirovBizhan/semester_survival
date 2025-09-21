import { Text, View } from "react-native";
import { Dialog } from "../components/dialog/dialog";
import ProgressBar from "../components/progressBar/progressBar";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ProgressBar title="HP" value={75} color="#ff0000" />
      <ProgressBar title="Happiness" value={40} color="#ffff00" max={100} />
      <Text>Тут сама игра</Text>
      <Dialog text={'Lorem ipsum dolum Lorem ipsum dolum Lorem ipsum dolum Lorem ipsum dolum Lorem ipsum dolum Lorem ipsum dolum Lorem ipsum dolumLorem ipsum dolumLorem ipsum dolum'} />
    </View>
  );
}
