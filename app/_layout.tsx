import { Stack } from "expo-router";
import { PlayerProvider } from "./context/playerContext";

export default function RootLayout() {
  // Убрал Хедер с помощью опции
  return <PlayerProvider><Stack screenOptions={{ headerShown: false }} /></PlayerProvider>;
}
