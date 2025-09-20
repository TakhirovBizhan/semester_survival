/**
 * ui/icon-symbol.ios.tsx
 *
 * Версия компонента-иконки для iOS: использует нативный SF Symbols
 * через expo-symbols (SymbolView). Это даёт максимально нативный вид
 * и лучшую чёткость на iOS-устройствах.
 *
 * Примечания:
 *  - SF Symbols поддерживают разные веса (SymbolWeight), поэтому передаём weight.
 *  - SymbolView — нативный компонент, он может вести себя немного иначе чем векторные иконки.
 *  - На Android/вебе используется fallback (ui/icon-symbol.tsx).
 */

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

// Интерфейс пропсов — положенная сигнатура с дефолтами:
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name']; // имя SF Symbol
  size?: number;                 // общая ширина/высота иконки
  color: string;                 // tintColor для SymbolView
  style?: StyleProp<ViewStyle>;  // доп. стиль для контейнера иконки
  weight?: SymbolWeight;         // вес SF Symbol (regular, medium, bold и т.д.)
}) {
  // SymbolView принимает tintColor (цвет заливки) и name (идентификатор символа).
  // resizeMode 'scaleAspectFit' делает так, чтобы символ корректно масштабировался.
  // Мы задаём width/height одинаковые и передаём style сверху, чтобы можно было
  // переопределять размеры/отступы извне.
  return (
    <SymbolView
      weight={weight} // вес: влияет на толщину штрихов (iOS 13+)
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}