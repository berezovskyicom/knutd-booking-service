import { Injectable } from '@nestjs/common';

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
}
