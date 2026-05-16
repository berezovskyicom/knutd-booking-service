const { exec } = require('child_process');
const path = require('path');
// Функція, що виконує команди в терміналі
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
};
// Асинхронна функція для виконання тестів
async function runTests() {
  console.log("--- Запуск сервера NestJS ---");
  // Запускаємо сервер у фоновому режимі
  const serverProcess = exec('npm run start:dev');
  console.log("Сервер запущено. Чекаємо 10 секунд...");
  // Чекаємо, поки сервер запуститься
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("--- Створення бронювань ---");
  for (let i = 1; i <= 5; i++) {
    const command = `curl -X POST -H "Content-Type:
application/json" -d "{\\"roomId\\": \\"room-${i}\\", \\"guestName\\":
\\"Guest ${i}\\", \\"startDate\\": \\"2025-01-01\\", \\"endDate\\":
\\"2025-01-05\\"}" http://localhost:3000/bookings`;
    console.log(`Відправка POST-запиту: ${command}`);
    await runCommand(command);
  }
  console.log("--- Отримання всіх бронювань ---");
  await runCommand('curl http://localhost:3000/bookings');
  console.log("--- Зупинка сервера ---");
  if (serverProcess) {
    serverProcess.kill();
  }
  console.log("Тестування завершено.");
}
runTests();