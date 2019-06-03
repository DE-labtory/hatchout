import { Module } from '@nestjs/common';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {UserRepository} from '../persistence/repository/user.repository.impl';
import {UserController} from '../../web/user/user.controller';

@Module({
    controllers: [UserController],
    providers: [
        {provide: 'UserService', useClass: UserServiceImpl},
        {provide: 'IUserRepository', useClass: UserRepository},
    ],
})
export class UserModule {

}
