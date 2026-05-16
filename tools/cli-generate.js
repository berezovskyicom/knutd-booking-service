const fs = require('fs');
const path = require('path');
const { generateBookings } = require('./booking-generator');
const { parseArgs } = require('./parse-args');

const args = parseArgs(process.argv);
const count = parseInt(args.count ?? '1000', 10);
const validRatio = parseFloat(args['valid-ratio'] ?? '0.7');
const output =
  args.output ?? path.join(__dirname, '..', 'data', `bookings-${count}.json`);
const seed = args.seed !== undefined ? parseInt(args.seed, 10) : undefined;

if (Number.isNaN(count) || count < 1) {
  console.error('Помилка: --count має бути додатним числом');
  process.exit(1);
}

const start = performance.now();
const { bookings, validCount, invalidCount } = generateBookings(count, {
  validRatio,
  seed,
});
const elapsedMs = performance.now() - start;

const payload = {
  meta: {
    count,
    validCount,
    invalidCount,
    validRatio,
    seed: seed ?? null,
    generatedAt: new Date().toISOString(),
    elapsedMs: Math.round(elapsedMs * 100) / 100,
  },
  bookings,
};

const dir = path.dirname(output);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(output, JSON.stringify(payload, null, 2));

console.log('Генерація завершена');
console.log(`  Записів:     ${count}`);
console.log(`  Валідних:    ${validCount}`);
console.log(`  Невалідних:  ${invalidCount}`);
console.log(`  Час:         ${elapsedMs.toFixed(2)} мс`);
console.log(`  Файл:        ${output}`);
