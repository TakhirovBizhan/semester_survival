import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

// import { usePlayer } from "../context/playerContext";


export default function GoodEnding() {

    //   const { setPlayer } = usePlayer();



  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Поздравляем! Вы успешно прошли игру! 🎉</Text>
      <Text style={styles.text}>Ваши усилия в учёбе помогли выжить и закончить всё на позитивной ноте.</Text>

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
