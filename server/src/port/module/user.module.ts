import {Module} from '@nestjs/common';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {UserController} from '../../web/user/user.controller';

@Module({
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
