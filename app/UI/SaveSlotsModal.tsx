import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert, ScrollView, ActivityIndicator, Platform } from "react-native";
import { ModalWindow } from "../components/modalWindow";
import { Button } from "../components/button";
import { usePlayer } from "../context/playerContext";
import { saveSlotsService, GameSave } from "../services/saveSlotsService";
import { primaryTextColor } from "../config/Colors";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";

export const SaveSlotsModal: React.FC = () => {
  const { modalType, setModalType, player, setPlayer, setIndex, updatePlayer } = usePlayer();
  const router = useRouter();
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newSaveName, setNewSaveName] = useState("");

  const isVisible = modalType === "saveSlots";

  // Загрузка сохранений
  const loadSaves = useCallback(async () => {
    setLoading(true);
    try {
      const loadedSaves = await saveSlotsService.getAllSaves();
      setSaves(loadedSaves);
    } catch (error) {
      console.error("Ошибка загрузки сохранений:", error);
      Alert.alert("Ошибка", "Не удалось загрузить сохранения");
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем сохранения при открытии модалки
  useEffect(() => {
    if (isVisible) {
      loadSaves();
    }
  }, [isVisible, loadSaves]);

  // Создание нового сохранения
  const handleCreateSave = async () => {
    if (!newSaveName.trim()) {
      Alert.alert("Ошибка", "Введите имя сохранения");
      return;
    }

    setCreating(true);
    try {
      await saveSlotsService.createSave(newSaveName.trim(), player);
      setNewSaveName("");
      await loadSaves();
      Alert.alert("Успех", "Сохранение создано!");
    } catch (error) {
      console.error("Ошибка создания сохранения:", error);
      Alert.alert("Ошибка", "Не удалось создать сохранение");
    } finally {
      setCreating(false);
    }
  };

  // Загрузка сохранения
  const handleLoadSave = async (save: GameSave) => {
    console.log("handleLoadSave вызван для сохранения:", save.name);
    // Для веб-платформы используем confirm, для мобильных - Alert
    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" && window.confirm(
        `Загрузить "${save.name}"?\nТекущий прогресс будет заменен.`
      );
      if (!confirmed) {
        console.log("Пользователь отменил загрузку");
        return;
      }
      console.log("Начинаем загрузку сохранения...");
      await performLoadSave(save);
    } else {
      Alert.alert(
        "Загрузить сохранение?",
        `Загрузить "${save.name}"?\nТекущий прогресс будет заменен.`,
        [
          { text: "Отмена", style: "cancel" },
          {
            text: "Загрузить",
            onPress: async () => {
              console.log("Начинаем загрузку сохранения...");
              await performLoadSave(save);
            },
          },
        ]
      );
    }
  };

  // Выполнение загрузки сохранения
  const performLoadSave = async (save: GameSave) => {
    try {
      console.log("Обновляем данные игрока...", save.playerData);
      await updatePlayer(save.playerData);
      console.log("Данные игрока обновлены");
      
      setIndex(0);
      setModalType("none");
      
      // Переходим на соответствующий день
      const targetDay = save.playerData.currentDay;
      console.log("Переходим на день:", targetDay);
      
      if (targetDay > 3) {
        if (save.playerData.academic <= 0) {
          router.push("/endings/badEnding" as never);
        } else {
          router.push("/endings/goodEnding" as never);
        }
      } else {
        router.push(`/day${targetDay}` as never);
      }
      
      // Не показываем alert после загрузки, так как происходит переход
      console.log("Сохранение загружено успешно, переход выполнен");
    } catch (error) {
      console.error("Ошибка загрузки сохранения:", error);
      if (Platform.OS === "web") {
        alert("Ошибка: Не удалось загрузить сохранение");
      } else {
        Alert.alert("Ошибка", "Не удалось загрузить сохранение");
      }
    }
  };

  // Начало редактирования имени
  const handleStartEdit = (save: GameSave) => {
    setEditingId(save.id);
    setEditName(save.name);
  };

  // Сохранение измененного имени
  const handleSaveEdit = async (saveId: string) => {
    if (!editName.trim()) {
      Alert.alert("Ошибка", "Имя не может быть пустым");
      return;
    }

    try {
      const success = await saveSlotsService.updateSaveName(saveId, editName.trim());
      if (success) {
        setEditingId(null);
        setEditName("");
        await loadSaves();
      } else {
        Alert.alert("Ошибка", "Не удалось обновить имя");
      }
    } catch (error) {
      console.error("Ошибка обновления имени:", error);
      Alert.alert("Ошибка", "Не удалось обновить имя");
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Удаление сохранения
  const handleDeleteSave = (save: GameSave) => {
    console.log("handleDeleteSave вызван для сохранения:", save.name, save.id);
    // Для веб-платформы используем confirm, для мобильных - Alert
    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" && window.confirm(
        `Вы уверены, что хотите удалить "${save.name}"?`
      );
      if (confirmed) {
        console.log("Начинаем удаление сохранения...");
        performDeleteSave(save);
      } else {
        console.log("Пользователь отменил удаление");
      }
    } else {
      Alert.alert(
        "Удалить сохранение?",
        `Вы уверены, что хотите удалить "${save.name}"?`,
        [
          { 
            text: "Отмена", 
            style: "cancel",
          },
          {
            text: "Удалить",
            style: "destructive",
            onPress: () => {
              console.log("Начинаем удаление сохранения...");
              performDeleteSave(save);
            },
          },
        ]
      );
    }
  };

  // Выполнение удаления сохранения
  const performDeleteSave = async (save: GameSave) => {
    try {
      console.log("Удаляем сохранение с ID:", save.id);
      const success = await saveSlotsService.deleteSave(save.id);
      console.log("Результат удаления:", success);
      
      if (success) {
        console.log("Перезагружаем список сохранений...");
        await loadSaves();
        if (Platform.OS === "web") {
          alert("Сохранение удалено");
        } else {
          Alert.alert("Успех", "Сохранение удалено");
        }
      } else {
        console.error("Не удалось удалить сохранение - метод вернул false");
        if (Platform.OS === "web") {
          alert("Ошибка: Не удалось удалить сохранение");
        } else {
          Alert.alert("Ошибка", "Не удалось удалить сохранение");
        }
      }
    } catch (error) {
      console.error("Ошибка удаления сохранения:", error);
      if (Platform.OS === "web") {
        alert(`Ошибка: ${error instanceof Error ? error.message : "Не удалось удалить сохранение"}`);
      } else {
        Alert.alert("Ошибка", `Не удалось удалить сохранение: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
      }
    }
  };

  // Форматирование даты
  const formatDate = (date: Date | Timestamp) => {
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ModalWindow visible={isVisible} onClose={() => setModalType("none")}>
      <Text style={{ color: "white", fontSize: 18, textAlign: "center", marginBottom: 16 }}>
        Управление сохранениями
      </Text>

      {/* Создание нового сохранения */}
      <View style={{ marginBottom: 20, padding: 12, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 8 }}>
        <Text style={{ color: "white", marginBottom: 8, fontSize: 14 }}>Создать новое сохранение</Text>
        <TextInput
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            padding: 8,
            borderRadius: 4,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.3)",
          }}
          placeholder="Имя сохранения"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={newSaveName}
          onChangeText={setNewSaveName}
          maxLength={30}
        />
        <Button
          title={creating ? "Создание..." : "Создать сохранение"}
          onPress={handleCreateSave}
          disabled={creating || !newSaveName.trim()}
        />
      </View>

      {/* Список сохранений */}
      <Text style={{ color: "white", marginBottom: 8, fontSize: 14 }}>Сохранения:</Text>
      {loading ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={primaryTextColor} />
          <Text style={{ color: "white", marginTop: 8 }}>Загрузка...</Text>
        </View>
      ) : saves.length === 0 ? (
        <Text style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", padding: 20 }}>
          Нет сохранений
        </Text>
      ) : (
        <ScrollView style={{ maxHeight: 300 }}>
          {saves.map((save) => (
            <View
              key={save.id}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
              }}
            >
              {editingId === save.id ? (
                // Режим редактирования
                <View>
                  <TextInput
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      padding: 8,
                      borderRadius: 4,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                    value={editName}
                    onChangeText={setEditName}
                    maxLength={30}
                    autoFocus
                  />
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Button
                      title="Сохранить"
                      onPress={() => handleSaveEdit(save.id)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Отмена"
                      onPress={handleCancelEdit}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              ) : (
                // Режим просмотра
                <View>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
                    {save.name}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>
                    День {save.playerData.currentDay} | 😊 {save.playerData.happiness} | 🎓 {save.playerData.academic}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 8 }}>
                    Обновлено: {formatDate(save.updatedAt)}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
                    <Button
                      title="Загрузить"
                      onPress={() => handleLoadSave(save)}
                      style={{ flex: 1, minWidth: 80 }}
                    />
                    <Button
                      title="Изменить"
                      onPress={() => handleStartEdit(save)}
                      style={{ flex: 1, minWidth: 80 }}
                    />
                    <Button
                      title="Удалить"
                      onPress={() => handleDeleteSave(save)}
                      style={{ flex: 1, minWidth: 80 }}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Button title="Закрыть" onPress={() => setModalType("none")} style={{ marginTop: 16 }} />
    </ModalWindow>
  );
};

