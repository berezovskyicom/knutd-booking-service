const { exec } = require('child_process');
const { generateBvaBookings } = require('./generator-bva.js');

const runTest = (payload, testName, expectedSuccess) => {
  return new Promise((resolve) => {
      const command = `curl -X POST -H "Content-Type:
application/json" -d "${payload.replace(/"/g, '\\"')}"
http://localhost:3000/bookings`;

    exec(command, (err, stdout) => {
      console.log(`\nТест: ${testName}`);
      let response;
      try {
        response = JSON.parse(stdout);
      } catch (jsonError) {
        console.log(`Результат: ❓ Помилка парсингу JSON: ${jsonError.message}`);
        console.log(`Відповідь сервера: ${stdout}`);
        return resolve();
      }

      if (expectedSuccess) {
        const isSuccess = response && response.id > 0;

        if (isSuccess) {
          console.log(`Результат: ✅ Успішно! Створено бронювання з ID ${response.id}`);
        } else {
          console.log(`Результат: ❌ Помилка! Сервіс повернув неочікувану відповідь: ${stdout}`);
        }
      }
      else {
        if (response.statusCode === 400 || response.statusCode === 404) {
          console.log(`Результат: ✅ Успішно! Сервіс повернув очікувану помилку ${response.statusCode}`);
        } else {
          console.log(`Результат: ❌ Помилка! Сервіс не повернув очікувану помилку. Отримано: ${stdout}`);
        }
      }

      resolve();
    });
  });
};
const testBva = async () => {
  const testData = generateBvaBookings();
  console.log("--- Виконання BVA-тестів ---");
  await runTest(JSON.stringify(testData[0]), '0 днів (некоректне)', false);
  await runTest(JSON.stringify(testData[1]), '1 день (нижня межа)', true);
  await runTest(JSON.stringify(testData[2]), '31 день (верхня межа)', false);
  console.log("\n--- BVA-тестування завершено ---")
};

testBva();