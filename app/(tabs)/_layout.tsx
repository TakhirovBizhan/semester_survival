/**
 * app/(tabs)/_layout.tsx
 *
 * Layout для вкладочной навигации (Tabs) в Expo Router.
 * Здесь определяются экраны, иконки, а также цвет выбранного таба.
 *
 * Основная идея:
 *  - файл `_layout.tsx` внутри папки (tabs) означает, что все дочерние файлы
 *    будут отображаться внутри этого набора вкладок.
 *  - Expo Router автоматически поймёт маршруты: (tabs)/index -> "/", (tabs)/explore -> "/explore"
 *
 * Замечания по производительности:
 *  - Компоненты и иконки не должны рендерить тяжелую логику в top-level (лучше lazy load).
 *  - Если появится много табов — можно вынести иконки в отдельный компонент,
 *    или использовать React.memo.
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  // Получаем текущую тему для выбора правильного tint- цвета таба.
  const colorScheme = useColorScheme();

  return (
    <Tabs
      // screenOptions применяется ко всем дочерним таб-скринам
      screenOptions={{
        // Цвет активной вкладки берём из Colors под текущую тему.
        // Если colorScheme === undefined — используем 'light' через ??.
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // мы скрываем шапку для таб-экранов (часто делают так для мобильных)
      }}
    >
      {/* Первый таб — Home (index) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // tabBarIcon — функция, возвращающая иконку. color автоматически подставляется навигацией.
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* Второй таб — Explore */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
} 