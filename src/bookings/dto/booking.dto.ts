import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  roomId: string;

  @ApiProperty({ example: 'John Doe' })
  guestName: string;

  @ApiProperty({ example: '2026-05-20' })
  startDate: string;

  @ApiProperty({ example: '2026-05-25' })
  endDate: string;
}
