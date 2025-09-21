import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DialogProps = {
  text: string;          // полный текст диалога
  speed?: number;        // скорость печати (мс на символ)
};

export const Dialog: React.FC<DialogProps> = ({ text, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState(""); // текущий отображаемый текст
  const [isTyping, setIsTyping] = useState(true);         // идёт ли печать

  useEffect(() => {
    // Если печатаем — запускаем интервал
    if (isTyping) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(text.slice(0, i)); // постепенно добавляем символы
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false); // закончили печатать
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [isTyping, text, speed]);

  const handlePress = () => {
    if (isTyping) {
      // если нажали во время печати — показать весь текст сразу
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      // если текст уже напечатан — в будущем тут можно вызвать переход к следующему диалогу
      console.log("Текст уже показан, тут можно вызвать next()");
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.box}>
        <Text style={styles.dialogText}>{displayedText}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end", // окно всегда внизу экрана
    },
    box: {
      backgroundColor: "rgba(0,0,0,0.8)", // полупрозрачный чёрный фон
      borderWidth: 4,                     // толстая рамка
      borderColor: "#fff",                 // белая рамка
      paddingVertical: 20,                 // вертикальные отступы
      paddingHorizontal: 24,               // горизонтальные отступы
      borderRadius: 0,                     // без скруглений (пиксельный стиль)
      width: "100%",                       // всегда на весь экран
      minHeight: 160,                      // фиксированная минимальная высота
      justifyContent: "center",            // текст по центру блока
      alignSelf: "stretch",                // растянуть по ширине контейнера
    },
    dialogText: {
      color: "#fff",              // белый текст
      fontSize: 20,               // чуть крупнее для читаемости
      fontFamily: "monospace",    // пиксельный эффект
      lineHeight: 26,             // высота строки для воздуха
      textShadowColor: "#000",    // лёгкая тень (эффект ретро)
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 0,
    },
  });