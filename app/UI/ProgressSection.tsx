import React from "react";
import { View } from "react-native";
import ProgressBar from "../components/progressBar";
import { usePlayer } from "../context/playerContext";

export const ProgressSection = () => {
  const { player } = usePlayer();

  return (
    <View style={{ marginBottom: 16 }}>
      <ProgressBar title="Счастье" value={player.happiness} color="#ffcc00" />
      <ProgressBar title="Учёба" value={player.academic} color="#fc2003" />
    </View>
  );
};
