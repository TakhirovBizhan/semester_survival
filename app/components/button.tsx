import { primaryTextColor } from "@/app/config/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  square?: boolean; // новый проп
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  square = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        square && styles.squareButton,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.text, disabled && styles.textDisabled]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const BUTTON_WIDTH = 220; // фиксированная ширина всех кнопок

const styles = StyleSheet.create({
  button: {
    width: BUTTON_WIDTH, // все кнопки одинаковой ширины
    backgroundColor: "rgba(0,0,0,0.45)", // полупрозрачная кнопка
    paddingVertical: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 },
    transform: [{ translateY: 0 }],
    alignItems: "center", // текст по центру
  },

  squareButton: {
    width: 0,   // фиксированная ширина
    height: 0,  // фиксированная высота
    padding: 0,  // убираем внутренние отступы
    borderRadius: 6, // чуть закругляем уголки
    right: 20,
  },

  pressed: {
    shadowOffset: { width: 1, height: 1 },
    transform: [{ translateY: 2 }],
    opacity: 0.7,
  },

  inner: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
  },

  text: {
    color: primaryTextColor,
    fontSize: 20,
    fontFamily: "monospace",
    textTransform: "uppercase",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },

  disabled: {
    backgroundColor: "rgba(50, 50, 50, 0.4)",
    shadowOffset: { width: 2, height: 2 },
  },

  textDisabled: {
    color: "#777",
  },
});
