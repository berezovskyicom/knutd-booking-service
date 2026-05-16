import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsValidBookingDates } from '../validators/is-valid-booking-dates.validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString({ message: 'Ідентифікатор кімнати має бути рядком' })
  roomId: string;

  @IsNotEmpty({ message: 'Імʼя гостя не може бути порожнім' })
  @IsString({ message: 'Імʼя гостя має бути рядком' })
  guestName: string;

  @IsNotEmpty({ message: 'Дата початку бронювання не може бути порожньою' })
  @IsDateString({}, { message: 'Дата початку має бути дійсною датою' })
  startDate: string;

  @IsNotEmpty({ message: 'Дата закінчення бронювання не може бути порожньою' })
  @IsDateString({}, { message: 'Дата закінчення має бути дійсною датою' })
  endDate: string;

  @Validate(IsValidBookingDates)
  datesAreValid: string = 'datesAreValid';
}
