import { primaryTextColor } from "@/app/config/Colors";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DialogProps = {
  text: string;
  speed?: number;
  onComplete?: () => void; // вызывается, когда печать завершена
  onNext?: () => void;     // переход к следующему диалогу
};

export const Dialog: React.FC<DialogProps> = ({ text, speed = 40, onComplete, onNext }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.(); // уведомляем, что закончили печать
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  const handlePress = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onNext?.(); // переход к следующему диалогу
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
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "rgba(0,0,0,0.8)",
    borderWidth: 4,
    borderColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 0,
    width: "100%",
    minHeight: 160,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  dialogText: {
    color: primaryTextColor,
    fontSize: 20,
    fontFamily: "monospace",
    lineHeight: 26,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});