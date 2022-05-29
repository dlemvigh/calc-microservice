import {
  NotFoundException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FactorialService } from './factorial.service';
import { Status } from './factorial.type';

@Controller('factorial')
export class FactorialController {
  constructor(private readonly factorialService: FactorialService) {}

  @Get()
  factorials() {
    return this.factorialService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Factorial found' })
  @ApiResponse({ status: 404, description: 'Factorial not found' })
  factorial(@Param('id', ParseIntPipe) id: number) {
    const factorial = this.factorialService.get(id);
    if (factorial == null) {
      throw new NotFoundException();
    }
    return factorial;
  }
}
