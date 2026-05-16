import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateBookingDto } from '../dto/create-booking.dto';

@ValidatorConstraint({ name: 'isValidBookingDates', async: false })
export class IsValidBookingDates implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const booking = args.object as CreateBookingDto;
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    if (endDate.getTime() <= startDate.getTime()) {
      return false;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return !(diffDays < 1 || diffDays > 30);
  }

  defaultMessage(args: ValidationArguments) {
    const booking = args.object as CreateBookingDto;
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    if (endDate.getTime() <= startDate.getTime()) {
      return 'Дата закінчення має бути пізнішою за дату початку.';
    }
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 1 || diffDays > 30) {
      return 'Тривалість бронювання має бути від 1 до 30 днів.';
    }
    return 'Некоректна тривалість бронювання.';
  }
}
