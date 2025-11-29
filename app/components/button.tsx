import { primaryTextColor } from "@/app/config/Colors";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  square?: boolean; // новый проп
  variant?: "pause"; // новый кастомный стиль
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  square = false,
  variant,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        square && styles.squareButton, // <-- добавлено, чтобы square работал
        disabled && styles.disabled,
        pressed && styles.pressed,
        variant === "pause" && styles.pauseButton, // <-- добавил, чтобы pauseButton работал
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }} // <-- Ripple только на Android
    >
      {/* Исправлено: убран внутренний View, текст теперь напрямую внутри Pressable, чтобы onPress срабатывал */}
      <Text
        style={[
          styles.text,
          variant === "pause" && styles.pauseText,
          disabled && styles.textDisabled,
        ]}
        numberOfLines={1} // <-- чтобы текст не “сползал”
      >
        {title}
      </Text>
    </Pressable>
  );
};

const BUTTON_WIDTH = 220; // фиксированная ширина всех кнопок

const styles = StyleSheet.create({
  button: {
    width: BUTTON_WIDTH, // все кнопки одинаковой ширины
    height: 50, // <-- добавлено фиксированное height для Android, чтобы текст центрировался
    backgroundColor: "rgba(0,0,0,0.45)", // полупрозрачная кнопка
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 },
    // transform оставляем, ripple на Android работает корректно
    transform: [{ translateY: 0 }],
    alignItems: "center", // текст по центру
    justifyContent: "center", // <-- добавлено, чтобы текст был по центру вертикально

    //настройка для андроид
    overflow: 'hidden',
    // тень для Android
    elevation: 4,
  },

  squareButton: {
    width: 45,
    height: 45,
    padding: 0,
    // borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  // Кастомный стиль "паузной" кнопки
  pauseButton: {
    backgroundColor: "#000",      // чёрный фон
    borderWidth: 2,
    borderColor: "#fff",          // белая рамка
    shadowOffset: { width: 2, height: 2 },
    width: 45,
    height: 45,
    justifyContent: "center", // <-- добавлено для вертикального центрирования текста
    alignItems: "center",     // <-- добавлено для вертикального центрирования текста
  },

  pauseInner: {
    padding: 0,
  },

  pauseText: {
    color: "#fff",
    fontSize: 26,
    textShadowColor: "transparent",
    textAlign: "center", // <-- добавлено, чтобы на Android текст был по центру
  },

  pressed: {
    shadowOffset: { width: 1, height: 1 },
    transform: [{ translateY: 2 }],
    opacity: 0.7,
  },

  inner: {
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center", // <-- оставлено для центрирования текста
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