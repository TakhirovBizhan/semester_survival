/**
 * ui/icon-symbol.tsx
 *
 * Fallback-реализация иконок для платформ, где SF Symbols недоступны
 * (Android, Web). Использует Material Icons из @expo/vector-icons.
 *
 * Важно: названия SF Symbols и MaterialIcons не совпадают — поэтому нужен MAPPING.
 * MAPPING содержит сопоставления имен SF -> MaterialIconName.
 *
 * Рекомендации:
 *  - При добавлении новой SF-иконки в проект — добавляй сопоставление в MAPPING.
 *  - Если для конкретного SF нет аналогичной MaterialIcon, можно:
 *    - подобрать похожую,
 *    - загрузить SVG и использовать его напрямую,
 *    - либо хранить платформо-специфические иконки.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Тип мэппинга: ключ — имя SF Symbol, значение — имя MaterialIcons
type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

// Автоматически выводим допустимые имена через keyof typeof MAPPING
type IconSymbolName = keyof typeof MAPPING;

/**
 * Здесь перечислены сопоставления популярных SF Symbols -> Material Icons.
 * Если нужно добавить новую иконку — допиши сюда.
 *
 * Пример: 'house.fill' (SF) => 'home' (Material)
 *
 * Замечание: некоторые SF имеют сложные названия/вариации, для них может не быть точного аналога.
 * В таких случаях выбирай наиболее похожую по смыслу.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * Компонент-иконка для платформ, где SF Symbols недоступны.
 *
 * Пропсы:
 *  - name: ключ из MAPPING (строго типизированный).
 *  - size: число — размер иконки.
 *  - color: цвет (может быть OpaqueColorValue для платформенных цветов).
 *  - style: стиль контейнера/текста.
 *  - weight: принимается для совместимости, но MaterialIcons не использует этот параметр.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Берём соответствие из MAPPING и рендерим MaterialIcons.
  // Если MAPPING[name] отсутствует, компилятор не даст этого случиться (типизация).
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}