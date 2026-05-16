import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsValidBookingDates } from '../validators/is-valid-booking-dates.validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Room UUID',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString({ message: 'Ідентифікатор кімнати має бути рядком' })
  roomId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Імʼя гостя не може бути порожнім' })
  @IsString({ message: 'Імʼя гостя має бути рядком' })
  guestName: string;

  @ApiProperty({ example: '2026-05-20' })
  @IsNotEmpty({ message: 'Дата початку бронювання не може бути порожньою' })
  @IsDateString({}, { message: 'Дата початку має бути дійсною датою' })
  startDate: string;

  @ApiProperty({ example: '2026-05-25' })
  @IsNotEmpty({ message: 'Дата закінчення бронювання не може бути порожньою' })
  @IsDateString({}, { message: 'Дата закінчення має бути дійсною датою' })
  endDate: string;

  @ApiHideProperty()
  @Validate(IsValidBookingDates)
  datesAreValid: string = 'datesAreValid';
}
