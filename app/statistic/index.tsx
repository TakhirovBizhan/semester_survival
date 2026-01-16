import { router } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";
import { usePlayer } from "../context/playerContext";

export default function StatsScreen() {
  const { player, isLoadingProgress } = usePlayer();

  if (isLoadingProgress) {
    return (
      <Centered>
        <Text style={{ color: "#94a3b8", fontSize: 16 }}>
          Загрузка статистики…
        </Text>
      </Centered>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#020617" }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#e5e7eb",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Статистика персонажа
      </Text>

      <Card>
        <Label>Имя</Label>
        <Value>{player.name || "Безымянный герой"}</Value>
      </Card>

      <Card>
        <Label>Характеристики</Label>

        <StatRow title="Интеллект" value={player.academic} />
        <StatRow title="Счастье" value={player.happiness} />
      </Card>

      <Card>
        <Label>Выборы</Label>

        <ChoiceRow title="Интеллект" value={player.choices.intellect} />
        <ChoiceRow title="Харизма" value={player.choices.charisma} />
        <ChoiceRow title="Сдаться" value={player.choices.giveUp} />
      </Card>

      <Card>
        <Label>Последнее решение</Label>
        <Value>
          {player.lastChoice
            ? player.lastChoice === "giveUp"
              ? "Сдаться"
              : player.lastChoice === "intellect"
              ? "Интеллект"
              : player.lastChoice === "charisma"
              ? "Харизма"
              : player.lastChoice
            : "—"}
        </Value>

        {player.lastChoice && player.lastChoice !== "giveUp" && (
          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              color: player.isLastChoiceSuccess ? "#22c55e" : "#ef4444",
            }}
          >
            {player.isLastChoiceSuccess ? "Успех" : "Провал"}
          </Text>
        )}
      </Card>

      <Text
        style={{
          marginTop: 32,
          marginBottom: 32,
          fontSize: 14,
          color: "#64748b",
          textAlign: "center",
        }}
      >
        Все данные сохраняются автоматически
      </Text>
      <Button title="Вернуться" onPress={() => router.push("/" as never)} />
    </ScrollView>
  );
}

/* ================== */
/* UI helpers */
/* ================== */

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#020617",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#1e293b",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      {children}
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 14,
        color: "#94a3b8",
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Text>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: "#e5e7eb",
      }}
    >
      {children}
    </Text>
  );
}

function StatRow({ title, value }: { title: string; value: number }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ color: "#e5e7eb", fontSize: 15 }}>
        {title}: {value}/100
      </Text>
    </View>
  );
}

function ChoiceRow({ title, value }: { title: string; value: number }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ color: "#cbd5f5", fontSize: 15 }}>
        {title}: {value}
      </Text>
    </View>
  );
}
