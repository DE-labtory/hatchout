import { Module } from '@nestjs/common';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {DatabaseModule} from './database.module';
import {UserController} from '../../web/user/user.controller';

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [UserController],
    providers: [
        {provide: 'UserService', useClass: UserServiceImpl},
    ],
})
export class UserModule {

}
