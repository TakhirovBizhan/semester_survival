/**
 * constants/theme.ts
 *
 * Централизованное место для цветов и шрифтов приложения.
 * - Colors.light / Colors.dark — основные палитры для тем.
 * - Fonts — платформо-специфичные семейства шрифтов.
 *
 * Почему это важно:
 *  - удобная поддержка тем (темная/светлая)
 *  - единая точка правки для брендинга/цветов
 *  - уменьшает риск разбросанных "магических" цветов по коду
 */

import { Platform } from 'react-native';

// Основной tint — используется для выделения (кнопки, ссылки, выбранный таб и т.п.)
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',               // основной текст
    background: '#fff',            // фон основного экрана
    tint: tintColorLight,          // акцентный цвет
    icon: '#687076',               // цвет нейтральных иконок
    tabIconDefault: '#687076',     // цвет таб-иконок по умолчанию
    tabIconSelected: tintColorLight, // цвет выбранного таба
  },
  dark: {
    text: '#ECEDEE',               // текст в тёмной теме
    background: '#151718',         // фон для тёмной темы
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Fonts — демонстрация, как можно подготовить "именованные" семейства.
 * Platform.select возвращает объект с конкретной конфигурацией для каждой платформы.
 *
 * Примечания:
 *  - Это не подключает кастомные шрифты — это лишь перечисление системных.
 *  - Для использования кастомных шрифтов: подключить их через expo-font и затем
 *    использовать имя шрифта в стиле.
 */
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    // Android / остальные платформы: используем общие названия
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    // Для web удобнее перечислить несколько fallback-шрифтов
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});