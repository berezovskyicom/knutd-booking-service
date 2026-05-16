import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { HealthController } from './health.controller';

@Module({
  providers: [BookingsService, HealthController],
  controllers: [BookingsController],
})
export class BookingsModule {}
