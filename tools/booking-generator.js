const { faker } = require('@faker-js/faker');

/**
 * Модель CreateBookingDto (POST /bookings):
 * - roomId: string, обов'язковий, UUID
 * - guestName: string, обов'язковий, непорожній
 * - startDate: string, обов'язковий, ISO YYYY-MM-DD
 * - endDate: string, обов'язковий, ISO YYYY-MM-DD
 *
 * Модель Booking (відповідь): + id: number
 *
 * Бізнес-правила (IsValidBookingDates):
 * - endDate > startDate
 * - тривалість від 1 до 30 днів включно
 */

const INVALID_CATEGORIES = [
  'empty_guest',
  'invalid_uuid',
  'bad_date_format',
  'end_before_start',
  'duration_zero',
  'duration_too_long',
  'past_dates',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function createBaseFields() {
  const startDate = addDays(new Date(), randomInt(1, 365));
  return {
    roomId: faker.string.uuid(),
    guestName: faker.person.fullName(),
    startDate: formatDate(startDate),
    endDate: formatDate(addDays(startDate, randomInt(1, 30))),
  };
}

/**
 * Генерує валідне бронювання, що проходить CreateBookingDto та IsValidBookingDates.
 */
function createValidBooking() {
  const startDate = addDays(new Date(), randomInt(1, 365));
  const duration = randomInt(1, 30);

  return {
    type: 'valid',
    roomId: faker.string.uuid(),
    guestName: faker.person.fullName(),
    startDate: formatDate(startDate),
    endDate: formatDate(addDays(startDate, duration)),
  };
}

/**
 * Генерує невалідне бронювання за категорією (ротація через index).
 */
function createInvalidBooking(index = 0) {
  const category = INVALID_CATEGORIES[index % INVALID_CATEGORIES.length];
  const base = createBaseFields();
  const startDate = new Date(base.startDate);

  switch (category) {
    case 'empty_guest':
      return { type: 'invalid', invalidReason: category, ...base, guestName: '' };
    case 'invalid_uuid':
      return { type: 'invalid', invalidReason: category, ...base, roomId: 'not-a-uuid' };
    case 'bad_date_format':
      return {
        type: 'invalid',
        invalidReason: category,
        ...base,
        startDate: '20-05-2026',
        endDate: '25-05-2026',
      };
    case 'end_before_start':
      return {
        type: 'invalid',
        invalidReason: category,
        ...base,
        startDate: base.endDate,
        endDate: base.startDate,
      };
    case 'duration_zero':
      return {
        type: 'invalid',
        invalidReason: category,
        ...base,
        endDate: base.startDate,
      };
    case 'duration_too_long': {
      const longEnd = addDays(startDate, 31);
      return {
        type: 'invalid',
        invalidReason: category,
        ...base,
        endDate: formatDate(longEnd),
      };
    }
    case 'past_dates': {
      const pastStart = addDays(new Date(), -60);
      const pastEnd = addDays(pastStart, randomInt(1, 30));
      return {
        type: 'invalid',
        invalidReason: category,
        roomId: faker.string.uuid(),
        guestName: faker.person.fullName(),
        startDate: formatDate(pastStart),
        endDate: formatDate(pastEnd),
      };
    }
    default:
      return { type: 'invalid', invalidReason: category, ...base };
  }
}

/**
 * Генерує n бронювань за O(n) часу та O(n) пам'яті.
 * @param {number} count
 * @param {{ validRatio?: number, seed?: number }} [options]
 * @returns {{ bookings: object[], validCount: number, invalidCount: number }}
 */
function generateBookings(count, options = {}) {
  const validRatio = options.validRatio ?? 0.7;
  const bookings = [];
  let validCount = 0;
  let invalidCount = 0;
  let invalidIndex = 0;

  if (options.seed !== undefined) {
    faker.seed(options.seed);
  }

  for (let i = 0; i < count; i++) {
    if (Math.random() < validRatio) {
      bookings.push(createValidBooking());
      validCount++;
    } else {
      bookings.push(createInvalidBooking(invalidIndex++));
      invalidCount++;
    }
  }

  return { bookings, validCount, invalidCount };
}

function setSeed(seed) {
  faker.seed(seed);
}

module.exports = {
  createValidBooking,
  createInvalidBooking,
  generateBookings,
  setSeed,
  INVALID_CATEGORIES,
};
