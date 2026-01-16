import { router } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";

export default function index() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f172a" }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#e5e7eb",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Правила игры
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#cbd5f5",
          lineHeight: 22,
          marginBottom: 20,
        }}
      >
        Это интерактивная визуальная новелла, где каждое твоё решение влияет на
        дальнейший ход событий и состояние персонажа.
      </Text>

      <Section title="🎮 Основная цель">
        Прожить студенческие дни так, чтобы сохранить баланс между учёбой и
        настроением.
      </Section>

      <Section title="🧠 2 составляющие игры">
        <Bullet>академическая успеваемость — твой успех в учебе</Bullet>
        <Bullet>Счастье — отражает моральное состояние</Bullet>
      </Section>

      <Section title="🗂 Выборы">
        В ключевые моменты тебе будут доступны варианты действий:
        <Bullet>Использовать интеллект</Bullet>
        <Bullet>Попробовать харизму</Bullet>
        <Bullet>Сдаться и ничего не делать</Bullet>
        Каждый вариант имеет последствия.
      </Section>

      <Section title="⚠️ Важно помнить">
        <Bullet>Неверные решения могут ухудшить характеристики</Bullet>
        <Bullet>Нет «правильного» пути — есть твой путь</Bullet>
        <Bullet>Историю всегда можно начать заново</Bullet>
      </Section>

      <Text
        style={{
          fontSize: 14,
          color: "#94a3b8",
          marginTop: 32,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Удачи. Тебе она понадобится.
      </Text>
      <Button title="Вернуться" onPress={() => router.push("/" as never)} />
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#e5e7eb",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#cbd5f5",
          lineHeight: 21,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 15,
        color: "#cbd5f5",
        lineHeight: 22,
        marginLeft: 8,
      }}
    >
      • {children}
    </Text>
  );
}
