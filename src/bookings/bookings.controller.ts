import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Put,
  Delete,
  HttpCode,
  HttpException,
} from '@nestjs/common';
// Імпортуємо наш сервіс та інтерфейс Booking.
import { BookingsService, type Booking } from './bookings.service';

// Декоратор @Controller('bookings') визначає базовий маршрут для цього контролера.
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  // @Get() відповідає на HTTP GET запити на '/bookings'.
  @Get()
  findAll(): Booking[] {
    // Делегує виклик сервісу для отримання всіх бронювань.
    return this.bookingsService.findAll();
  }
  // @Get(':id') відповідає на HTTP GET запити на '/bookings/{id}'.
  // @Param('id') витягує параметр 'id' з URL.
  @Get(':id')
  findOne(@Param('id') id: string): Booking | undefined {
    // Знак '+' перед 'id' конвертує рядок у число.
    const booking = this.bookingsService.findOne(+id);
    if (!booking) {
      // Якщо сервіс повернув undefined, викидаємо HTTP-виняток 404.
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }
    return booking;
  }
  // @Post() відповідає на HTTP POST запити на '/bookings'.
  // @Body() отримує дані з тіла запиту.
  @Post()
  create(@Body() booking: Omit<Booking, 'id'>): Booking {
    // Делегує виклик сервісу для створення нового бронювання.
    return this.bookingsService.create(booking);
  }

  /**
   * Обробляє PUT-запити на маршрут /bookings/:id.
   * @param id - Ідентифікатор бронювання з URL.
   * @param booking - Оновлені дані з тіла запиту.
   * @returns Оновлене бронювання.
   * @throws NotFoundException, якщо бронювання не знайдено.
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() booking: Omit<Booking, 'id'>,
  ): Booking {
    try {
      return this.bookingsService.update(+id, booking);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Якщо виникає інша помилка, повертаємо HTTP 500.
      throw new HttpException('Internal Server Error', 500);
    }
  }

  /**
   * Обробляє DELETE-запити на маршрут /bookings/:id.
   * @param id - Ідентифікатор бронювання з URL.
   * @throws NotFoundException, якщо бронювання не знайдено.
   */
  @Delete(':id')
  // Декоратор @HttpCode(204) змінює стандартний код відповіді на '204 No Content'.
  // Це є кращою практикою для успішних DELETE-запитів.
  @HttpCode(204) // No Content
  delete(@Param('id') id: string): void {
    this.bookingsService.delete(+id);
  }
}
