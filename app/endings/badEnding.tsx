import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BadEnding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💀 Вам не удалось выжить 💀</Text>

      {/* Титры */}
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
