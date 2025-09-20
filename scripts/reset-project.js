#!/usr/bin/env node
/**
 * scripts/reset-project.js
 *
 * Скрипт для быстрого сброса проекта в "чистое" состояние.
 * ВНИМАНИЕ: Скрипт может удалить директории — перед запуском убедитесь в резервной копии!
 *
 * Поведение:
 *  - спрашивает пользователя: переместить старые директории в /app-example или удалить их
 *  - создаёт новую директорию /app с index.tsx и _layout.tsx
 *
 * Примечания и рекомендации:
 *  - Убедитесь, что в package.json указан "reset-project": "node scripts/reset-project.js" если хотите запускать через npm run reset-project
 *  - Этот скрипт удобен на начальном этапе проекта, но НЕ для продакшен-репозиториев с важными данными.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd(); // корень проекта (где запускается скрипт)
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

// Шаблон для нового index.tsx — очень минимальный экран
const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

// Шаблон для _layout.tsx — минимальный Stack-layout
const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

// Простейший CLI ввод через readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Основная логика:
 *  - если пользователь отвечает 'y' — будут созданы app-example и в него перемещены старые директории
 *  - если 'n' — старые директории будут удалены (recursive)
 *  - затем создаётся новый /app со стандартным index/_layout
 */
const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Создаём /app-example (если ещё нет)
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          // Перемещаем директорию в app-example
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          // Удаляем рекурсивно — ОПАСНО
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Создаём новую директорию /app (если ещё нет)
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Пишем базовый index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Пишем базовый _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    // Отлавливаем и печатаем ошибку — важно для отладки прав доступа и т.п.
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);