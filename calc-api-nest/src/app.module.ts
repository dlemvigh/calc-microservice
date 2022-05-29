import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactorialModule } from './factorial/factorial.module';

@Module({
  imports: [
    FactorialModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.sql',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
