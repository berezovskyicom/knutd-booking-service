const { faker } = require('@faker-js/faker');

const generateBvaBookings = () => {
  const bookings = [];
  const baseDate = new Date('2025-01-01');

  bookings.push({
    roomId: 'BVA-0',
    guestName: faker.person.fullName(),
    startDate: baseDate.toISOString().split('T')[0],
    endDate: baseDate.toISOString().split('T')[0],
  });

  const date1 = new Date(baseDate);
  date1.setDate(baseDate.getDate() + 1);

  bookings.push({
    roomId: 'BVA-1',
    guestName: faker.person.fullName(),
    startDate: baseDate.toISOString().split('T')[0],
    endDate: date1.toISOString().split('T')[0]
  });

  const date31 = new Date(baseDate);
  date31.setDate(baseDate.getDate() + 31);

  bookings.push({
    roomId: 'BVA-31',
    guestName: faker.person.fullName(),
    startDate: baseDate.toISOString().split('T')[0],
    endDate: date31.toISOString().split('T')[0]
  });

  return bookings;
};

module.exports = { generateBvaBookings };

console.log(JSON.stringify(generateBvaBookings(), null, 2));