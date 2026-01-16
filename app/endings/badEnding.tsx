import { Link } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePlayer } from "../context/playerContext";

export default function GoodEnding() {
  const { startNewGame } = usePlayer();

  useEffect(() => {
    // Сбрасываем прогресс при попадании на концовку
    startNewGame();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🎉 Поздравляем! Вы успешно прошли игру! 🎉
      </Text>

      <Text style={styles.text}>
        Ваши усилия в учёбе помогли выжить и закончить всё на позитивной ноте.
      </Text>

      <Text style={styles.text}>разработкой занимались</Text>
      <Text style={styles.credits}>Хартумов Б.</Text>
      <Text style={styles.credits}>Тахиров Б.</Text>
      <Text style={styles.credits}>Смирнов А.</Text>
      <Text style={styles.credits}>Панктратов М.</Text>

      <Link href="/">
        <Text style={[styles.button, { marginTop: 30 }]}>
          Вернуться в главное меню
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  text: { color: "white", fontSize: 16, textAlign: "center", marginBottom: 24 },
  credits: { color: "white", fontSize: 14, textAlign: "center" },
  button: { color: "cyan", fontSize: 18, textAlign: "center" },
});
