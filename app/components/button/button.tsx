import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

// Типы пропсов кнопки
type ButtonProps = {
  title: string;        // текст, который будет отображаться на кнопке
  onPress?: () => void; // функция, которая вызывается при нажатии
  disabled?: boolean;   // состояние: активна или заблокирована
};

// Компонент кнопки
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false, // по умолчанию кнопка активна
}) => {
  return (
    <Pressable
      // массив стилей: базовый + если кнопка заблокирована
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled} // блокировка нажатия
    >
      <Text
        // массив стилей для текста: базовый + стиль для "disabled"
        style={[styles.text, disabled && styles.textDisabled]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

// Стили кнопки
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2d2d2d", // фон
    borderWidth: 4,             // толщина границы
    borderColor: "#000",        // цвет границы
    paddingVertical: 10,        // внутренние отступы по вертикали
    paddingHorizontal: 16,      // внутренние отступы по горизонтали
    alignItems: "center",       // выравнивание по горизонтали
    justifyContent: "center",   // выравнивание по вертикали
    borderRadius: 0,            // углы без скругления (пиксельный стиль)
  },
  text: {
    color: "#fff",             // белый цвет текста
    fontSize: 16,              // размер шрифта
    fontWeight: "bold",        // жирный
    fontFamily: "monospace",   // моноширинный шрифт (эффект пиксельного)
    textTransform: "uppercase" // все буквы капсом
  },
  disabled: {
    backgroundColor: "#555", // серый фон, если кнопка выключена
    borderColor: "#333",     // тёмная граница
  },
  textDisabled: {
    color: "#aaa", // тусклый текст
  },
});