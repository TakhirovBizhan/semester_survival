// Экран "модального окна".
// Его можно вызвать из навигации (например, из главного экрана).
// В Expo Router любое имя файла = новый экран.
// Этот экран будет доступен по маршруту "/modal".

import { Link } from 'expo-router'; // Позволяет переходить между экранами
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text'; // Кастомный компонент текста (темная/светлая тема)
import { ThemedView } from '@/components/themed-view'; // Кастомный контейнер (темная/светлая тема)

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Заголовок */}
      <ThemedText type="title">This is a modal</ThemedText>

      {/* Ссылка на главный экран */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

// Стили для экрана
const styles = StyleSheet.create({
  container: {
    flex: 1, // экран занимает всю высоту
    alignItems: 'center', // выравнивание по центру (по горизонтали)
    justifyContent: 'center', // выравнивание по центру (по вертикали)
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});