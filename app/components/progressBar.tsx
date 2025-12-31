import { primaryTextColor } from "@/app/config/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  title?: string;       // заголовок (например, "HP" или "Happiness")
  value: number;        // текущее значение (0-100)
  max?: number;         // максимальное значение (по умолчанию 100)
}

// ----------------------------
// ФУНКЦИЯ ДИНАМИЧЕСКОГО ГРАДИЕНТНОГО ЦВЕТА
// ----------------------------
const getGradientColor = (value: number) => {
  const v = Math.max(0, Math.min(100, value));

  if (v <= 20) return "#ff0000";      // красный
  if (v <= 40) return "#ff6600";      // оранжевый
  if (v <= 70) return "#ffff00";      // желтый
  return "#00ff00";                   // зеленый
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  value,
  max = 100,
}) => {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Фон */}
      <View style={styles.barBackground}>
        {/* Заполненная часть */}
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: getGradientColor(value),
            },
          ]}
        />
      </View>

      <Text style={styles.value}>
        {value}/{max}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },

  title: {
    color: primaryTextColor,
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 4,
  },

  barBackground: {
    width: 100,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.25)", // полупрозрачный фон
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
  },

  value: {
    color: primaryTextColor,
    fontFamily: "monospace",
    fontSize: 14,
    marginTop: 2,
  },
});

export default ProgressBar;
