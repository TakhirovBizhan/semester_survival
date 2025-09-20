/**
 * ui/collapsible.tsx
 *
 * Простая раскрывающаяся секция (collapsible).
 * Используется для сворачиваемого списка/FAQ/демонстраций настроек — там, где
 * есть заголовок и содержимое, которое показывается по клику.
 *
 * Очень простой компонент: хранит локальное состояние isOpen.
 * Доступные улучшения:
 *  - добавить анимацию раскрытия (LayoutAnimation или Reanimated)
 *  - добавить поддержку controlled-mode (передавать isOpen и onToggle снаружи)
 *  - aria-атрибуты и тест-идентификаторы для тестирования
 */

import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Поддерживаемая сигнатура: children + title
// PropsWithChildren даёт тип для children, а title — обязательный строковый проп
export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  // Локальный стейт: открыт ли коллапс
  // Для простоты мы делаем его внутренним — если потребуется синхронизация
  // с внешним состоянием, можно добавить controlled-пропы (isOpen/onToggle).
  const [isOpen, setIsOpen] = useState(false);

  // Получаем текущую тему ('light' | 'dark' | undefined), ставим fallback 'light'
  const theme = useColorScheme() ?? 'light';

  return (
    // <ThemedView> — контейнер, автоматически подбирающий фон по теме.
    <ThemedView>
      {/* Заголовочная область, реагирует на нажатие */}
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)} // переключаем состояние
        activeOpacity={0.8} // немного затемняем при нажатии
      >
        {/* Иконка-стрелка: поворачивается на 90deg, когда открыт */}
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          // Цвет иконки берём из общей палитры. Обратите внимание:
          // Colors.light.icon / Colors.dark.icon — это нейтральные цвета для иконок.
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          // Небольшая трансформация для поворота стрелки при открытии.
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        {/* Заголовок секции. Используем семиболд стиль. */}
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>

      {/* Контент показываем только когда isOpen === true.
          Это простая проверка, которая полностью размонтирует контент при закрытии.
          Если нужно сохранять внутреннее состояние children, используйте visibility
          + height- анимации вместо условного рендера. */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row', // иконка + текст в одной строке
    alignItems: 'center',
    gap: 6, // интервал между иконкой и текстом (поддерживается на RN >= 0.71; если старый RN — заменить marginRight)
  },
  content: {
    marginTop: 6,
    marginLeft: 24, // визуально отступаем от заголовка (под иконку)
  },
});