import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { PlayerData } from "../storage/userStorage";
import Constants from "expo-constants";
import { AppState, AppStateStatus } from "react-native";

// Ключи для хранения
const DEVICE_ID_KEY = "firebase_deviceId";
const SYNC_QUEUE_KEY = "firebase_sync_queue";
const LAST_SYNC_KEY = "firebase_lastSync";
const SYNC_ENABLED_KEY = "firebase_sync_enabled";

// Интерфейс для элемента очереди синхронизации
interface SyncQueueItem {
  id: string;
  type: "sync";
  data: PlayerData;
  timestamp: number;
  retries: number;
}

// Интерфейс для данных в Firestore
interface FirestorePlayerData extends PlayerData {
  deviceId: string;
  gameVersion: string;
  lastSync: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// Типы статуса синхронизации
export type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline";

/**
 * Сервис для синхронизации прогресса с Firebase Firestore
 */
class FirebaseSyncService {
  private deviceId: string | null = null;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private syncEnabled: boolean = true;
  private statusListeners: ((status: SyncStatus) => void)[] = [];
  private appStateSubscription: any = null;
  private syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private lastSyncTime: number | null = null;

  /**
   * Инициализация сервиса
   */
  async initialize(): Promise<void> {
    try {
      // Проверка включена ли синхронизация
      const enabled = await AsyncStorage.getItem(SYNC_ENABLED_KEY);
      this.syncEnabled = enabled !== "false";

      if (!this.syncEnabled) {
        console.log("Синхронизация Firebase отключена");
        return;
      }

      // Проверка наличия Firebase
      if (!db) {
        console.warn("Firebase не инициализирован. Синхронизация отключена.");
        this.syncEnabled = false;
        return;
      }

      await this.getOrCreateDeviceId();
      await this.loadLastSyncTime();
      await this.setupAppStateListener();
      
      // Попытка синхронизации при старте
      await this.processQueue();
      
      console.log("Firebase Sync Service инициализирован");
    } catch (error) {
      console.error("Ошибка инициализации Firebase Sync:", error);
    }
  }

  /**
   * Получить или создать уникальный ID устройства
   */
  private async getOrCreateDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    try {
      let storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!storedId) {
        // Генерируем уникальный ID устройства
        storedId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(DEVICE_ID_KEY, storedId);
      }
      this.deviceId = storedId;
      return storedId;
    } catch (error) {
      console.error("Ошибка получения deviceId:", error);
      // Fallback ID
      this.deviceId = `fallback-${Date.now()}`;
      return this.deviceId;
    }
  }

  /**
   * Настройка слушателя AppState для синхронизации при возврате из фона
   */
  private async setupAppStateListener(): Promise<void> {
    if (this.appStateSubscription) return;

    this.appStateSubscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          // Приложение вернулось на передний план
          await this.processQueue();
        }
      }
    );
  }

  /**
   * Удалить слушатель AppState
   */
  cleanup(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Синхронизация прогресса игрока (с debounce)
   */
  async syncProgress(playerData: PlayerData, immediate: boolean = false): Promise<boolean> {
    if (!this.syncEnabled || !db) {
      return false;
    }

    // Очищаем предыдущий таймер debounce
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = null;
    }

    // Если не требуется немедленная синхронизация, используем debounce
    if (!immediate) {
      this.syncDebounceTimer = setTimeout(() => {
        this.performSync(playerData);
      }, 2000); // 2 секунды задержка
      return false;
    }

    return await this.performSync(playerData);
  }

  /**
   * Выполнить синхронизацию
   */
  private async performSync(playerData: PlayerData): Promise<boolean> {
    if (!db || !this.syncEnabled) {
      return false;
    }

    try {
      const deviceId = await this.getOrCreateDeviceId();
      this.updateStatus("syncing");

      // Валидация данных
      const validatedData = this.validatePlayerData(playerData);
      if (!validatedData) {
        throw new Error("Невалидные данные игрока");
      }

      // Подготовка данных для Firestore
      const firestoreData: Partial<FirestorePlayerData> = {
        deviceId,
        ...validatedData,
        gameVersion: Constants.expoConfig?.version || "1.0.0",
        updatedAt: serverTimestamp() as any,
      };

      // Получаем существующий документ для сохранения createdAt
      const docRef = doc(db, "user_progress", deviceId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Новый документ - добавляем createdAt
        firestoreData.createdAt = serverTimestamp() as any;
      }

      // Сохранение в Firestore
      await setDoc(docRef, firestoreData, { merge: true });

      // Обновляем время последней синхронизации
      const syncTime = Date.now();
      await AsyncStorage.setItem(LAST_SYNC_KEY, syncTime.toString());
      this.lastSyncTime = syncTime;
      this.updateStatus("success");

      console.log("Прогресс успешно синхронизирован с Firebase");
      return true;
    } catch (error: any) {
      console.error("Ошибка синхронизации прогресса:", error);
      this.updateStatus("error");

      // Если ошибка сети, добавляем в очередь
      if (error.code === "unavailable" || error.message?.includes("network")) {
        await this.addToQueue(playerData);
        this.updateStatus("offline");
      }

      return false;
    }
  }

  /**
   * Валидация данных игрока
   */
  private validatePlayerData(data: PlayerData): PlayerData | null {
    try {
      // Проверка обязательных полей
      if (
        typeof data.currentDay !== "number" ||
        typeof data.happiness !== "number" ||
        typeof data.academic !== "number"
      ) {
        return null;
      }

      // Проверка диапазонов
      if (
        data.happiness < 0 ||
        data.happiness > 100 ||
        data.academic < 0 ||
        data.academic > 100
      ) {
        return null;
      }

      // Проверка choices
      if (!data.choices || typeof data.choices !== "object") {
        return null;
      }

      return data;
    } catch (error) {
      console.error("Ошибка валидации данных:", error);
      return null;
    }
  }

  /**
   * Добавить элемент в очередь синхронизации
   */
  private async addToQueue(data: PlayerData): Promise<void> {
    try {
      const queue = await this.getQueue();
      const newItem: SyncQueueItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "sync",
        data,
        timestamp: Date.now(),
        retries: 0,
      };
      queue.push(newItem);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      console.log("Добавлено в очередь синхронизации. Размер очереди:", queue.length);
    } catch (error) {
      console.error("Ошибка добавления в очередь:", error);
    }
  }

  /**
   * Получить очередь синхронизации
   */
  private async getQueue(): Promise<SyncQueueItem[]> {
    try {
      const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error("Ошибка получения очереди:", error);
      return [];
    }
  }

  /**
   * Обработать очередь синхронизации
   */
  async processQueue(): Promise<void> {
    if (!this.syncEnabled || !db || this.syncInProgress) return;

    this.syncInProgress = true;
    try {
      const queue = await this.getQueue();
      if (queue.length === 0) {
        this.syncInProgress = false;
        return;
      }

      console.log(`Обработка очереди синхронизации: ${queue.length} элементов`);

      const processedItems: string[] = [];
      const updatedQueue: SyncQueueItem[] = [];

      for (const item of queue) {
        // Ограничение попыток (максимум 5)
        if (item.retries >= 5) {
          console.warn(`Элемент ${item.id} превысил лимит попыток, удаляется из очереди`);
          processedItems.push(item.id);
          continue;
        }

        try {
          const success = await this.performSync(item.data);
          if (success) {
            processedItems.push(item.id);
          } else {
            // Увеличиваем счетчик попыток
            item.retries += 1;
            updatedQueue.push(item);
          }
        } catch (error) {
          console.error(`Ошибка синхронизации элемента ${item.id}:`, error);
          item.retries += 1;
          updatedQueue.push(item);
        }
      }

      // Сохраняем обновленную очередь
      if (updatedQueue.length > 0) {
        await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
      } else {
        await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
      }

      if (processedItems.length > 0) {
        console.log(`Успешно синхронизировано ${processedItems.length} элементов`);
        await this.updateLastSyncTime();
      }
    } catch (error) {
      console.error("Ошибка обработки очереди:", error);
      this.updateStatus("error");
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Обновить время последней синхронизации
   */
  private async updateLastSyncTime(): Promise<void> {
    try {
      const syncTime = Date.now();
      await AsyncStorage.setItem(LAST_SYNC_KEY, syncTime.toString());
      this.lastSyncTime = syncTime;
    } catch (error) {
      console.error("Ошибка обновления времени синхронизации:", error);
    }
  }

  /**
   * Загрузить время последней синхронизации
   */
  private async loadLastSyncTime(): Promise<void> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      this.lastSyncTime = timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error("Ошибка загрузки времени синхронизации:", error);
    }
  }

  /**
   * Получить время последней синхронизации
   */
  async getLastSyncTime(): Promise<number | null> {
    if (this.lastSyncTime === null) {
      await this.loadLastSyncTime();
    }
    return this.lastSyncTime;
  }

  /**
   * Загрузить прогресс с сервера
   */
  async loadProgress(): Promise<PlayerData | null> {
    if (!db || !this.syncEnabled) return null;

    try {
      const deviceId = await this.getOrCreateDeviceId();
      const docRef = doc(db, "user_progress", deviceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FirestorePlayerData;
        // Убираем служебные поля
        const { deviceId: _, gameVersion, lastSync, createdAt, updatedAt, ...playerData } = data;
        return playerData as PlayerData;
      }

      return null;
    } catch (error) {
      console.error("Ошибка загрузки прогресса с сервера:", error);
      return null;
    }
  }

  /**
   * Получить статистику синхронизации
   */
  async getSyncStats(): Promise<{
    queueLength: number;
    lastSync: number | null;
    deviceId: string | null;
    enabled: boolean;
  }> {
    const queue = await this.getQueue();
    const deviceId = await this.getOrCreateDeviceId();

    return {
      queueLength: queue.length,
      lastSync: this.lastSyncTime,
      deviceId,
      enabled: this.syncEnabled,
    };
  }

  /**
   * Очистить очередь синхронизации
   */
  async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
      console.log("Очередь синхронизации очищена");
    } catch (error) {
      console.error("Ошибка очистки очереди:", error);
    }
  }

  /**
   * Включить/выключить синхронизацию
   */
  async setSyncEnabled(enabled: boolean): Promise<void> {
    this.syncEnabled = enabled;
    await AsyncStorage.setItem(SYNC_ENABLED_KEY, enabled.toString());
    if (enabled) {
      await this.processQueue();
    }
  }

  /**
   * Получить статус синхронизации
   */
  getStatus(): SyncStatus {
    if (!this.syncEnabled) return "idle";
    if (this.syncInProgress) return "syncing";
    // Здесь можно добавить проверку сети через NetInfo
    return "idle";
  }

  /**
   * Подписаться на изменения статуса
   */
  onStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Обновить статус и уведомить слушателей
   */
  private updateStatus(status: SyncStatus): void {
    this.statusListeners.forEach((listener) => listener(status));
  }

  /**
   * Принудительная синхронизация (без debounce)
   */
  async forceSync(playerData: PlayerData): Promise<boolean> {
    return await this.syncProgress(playerData, true);
  }
}

// Экспорт singleton экземпляра
export const firebaseSync = new FirebaseSyncService();

