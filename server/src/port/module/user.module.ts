import { Module } from '@nestjs/common';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {DatabaseModule} from './database.module';

@Module({
    imports: [
        DatabaseModule,
    ],
    providers: [
        {provide: 'UserService', useClass: UserServiceImpl},
    ],
})
export class UserModule {

}
