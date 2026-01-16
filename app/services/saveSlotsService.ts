import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, query, where, orderBy, Timestamp, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { PlayerData } from "../storage/userStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Интерфейс для сохранения
export interface GameSave {
  id: string;
  name: string;
  playerData: PlayerData;
  deviceId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Ключ для хранения deviceId
const DEVICE_ID_KEY = "firebase_deviceId";

/**
 * Сервис для управления сохранениями игры (CRUD операции)
 */
class SaveSlotsService {
  private deviceId: string | null = null;

  /**
   * Получить или создать deviceId
   */
  private async getDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    try {
      let storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!storedId) {
        storedId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(DEVICE_ID_KEY, storedId);
      }
      this.deviceId = storedId;
      return storedId;
    } catch (error) {
      console.error("Ошибка получения deviceId:", error);
      this.deviceId = `fallback-${Date.now()}`;
      return this.deviceId;
    }
  }

  /**
   * CREATE - Создать новое сохранение
   */
  async createSave(name: string, playerData: PlayerData): Promise<GameSave> {
    if (!db) {
      throw new Error("Firebase не инициализирован");
    }

    try {
      const deviceId = await this.getDeviceId();
      const saveId = `save-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docRef = doc(db, "game_saves", `${deviceId}_${saveId}`);

      const saveData: Omit<GameSave, "id"> & { createdAt: any; updatedAt: any } = {
        name,
        playerData,
        deviceId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, saveData);

      const newSave: GameSave = {
        id: saveId,
        name,
        playerData,
        deviceId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Сохранение создано:", newSave.id);
      return newSave;
    } catch (error) {
      console.error("Ошибка создания сохранения:", error);
      throw error;
    }
  }

  /**
   * READ - Получить все сохранения текущего устройства
   */
  async getAllSaves(): Promise<GameSave[]> {
    if (!db) {
      console.warn("Firebase не инициализирован");
      return [];
    }

    try {
      const deviceId = await this.getDeviceId();
      const savesRef = collection(db, "game_saves");
      
      // Запрос всех сохранений для текущего устройства
      // Используем только where, без orderBy, чтобы не требовался индекс
      const q = query(
        savesRef,
        where("deviceId", "==", deviceId)
      );

      const querySnapshot = await getDocs(q);
      const saves: GameSave[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Извлекаем saveId из document ID (формат: deviceId_saveId)
        const docId = docSnap.id;
        const saveId = docId.replace(`${deviceId}_`, "");

        const save: GameSave = {
          id: saveId,
          name: data.name,
          playerData: data.playerData as PlayerData,
          deviceId: data.deviceId,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        };

        saves.push(save);
      });

      // Сортируем локально по дате обновления (новые первыми)
      saves.sort((a, b) => {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : (a.updatedAt as any).toMillis?.() || 0;
        const dateB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : (b.updatedAt as any).toMillis?.() || 0;
        return dateB - dateA; // Сортировка по убыванию (новые первыми)
      });

      console.log(`Загружено ${saves.length} сохранений`);
      return saves;
    } catch (error) {
      console.error("Ошибка загрузки сохранений:", error);
      return [];
    }
  }

  /**
   * READ - Получить одно сохранение по ID
   */
  async getSaveById(saveId: string): Promise<GameSave | null> {
    if (!db) {
      return null;
    }

    try {
      const deviceId = await this.getDeviceId();
      const docRef = doc(db, "game_saves", `${deviceId}_${saveId}`);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: saveId,
        name: data.name,
        playerData: data.playerData as PlayerData,
        deviceId: data.deviceId,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
      };
    } catch (error) {
      console.error("Ошибка загрузки сохранения:", error);
      return null;
    }
  }

  /**
   * UPDATE - Обновить имя сохранения
   */
  async updateSaveName(saveId: string, newName: string): Promise<boolean> {
    if (!db) {
      return false;
    }

    try {
      const deviceId = await this.getDeviceId();
      const docRef = doc(db, "game_saves", `${deviceId}_${saveId}`);

      await updateDoc(docRef, {
        name: newName,
        updatedAt: serverTimestamp(),
      });

      console.log("Имя сохранения обновлено:", saveId);
      return true;
    } catch (error) {
      console.error("Ошибка обновления имени сохранения:", error);
      return false;
    }
  }

  /**
   * UPDATE - Обновить данные сохранения
   */
  async updateSave(saveId: string, playerData: PlayerData): Promise<boolean> {
    if (!db) {
      return false;
    }

    try {
      const deviceId = await this.getDeviceId();
      const docRef = doc(db, "game_saves", `${deviceId}_${saveId}`);

      await updateDoc(docRef, {
        playerData,
        updatedAt: serverTimestamp(),
      });

      console.log("Сохранение обновлено:", saveId);
      return true;
    } catch (error) {
      console.error("Ошибка обновления сохранения:", error);
      return false;
    }
  }

  /**
   * DELETE - Удалить сохранение
   */
  async deleteSave(saveId: string): Promise<boolean> {
    if (!db) {
      return false;
    }

    try {
      const deviceId = await this.getDeviceId();
      const docRef = doc(db, "game_saves", `${deviceId}_${saveId}`);
      await deleteDoc(docRef);

      console.log("Сохранение удалено:", saveId);
      return true;
    } catch (error) {
      console.error("Ошибка удаления сохранения:", error);
      return false;
    }
  }
}

// Экспорт singleton экземпляра
export const saveSlotsService = new SaveSlotsService();

