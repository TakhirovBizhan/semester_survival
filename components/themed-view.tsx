// Обёртка над обычным <View>, которая автоматически подбирает цвет фона
// в зависимости от текущей темы (светлая / тёмная).
// Можно дополнительно передать свои цвета через props.

import { useThemeColor } from '@/hooks/use-theme-color';
import { View, type ViewProps } from 'react-native';

// Тип пропсов: обычные ViewProps + кастомные цвета для light/dark
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Берём цвет из темы
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Рендерим View с темным/светлым фоном
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}