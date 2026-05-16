import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    schema: { example: { status: 'ok' } },
  })
  @Get()
  check() {
    return { status: 'ok' };
  }
}