const { generateBookings } = require('./booking-generator');
const { parseArgs } = require('./parse-args');

const args = parseArgs(process.argv);
const sizes = (args.sizes ?? '1000,10000,100000')
  .split(',')
  .map((s) => parseInt(s.trim(), 10));
const runs = parseInt(args.runs ?? '5', 10);
const seed = parseInt(args.seed ?? '42', 10);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function forceGc() {
  if (typeof global.gc === 'function') {
    global.gc();
  }
}

function measureOnce(n) {
  forceGc();
  const memBefore = process.memoryUsage().heapUsed;
  const start = performance.now();
  const { bookings } = generateBookings(n, { validRatio: 0.7, seed });
  const elapsedMs = performance.now() - start;
  const memAfter = process.memoryUsage().heapUsed;
  const heapDeltaMb = (memAfter - memBefore) / 1024 / 1024;

  return {
    elapsedMs,
    heapDeltaMb,
    count: bookings.length
  };
}

function benchmarkSize(n) {
  const times = [];
  const heaps = [];

  for (let r = 0; r < runs; r++) {
    const { elapsedMs, heapDeltaMb } = measureOnce(n);
    times.push(elapsedMs);
    heaps.push(heapDeltaMb);
  }

  const timeMs = median(times);
  const heapMb = median(heaps);
  const timePerRecordUs = (timeMs / n) * 1000;

  return { n, timeMs, heapMb, timePerRecordUs, runs };
}

console.log(`Benchmark генерації бронювань (${runs} прогонів, медіана, seed=${seed})\n`);

const results = sizes.map(benchmarkSize);

const header = ['n', 'час (мс)', 'heap Δ (MB)', 'час/n (мкс)'];
const rows = results.map((r) => [
  r.n.toString(),
  r.timeMs.toFixed(2),
  r.heapMb.toFixed(2),
  r.timePerRecordUs.toFixed(3),
]);

const colWidths = header.map((h, i) =>
  Math.max(h.length, ...rows.map((row) => row[i].length)),
);

function padRow(cells) {
  return cells.map((c, i) => c.padStart(colWidths[i])).join('  ');
}

console.log(padRow(header));
console.log(padRow(colWidths.map((w) => '-'.repeat(w))));
rows.forEach((row) => console.log(padRow(row)));

if (results.length >= 2) {
  const r1 = results[0];
  const r2 = results[1];
  const timeRatio = r2.timeMs / r1.timeMs;
  const sizeRatio = r2.n / r1.n;
  console.log(
    `\nСпіввідношення часу ${r2.n}/${r1.n}: ${timeRatio.toFixed(2)} (очікувано ≈ ${sizeRatio.toFixed(2)} для O(n))`,
  );
}

console.log('\nJSON для звіту:');
console.log(JSON.stringify(results, null, 2));
