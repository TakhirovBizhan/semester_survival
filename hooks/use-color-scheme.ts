/**
 * hooks/use-color-scheme.ts
 *
 * Простой re-export хука useColorScheme из react-native.
 * Поскольку для web мы предоставляем свою реализацию (use-color-scheme.web.ts),
 * bundler (expo / metro / webpack) подставит нужный файл в зависимости от платформы.
 *
 * Это позволяет писать:
 *   import { useColorScheme } from '@/hooks/use-color-scheme';
 * и не думать о platform-specific имплементациях.
 */

// Прямой экспорт — мета: файл короткий, но нужна точка входа для платформенной замены
export { useColorScheme } from 'react-native';
