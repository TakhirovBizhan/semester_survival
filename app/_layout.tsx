// Это "главный Layout" для всего приложения.
// Здесь задаются общие настройки навигации, тема (светлая/тёмная),
// и подключается стек экранов (Stack Navigation).

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router'; // стековая навигация
import { StatusBar } from 'expo-status-bar'; // статусбар устройства
import 'react-native-reanimated'; // анимации

import { useColorScheme } from '@/hooks/use-color-scheme'; // хук для определения темы (dark/light)

export const unstable_settings = {
  anchor: '(tabs)', // указывает на то, что "главный экран" приложения — это папка (tabs)
};

export default function RootLayout() {
  const colorScheme = useColorScheme(); // dark или light

  return (
    // ThemeProvider переключает тему приложения
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Stack определяет переходы между экранами */}
      <Stack>
        {/* Вложенная навигация - папка (tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Экран modal.tsx будет отображаться как модальное окно */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>

      {/* Автоматический выбор стиля статусбара */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}