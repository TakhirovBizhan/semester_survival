/**
 * hooks/use-theme-color.ts
 *
 * Утилита для получения цвета из палитры или из пропсов.
 * Позволяет компонентам запрашивать, например:
 *   const bg = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
 *
 * Поведение:
 * 1) берём текущую тему (useColorScheme)
 * 2) если в props передан цвет для текущей темы — вернуть его
 * 3) иначе — вернуть цвет из централизованной палитры Colors
 *
 * Это удобный паттерн: компоненты могут переопределять цвет локально,
 * но иметь sensible defaults из Constants.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// colorName — ключ, который присутствует и в Colors.light, и в Colors.dark
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Определяем текущую тему, fallback 'light'
  const theme = useColorScheme() ?? 'light';

  // Если пользователь передал значение через props для текущей темы — вернём его
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Иначе вернём значение из общей палитры
    return Colors[theme][colorName];
  }
}