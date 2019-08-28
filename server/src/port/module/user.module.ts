import { Module } from '@nestjs/common';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {UserController} from '../../web/user/user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserRepository} from '../persistence/repository/user.repository.impl';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [UserController],
    providers: [
        {
            provide: 'UserService',
            useClass: UserServiceImpl,
        },
    ],
  exports: [
    {
      provide: 'UserService',
      useClass: UserServiceImpl,
    },
  ],
})
export class UserModule {

}
