/**
 * hooks/use-color-scheme.web.ts
 *
 * Специальная реализация для web, чтобы поддержать корректную статическую
 * отрисовку (SSR) / hydration-процессы: при server-side render начальное
 * значение может быть неизвестно, поэтому мы ждём first-hydration.
 *
 * Механика:
 *  - hasHydrated флаг показывает, что компонент уже отрисовался на клиенте
 *  - пока hasHydrated === false — возвращаем 'light', чтобы избежать "мигания"
 *    (в некоторых приложениях это помогает, но если нужен точный режим, можно вернуть undefined)
 *
 * Альтернативы:
 *  - использовать CSS media query `prefers-color-scheme` напрямую
 *  - возвращать undefined и обрабатывать это в ThemeProvider
 */

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  // Флаг, указывающий, что мы уже "гидратировались" на клиенте.
  const [hasHydrated, setHasHydrated] = useState(false);

  // native-реализация react-native подставляет значение для web (через react-native-web),
  // но при SSR это может быть неактуально до клиента.
  useEffect(() => {
    setHasHydrated(true); // после первого mount — считаем, что hydration завершён
  }, []);

  const colorScheme = useRNColorScheme();

  // Если клиент ещё не гидратировался — вернём безопасный вариант 'light'.
  // Важно: это сделано, чтобы избежать неожиданных изменений UI при hydratation.
  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}