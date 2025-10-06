import { accentColor } from "@/app/config/Colors";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type MenuProps = {     
  children: ReactNode; // любой контент внутри меню
};

export const Menu: React.FC<MenuProps> = ({ children }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.menuBox}>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // фон меню
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderWidth: 5,
    borderBlockColor: accentColor,
    borderRadius: 0,                    // пиксельный стиль           
    alignItems: "center",
  },
  content: {
    width: "100%",       // контент тянется по ширине
    alignItems: "center" // и по центру
  },
});