import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function BadEnding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💀 Вам не удалось выжить 💀</Text>
      <Text style={styles.text}>К сожалению, недостаток учёбы привёл к трагическому исходу.</Text>

      {/* Титры */}
      <Text style={styles.credits}>Разработка: Ваше имя</Text>
      <Text style={styles.credits}>Дизайн: Ваше имя</Text>
      <Text style={styles.credits}>Тестирование: Ваше имя</Text>

      <Link href="/">
        <Text style={[styles.button, { marginTop: 30 }]}>Вернуться в главное меню</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "black" },
  title: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  text: { color: "white", fontSize: 16, textAlign: "center", marginBottom: 24 },
  credits: { color: "white", fontSize: 14, textAlign: "center" },
  button: { color: "cyan", fontSize: 18, textAlign: "center" },
});
