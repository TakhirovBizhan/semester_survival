import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
// import { accentColor } from "../config/Colors";

type MenuProps = {     
  children: ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ children }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.menuBox}>
        <View >
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  menuBox: {
    // backgroundColor: "rgba(0, 0, 0, 0.55)",  // Тёмный полупрозрачный фон
    // padding: 8,

    // // Пиксельная толстая рамка
    // borderWidth: 4,
    // borderColor: accentColor,
    // borderRadius: 0,
  },

  // Дополнительный слой для “пиксельной глубины”
  // innerBorder: {
  //   borderWidth: 3,
  //   borderColor: "#ffffff",
  //   paddingVertical: 28,
  //   paddingHorizontal: 36,
  //   borderRadius: 0,
  // },

  content: {
    width: "100%",
    alignItems: "center",
  },
});
