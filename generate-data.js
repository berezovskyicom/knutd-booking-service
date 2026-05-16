const { faker } = require('@faker-js/faker');

function createRandomBooking() {
  const startDate = faker.date.future();
  const endDate = faker.date.future({ years: 1, refDate: startDate });

  return {
    roomId: faker.string.uuid(),
    guestName: faker.person.fullName(),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

function generateBookings(count) {
  const bookings = [];

  for (let i = 0; i < count; i++) {
    bookings.push(createRandomBooking());
  }

  return bookings;
}

const testData = generateBookings(5);

console.log(JSON.stringify(testData, null, 2));