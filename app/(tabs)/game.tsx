import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function GameScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>🎓 Survival Game</Text>

      <Button title="Пойти на пару" onPress={() => alert("Ты пошёл на пару")} />
      <Button title="Прогулять пару" onPress={() => alert("Ты прогулял пару")} />

      <Button title="Назад" onPress={() => router.back()} />
    </View>
  );
}