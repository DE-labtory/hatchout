import { Module } from '@nestjs/common';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {UserRepository} from '../persistence/repository/user.repository.impl';

@Module({
    providers: [
        UserServiceImpl,
        {provide: 'IUserRepository', useClass: UserRepository},
    ],
})
export class UserModule {

}
