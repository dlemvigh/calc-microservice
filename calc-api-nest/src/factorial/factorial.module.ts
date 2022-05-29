import { Module } from '@nestjs/common';
import { FactorialController } from './factorial.controller';
import { FactorialResolver } from './factorial.resolver';
import { FactorialService } from './factorial.service';

@Module({
  controllers: [FactorialController],
  providers: [FactorialService, FactorialResolver],
})
export class FactorialModule {}
