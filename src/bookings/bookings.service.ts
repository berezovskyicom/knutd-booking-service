import { Injectable, NotFoundException } from '@nestjs/common';

export interface Booking {
  id: number;
  roomId: string;
  guestName: string;
  startDate: string;
  endDate: string;
}

@Injectable()
export class BookingsService {
  // Приватний масив для зберігання бронювань у пам'яті.
  private bookings: Booking[] = [];
  // Лічильник для генерації унікальних ID.
  private nextId = 1;
  /**
   * Повертає список усіх бронювань.
   * Відповідає за логіку читання даних.
   */
  findAll(): Booking[] {
    return this.bookings;
  }
  /**
   * Знаходить бронювання за ідентифікатором.
   * @param id - Ідентифікатор бронювання.
   */
  findOne(id: number): Booking | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }
  /**
   * Створює нове бронювання і додає його до списку.
   * @param booking - Об'єкт бронювання без ID.
   */
  create(booking: Omit<Booking, 'id'>): Booking {
    const newBooking = { id: this.nextId++, ...booking };
    this.bookings.push(newBooking);
    return newBooking;
  }

  /**
   * Метод для оновлення існуючого бронювання.
   * @param id - Ідентифікатор бронювання, яке потрібно оновити.
   * @param updatedBooking - Нові дані для бронювання.
   * @returns Оновлене бронювання.
   * @throws NotFoundException, якщо бронювання не знайдено.
   */
  update(id: number, updatedBooking: Omit<Booking, 'id'>): Booking {
    // Шукаємо індекс елемента в масиві.
    const index = this.bookings.findIndex((booking) => booking.id === id);
    // Якщо індекс -1, це означає, що елемент не знайдено.
    if (index === -1) {
      // Викидаємо виняток, який буде оброблений NestJS як HTTP 404.
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }
    const bookingToUpdate = this.bookings[index];
    // Оновлюємо об'єкт, використовуючи оператор spread.
    this.bookings[index] = {
      ...bookingToUpdate,
      ...updatedBooking,
      id,
    };
    return this.bookings[index];
  }

  /**
   * Метод для видалення бронювання.
   * @param id - Ідентифікатор бронювання, яке потрібно видалити.
   * @returns true, якщо видалення успішне.
   * @throws NotFoundException, якщо бронювання не знайдено.
   */
  delete(id: number): boolean {
    // Шукаємо індекс елемента в масиві.
    const index = this.bookings.findIndex((booking) => booking.id === id);
    // Якщо елемент не знайдено, викидаємо виняток.
    if (index === -1) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }
    // Видаляємо елемент з масиву, починаючи з індексу 'index' і один елемент.
    this.bookings.splice(index, 1);
    return true;
  }
}
