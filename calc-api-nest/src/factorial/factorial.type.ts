import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Status {
  Pending = 'Pending',
  Finished = 'Finished',
  Error = 'Error',
}

registerEnumType(Status, {
  name: 'Status',
});

@ObjectType({ description: 'factorial' })
export class Factorial {
  @Field((type) => ID)
  id: number;

  @Field((type) => Int)
  input: number;

  @Field({ nullable: true })
  output?: string;

  @Field((type) => Status)
  status: Status;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  calcStartedAt?: Date;

  @Field({ nullable: true })
  finishedAt?: Date;
}
