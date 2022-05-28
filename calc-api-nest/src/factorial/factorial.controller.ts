import { Controller, Get, Param } from '@nestjs/common';

@Controller('factorial')
export class FactorialController {
  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return null;
  }
}
