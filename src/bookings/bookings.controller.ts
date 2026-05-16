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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
// Імпортуємо наш сервіс та інтерфейс Booking.
import { BookingsService, type Booking } from './bookings.service';
import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('bookings')
// Декоратор @Controller('bookings') визначає базовий маршрут для цього контролера.
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiOkResponse({ type: BookingDto, isArray: true })
  // @Get() відповідає на HTTP GET запити на '/bookings'.
  @Get()
  findAll(): Booking[] {
    // Делегує виклик сервісу для отримання всіх бронювань.
    return this.bookingsService.findAll();
  }
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: BookingDto })
  @ApiNotFoundResponse({ description: 'Booking not found' })
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
  @ApiOperation({ summary: 'Create a booking' })
  @ApiCreatedResponse({ type: BookingDto })
  // @Post() відповідає на HTTP POST запити на '/bookings'.
  // @Body() отримує дані з тіла запиту.
  @Post()
  create(@Body() booking: CreateBookingDto): Booking {
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
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: BookingDto })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @Put(':id')
  update(@Param('id') id: string, @Body() booking: CreateBookingDto): Booking {
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
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Booking deleted' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @Delete(':id')
  // Декоратор @HttpCode(204) змінює стандартний код відповіді на '204 No Content'.
  // Це є кращою практикою для успішних DELETE-запитів.
  @HttpCode(204) // No Content
  delete(@Param('id') id: string): void {
    this.bookingsService.delete(+id);
  }
}
