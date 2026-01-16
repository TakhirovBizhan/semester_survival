# Правила безопасности Firestore

## Проблема
Ошибка "Missing or insufficient permissions" возникает, когда правила Firestore не разрешают операции чтения/записи.

## Решение

### Шаг 1: Откройте Firebase Console
1. Перейдите на https://console.firebase.google.com/
2. Выберите ваш проект `semester-survival`
3. Перейдите в **Firestore Database**
4. Откройте вкладку **Rules** (Правила)

### Шаг 2: Обновите правила безопасности

Замените существующие правила на следующие:

#### Для разработки (НЕБЕЗОПАСНО для продакшена):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Правила для синхронизации прогресса
    match /user_progress/{deviceId} {
      allow read, write: if true; // Только для разработки!
    }
    
    // Правила для сохранений игры
    match /game_saves/{saveId} {
      allow read, write: if true; // Только для разработки!
    }
  }
}
```

#### Для продакшена (БЕЗОПАСНО):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Правила для синхронизации прогресса
    match /user_progress/{deviceId} {
      // Разрешить только чтение/запись своего deviceId
      allow read, write: if request.resource.data.deviceId == deviceId;
    }
    
    // Правила для сохранений игры
    match /game_saves/{saveId} {
      // Разрешить только чтение/запись сохранений своего deviceId
      allow read, write: if request.resource.data.deviceId == resource.data.deviceId;
      
      // Разрешить создание новых сохранений
      allow create: if request.resource.data.deviceId != null;
    }
  }
}
```

### Шаг 3: Опубликуйте правила
1. Нажмите кнопку **Publish** (Опубликовать)
2. Подождите несколько секунд, пока правила применятся

### Шаг 4: Проверьте работу
1. Попробуйте создать сохранение в игре
2. Если ошибка сохраняется, подождите 1-2 минуты (правила могут применяться с задержкой)

## Структура данных

### Коллекция: `user_progress`
- Документ ID: `{deviceId}`
- Поля: `deviceId`, `playerData`, `gameVersion`, `lastSync`, `createdAt`, `updatedAt`

### Коллекция: `game_saves`
- Документ ID: `{deviceId}_{saveId}`
- Поля: `id`, `name`, `playerData`, `deviceId`, `createdAt`, `updatedAt`

## Важные замечания

⚠️ **Для разработки** можно использовать правила `allow read, write: if true;`, но это НЕБЕЗОПАСНО для продакшена!

✅ **Для продакшена** обязательно используйте правила с проверкой `deviceId`, чтобы пользователи не могли читать/изменять чужие данные.

## Альтернативное решение (если правила не работают)

Если после обновления правил ошибка сохраняется:

1. Проверьте, что вы используете правильный проект Firebase
2. Убедитесь, что Firestore Database создана и включена
3. Проверьте конфигурацию в `app/config/firebase.ts`
4. Попробуйте перезапустить приложение

## Отладка

Если нужно проверить, какие правила применяются:

1. В Firebase Console → Firestore → Rules
2. Нажмите "Rules Playground" (Игровая площадка правил)
3. Выберите операцию (read/write)
4. Укажите путь: `game_saves/device-123_save-456`
5. Нажмите "Run" для проверки

