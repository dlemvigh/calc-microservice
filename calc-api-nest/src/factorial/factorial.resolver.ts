import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { FactorialService } from './factorial.service';
import { Factorial } from './factorial.type';

@Resolver((of) => Factorial)
export class FactorialResolver {
  constructor(private readonly factorialService: FactorialService) {}

  @Query((returns) => [Factorial])
  async factorials() {
    return this.factorialService.getAll();
  }

  @Query((returns) => Factorial)
  factorial(@Args('id', { type: () => Int }) id: number) {
    return this.factorialService.get(id);
  }
}
