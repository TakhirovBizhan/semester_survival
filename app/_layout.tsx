import { Stack } from "expo-router";
import { PlayerProvider } from "./context/playerContext";

export default function RootLayout() {
  return <PlayerProvider><Stack /></PlayerProvider>;
}
