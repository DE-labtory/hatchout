import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {userProviders} from './users.providers';

@Module({
  providers: [
      ...userProviders,
      UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
