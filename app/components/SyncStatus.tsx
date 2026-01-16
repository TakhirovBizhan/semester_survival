import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { firebaseSync, SyncStatus as SyncStatusType } from "../services/firebaseSync";
import { primaryTextColor } from "../config/Colors";

interface SyncStatusProps {
  compact?: boolean; // Компактный режим (только иконка)
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ compact = false }) => {
  const [status, setStatus] = useState<SyncStatusType>("idle");
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    // Загружаем начальные данные
    loadStats();

    // Подписываемся на изменения статуса
    const unsubscribe = firebaseSync.onStatusChange((newStatus) => {
      setStatus(newStatus);
      loadStats();
    });

    // Периодическое обновление (каждые 5 секунд)
    const interval = setInterval(() => {
      loadStats();
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadStats = async () => {
    try {
      const stats = await firebaseSync.getSyncStats();
      setLastSync(stats.lastSync);
      setQueueLength(stats.queueLength);
      
      // Обновляем статус если есть очередь
      if (stats.queueLength > 0 && status === "idle") {
        setStatus("offline");
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики синхронизации:", error);
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case "syncing":
        return "Синхронизация...";
      case "success":
        return "Синхронизировано";
      case "error":
        return "Ошибка синхронизации";
      case "offline":
        return queueLength > 0 ? `В очереди: ${queueLength}` : "Оффлайн";
      default:
        return "Готово";
    }
  };

  const getStatusIcon = (): React.ReactNode => {
    switch (status) {
      case "syncing":
        return <ActivityIndicator size="small" color={primaryTextColor} />;
      case "success":
        return <Text style={styles.icon}>✓</Text>;
      case "error":
        return <Text style={styles.icon}>⚠</Text>;
      case "offline":
        return <Text style={styles.icon}>📡</Text>;
      default:
        return <Text style={styles.icon}>○</Text>;
    }
  };

  const formatLastSync = (): string => {
    if (!lastSync) return "Никогда";
    
    const diff = Date.now() - lastSync;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return "Только что";
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {getStatusIcon()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        {getStatusIcon()}
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      {lastSync && status === "success" && (
        <Text style={styles.lastSyncText}>Обновлено: {formatLastSync()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    marginVertical: 4,
  },
  compactContainer: {
    padding: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    color: primaryTextColor,
    fontSize: 12,
    fontFamily: "monospace",
  },
  lastSyncText: {
    color: primaryTextColor,
    fontSize: 10,
    fontFamily: "monospace",
    opacity: 0.7,
    marginTop: 4,
  },
  icon: {
    color: primaryTextColor,
    fontSize: 14,
    fontFamily: "monospace",
  },
});

