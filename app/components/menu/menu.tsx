import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type MenuProps = {
  title?: string;      // заголовок меню
  children: ReactNode; // любой контент внутри меню
};

export const Menu: React.FC<MenuProps> = ({ title = "Menu", children }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.menuBox}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",           // центрируем по вертикали
    alignItems: "center",               // центрируем по горизонтали
  },
  menuBox: {
    backgroundColor: "rgba(0,0,0,0.9)", // фон меню
    borderWidth: 4,
    borderColor: "#fff",                // белая рамка
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 0,                    // пиксельный стиль
    width: "80%",                       // ширина меню
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "monospace",
    marginBottom: 20,
    textTransform: "uppercase",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  content: {
    width: "100%",       // контент тянется по ширине
    alignItems: "center" // и по центру
  },
});