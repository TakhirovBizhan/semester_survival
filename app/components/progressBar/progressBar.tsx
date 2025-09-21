import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  title?: string;       // заголовок (например, "HP" или "Happiness")
  value: number;        // текущее значение (0-100)
  color?: string;       // цвет полоски
  max?: number;         // максимальное значение (по умолчанию 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  value,
  color = "#00ff00",
  max = 100,
}) => {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.value}>{value}/{max}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 4,
  },
  barBackground: {
    width: "100%",
    height: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#222",
    borderRadius: 0, // пиксельный стиль
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
  value: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 14,
    marginTop: 2,
  },
});

export default ProgressBar;