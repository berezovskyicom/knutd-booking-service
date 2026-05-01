import { Controller, Get, Param, Post, Body } from '@nestjs/common';
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
    // Конвертуємо id зі string в number.
    return this.bookingsService.findOne(+id);
  }
  // @Post() відповідає на HTTP POST запити на '/bookings'.
  // @Body() отримує дані з тіла запиту.
  @Post()
  create(@Body() booking: Omit<Booking, 'id'>): Booking {
    // Делегує виклик сервісу для створення нового бронювання.
    return this.bookingsService.create(booking);
  }
}
